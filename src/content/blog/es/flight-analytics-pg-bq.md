---
title: "Qué 5.74 Millones de Vuelos me Enseñaron sobre PostgreSQL, BigQuery y Cuándo Usar Cada Uno"
description: "Un análisis profundo en ingeniería de datos: construir SQL analytics de nivel producción sobre datos reales de aerolíneas, migrar a BigQuery vía Python ETL, y los trade-offs honestos entre ambos sistemas con timing real, costos reales y planes de consulta reales."
date: "2026-03-18"
lastModified: "2026-03-30"
category: "proyectos-y-analisis"
lang: "es"
tags: ["PostgreSQL", "BigQuery", "Python", "ETL", "EXPLAIN ANALYZE", "Docker", "GIS", "Plotly", "Folium", "data-engineering"]
---

Todo ingeniero de datos eventualmente enfrenta la misma pregunta: ¿debería esta carga de trabajo vivir en una base de datos relacional o en un warehouse analítico? La respuesta de libro de texto es correcta pero inútil: "usa PostgreSQL para OLTP, BigQuery para OLAP". No te dice *dónde está el punto de cruce*, *cómo difieren los planes de consulta*, o *qué pierdes cuando migras*. Este proyecto responde esas preguntas con datos reales, timing real e infraestructura real.

## El dataset: 5.74 millones de registros de operaciones aéreas rusas

La <a href="https://postgrespro.com/community/demodb" target="_blank" rel="noopener">base de datos demo de PostgresPro Airlines</a> contiene horarios reales de vuelos en 104 aeropuertos rusos: reservaciones, boletos, vuelos, tarjetas de abordar, mapas de asientos y especificaciones de aeronaves. Ocho tablas, 5.74 millones de filas, JSONB para nombres multilingües, un tipo `point` para coordenadas de aeropuertos y timestamps con conciencia de zona horaria. Es el tipo de esquema desordenado y real que expone las diferencias entre bases de datos mucho mejor que cualquier ejemplo de juguete.

La primera pregunta que hice fue simple: **¿qué rutas pierden más tiempo en retrasos, y cómo se concentra el ingresos en la red?**

## Fase 1: SQL analytics con métricas reales

Cada análisis comenzó con una pregunta de negocio, no una técnica. El script de retrasos pregunta "¿qué rutas tienen la mayor tasa de retrasos?" y descubre que la ruta Voronezh-a-Pulkovo lidera con 11.1% (10 de 90 vuelos retrasados más de 15 minutos). El script de ingresos revela algo más sorprendente: la clase Económica captura el 70.8% de ingresos desde el 88% de boletos, mientras que Ejecutiva obtiene el 26.5% de apenas el 10%. Esa concentración tiene implicaciones directas en precios.

El análisis de utilización descubrió algo llamativo: los Boeing 777-300 operan con un factor de ocupación promedio de 72.8%, mientras que los Cessna 208 Caravans solo alcanzan 16%. Ese no es un problema de aviones pequeños; es un problema de diseño de red. Esos Cessnas sirven rutas donde simplemente no se están emitiendo tarjetas de abordar en el dataset, lo que sugiere tanto incompletitud de datos como rutas regionales genuinamente subutilizadas.

Los scripts están en el directorio `analysis/`, listos para ejecutarse.

## Fase 2: Entendiendo el motor de PostgreSQL

Saber sintaxis SQL es lo básico. Entender *por qué* una consulta tarda 1,283 milisegundos en lugar de 2.6 milisegundos es lo que separa a un desarrollador de un ingeniero.

El directorio `internals/` contiene seis scripts que profundizan en el motor de PostgreSQL:

**EXPLAIN ANALYZE** fue revelador. Un filtro simple en `flights WHERE departure_airport = 'SVO' AND status = 'Arrived'` estaba escaneando todas 65,664 filas con un Sequential Scan (33.9ms). Creé un índice compuesto en `(departure_airport, status)` y la misma consulta cambió a un Bitmap Index Scan, terminando en 2.6ms. Eso es una **mejora de 13x** con un único statement `CREATE INDEX`.

**Las vistas materializadas** entregaron el resultado más dramático. Un resumen de retrasos de ruta que tardaba 174ms en tablas crudas; desde la vista materializada, los mismos datos en 0.13ms. Eso es **1,300x más rápido**. El trade-off es el desfase: debes `REFRESH MATERIALIZED VIEW CONCURRENTLY` para actualizar sin bloquear lecturas.

**El particionamiento** muestra otra victoria del diseño de esquema inteligente. Particionar la tabla flights por rango mensual habilita partition pruning: una consulta para vuelos de julio de 2017 escanea solo la partición de julio, no toda la tabla. El output de EXPLAIN explícitamente muestra "Partitions selected: 1 of 5."

**La sintonización de VACUUM** expuso la mecánica de MVCC. Después de actualizar 50,000 filas, la tabla contenía 50,000 dead tuples consumiendo espacio. Un VACUUM estándar marca ese espacio como reutilizable (pero no encoge el archivo); VACUUM FULL reescribe la tabla completa para recuperar espacio pero demanda un lock exclusivo.

**WAL y checkpoints** revelaron trade-offs que no había apreciado completamente. Una operación bulk generando 100,000 inserciones y 100,000 updates produce volumen de WAL medible. Configurar `synchronous_commit = off` puede acelerar escrituras, pero pierdes los últimos ~600ms de commits en un crash. Aceptable para analytics; nunca para transacciones financieras.

Las mismas decisiones aplican al configurar una instancia PostgreSQL en Cloud SQL.

## Fase 3: Migración a BigQuery

El pipeline de migración es cuatro archivos Python: `extract.py` lee de PostgreSQL usando cursores en batch (56,000 filas/segundo), `transform.py` aplana columnas JSONB y convierte el tipo `point` a floats `latitude`/`longitude`, y `load.py` empuja DataFrames a BigQuery usando Application Default Credentials. El pipeline completo mueve 5.74 millones de filas en 102 segundos.

La traducción de esquema expuso cada diferencia entre los dos sistemas. La columna JSONB de PostgreSQL `airport_name` (almacenando `{"en": "Sheremetyevo", "ru": "..."}`) se convirtió en dos columnas planas: `airport_name_en` y `airport_name_ru`. El tipo `point` para coordenadas se convirtió en columnas separadas `longitude` y `latitude` FLOAT64. Los campos `character(3)` de longitud fija necesitaban espacios finales removidos. Todos los `timestamptz` se normalizaron a UTC (BigQuery almacena todos los timestamps en UTC).

La autenticación con BigQuery usa Application Default Credentials, sin archivos de servicio manuales.

## Fase 4: PostgreSQL vs BigQuery, comparados

Ejecuté las mismas consultas de negocio en ambos sistemas y registré timing actual:

| Consulta | PostgreSQL (indexado) | BigQuery |
|:------|:--------------------|:---------|
| Análisis de retrasos de ruta (49K filas, 2 JOINs) | 111ms | ~1.5s |
| Ingresos por clase tarifa (2.3M filas) | 1,635ms | ~1.2s |
| Point lookup (1 vuelo por ID) | 2.6ms | ~800ms |
| Consulta de vista materializada | 0.13ms | N/A |

**PostgreSQL gana en point lookups**: con un índice apropiado, un lookup de fila única tarda 2.6ms. El tiempo de consulta mínimo de BigQuery es ~500ms por overhead de job scheduling. Para un backend API sirviendo registros de vuelos individuales, PostgreSQL es **300x más rápido**.

**BigQuery gana en analytics de tabla completa**: la consulta de ingresos escaneando 2.3 millones de filas de `ticket_flights` corrió más rápido en BigQuery (1.2s vs 1.6s) sin ningún diseño de índice. El almacenamiento columnar y ejecución paralela manejan agregaciones grandes naturalmente.

**El costo cuenta la historia real.** Para este dataset de 500MB con consultas analíticas, BigQuery cuesta ~\$0.25/mes (pago por consulta en \$5/TB). La instancia más pequeña de Cloud SQL cuesta ~\$7/mes. A escala, la brecha se ensancha aún más: BigQuery cobra por lo que escaneas, Cloud SQL cobra por lo que provisiones.

La conclusión no es "BigQuery es mejor." Es "usa PostgreSQL para OLTP y point lookups, BigQuery para OLAP y analytics ad-hoc, y construye un pipeline entre ellos." Este proyecto implementa exactamente ese patrón.

## Fase 5: Análisis geoespacial y visualización

Las coordenadas de aeropuertos habilitaron una capa geoespacial que demuestra las capacidades GIS de ambos sistemas. En PostgreSQL, escribí una función haversine en PL/pgSQL para calcular distancias de gran círculo desde el tipo `point`. En BigQuery, el mismo cálculo usa `ST_GEOGPOINT()` y `ST_DISTANCE()`, funciones incorporadas sin necesidad de código personalizado.

El análisis de distancias reveló un patrón inesperado: las tasas de retrasos no correlacionan linealmente con la longitud de ruta. Rutas cortas (<500km) y rutas muy largas (4,000km+) muestran porcentajes de retrasos similares. El peor desempeño se concentra en el rango de 500-2,000km, donde la presión de rotación es más alta y las tripulaciones no tienen tiempo para recuperarse completamente.

Un notebook Jupyter une todo: gráficos interactivos de plotly (mapas de calor de retrasos, curvas Pareto de ingresos, rankings de factor de ocupación, comparaciones antes/después de optimización) más mapas folium mostrando la red de rutas coloreada por severidad de retraso. El mapa de rutas es el centro visual del proyecto: 104 aeropuertos conectados por líneas que cambian de verde a rojo conforme aumentan los retrasos, haciendo el estrés de la red inmediatamente visible.

## Fase 6: Dashboard interactivo

El <a href="https://project-ad7a5be2-a1c7-4510-82d.firebaseapp.com/" target="_blank" rel="noopener">dashboard</a> toma los resultados de las cinco fases anteriores y los hace explorables en el navegador. Está desplegado en Firebase, es bilingüe (EN/ES) y se alimenta del mismo output SQL que ya existe en el proyecto.

En el mapa se pueden filtrar las 532 rutas por aeropuerto, colorearlas por tasa de retraso o por volumen, y ver cómo la concentración de los tres hubs de Moscú contrasta con la conectividad delgada del este de Rusia. Los retrasos de la Fase 1 y las distancias de la Fase 5 cobran otra dimensión cuando se exploran geográficamente.

La sección de internals traduce los resultados de la Fase 2 a barras comparativas: la mejora de 13x por índice compuesto y la vista materializada 1,300x se ven lado a lado, sin necesidad de leer output de EXPLAIN. La sección de pipeline muestra las métricas de la Fase 3 (filas/segundo, tiempos de carga) junto a la tabla comparativa de la Fase 4.

En ingresos se puede recorrer la curva de Pareto y ver que el 20% de las rutas concentra el 80% del ingreso. En flota, la ocupación del Boeing 777 al 73% junto al Cessna 208 al 16% queda expuesta como pregunta abierta: ¿datos incompletos o diseño de red?

Todo corre sobre JSON pre-extraído. Sin conexión a base de datos, sin costo de hosting.

## Aprendizajes

Trabajar con el mismo dataset en PostgreSQL, BigQuery y un dashboard dejó claro que cada capa resuelve un problema distinto y que elegir entre ellas depende de la pregunta que se esté haciendo:

1. **PostgreSQL**: EXPLAIN ANALYZE, estrategia de índices, particionamiento, VACUUM y WAL son decisiones de configuración, no solo sintaxis
2. **Python ETL**: la extracción con cursores en batch, la transformación de tipos como JSONB y `point`, y la carga a BigQuery forman el puente entre los dos sistemas
3. **BigQuery**: la traducción de esquema expone diferencias reales en cómo cada sistema maneja tipos, timestamps y funciones geoespaciales
4. **Trade-offs**: PostgreSQL es mejor para lookups puntuales, BigQuery para escaneos masivos; el costo se comporta de forma opuesta en cada uno
5. **Visualización geoespacial**: la misma pregunta de distancia resuelta con haversine en PL/pgSQL y con `ST_DISTANCE` en BigQuery muestra dos formas de pensar el problema
6. **Dashboard**: convertir resultados de consulta en JSON estático y servirlos desde Firebase cierra el ciclo entre análisis y comunicación

El código fuente está en <a href="https://github.com/GonorAndres/learning-posgre" target="_blank" rel="noopener">github.com/GonorAndres/learning-posgre</a> y el dashboard en <a href="https://project-ad7a5be2-a1c7-4510-82d.firebaseapp.com/" target="_blank" rel="noopener">project-ad7a5be2-a1c7-4510-82d.firebaseapp.com</a>. El pipeline se reproduce con `docker compose up` y un proyecto de GCP.
