---
title: "Qué 5.74 Millones de Vuelos me Enseñaron sobre PostgreSQL, BigQuery y Cuándo Usar Cada Uno"
description: "Un análisis profundo en ingeniería de datos: construir SQL analytics de nivel producción sobre datos reales de aerolíneas, migrar a BigQuery vía Python ETL, y los trade-offs honestos entre ambos sistemas -- con timing real, costos reales y planes de consulta reales."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "es"
tags: ["PostgreSQL", "BigQuery", "Python", "ETL", "EXPLAIN ANALYZE", "Docker", "GIS", "Plotly", "Folium", "data-engineering"]
---

Todo ingeniero de datos eventualmente enfrenta la misma pregunta: ¿debería esta carga de trabajo vivir en una base de datos relacional o en un warehouse analítico? La respuesta de libro de texto -- "usa PostgreSQL para OLTP, BigQuery para OLAP" -- es correcta pero inútil. No te dice *dónde está el punto de cruce*, *cómo difieren los planes de consulta*, o *qué pierdes cuando migras*. Este proyecto responde esas preguntas con datos reales, timing real e infraestructura real.

## El dataset: 5.74 millones de registros de operaciones aéreas rusas

La <a href="https://postgrespro.com/community/demodb" target="_blank" rel="noopener">base de datos demo de PostgresPro Airlines</a> contiene horarios reales de vuelos en 104 aeropuertos rusos: reservaciones, boletos, vuelos, tarjetas de abordar, mapas de asientos y especificaciones de aeronaves. Ocho tablas, 5.74 millones de filas, JSONB para nombres multilingües, un tipo `point` para coordenadas de aeropuertos y timestamps con conciencia de zona horaria. Es el tipo de esquema desordenado y real que expone las diferencias entre bases de datos mucho mejor que cualquier ejemplo de juguete.

La primera pregunta que hice fue simple: **¿qué rutas pierden más tiempo en retrasos, y cómo se concentra el ingresos en la red?**

## Fase 1: SQL analytics con métricas reales

Cada análisis comenzó con una pregunta de negocio, no una técnica. El script de retrasos pregunta "¿qué rutas tienen la mayor tasa de retrasos?" y descubre que la ruta Voronezh-a-Pulkovo lidera con 11.1% (10 de 90 vuelos retrasados más de 15 minutos). El script de ingresos revela que la clase Económica representa el 70.8% de ingresos con 88% de boletos, mientras que Ejecutiva captura el 26.5% con apenas 10% -- una concentración que tiene implicaciones directas en precios.

El análisis de utilización descubrió algo llamativo: los Boeing 777-300 operan con un factor de ocupación promedio de 72.8%, mientras que los Cessna 208 Caravans solo alcanzan 16%. Ese no es un problema de aviones pequeños -- es un problema de diseño de red. Esos Cessnas sirven rutas donde simplemente no se están emitiendo tarjetas de abordar en el dataset, lo que sugiere tanto incompletitud de datos como rutas regionales genuinamente subutilizadas.

Cada hallazgo está respaldado por un script SQL ejecutable en el directorio `analysis/`. Sin placeholders, sin "hallazgos de ejemplo." Ejecuta la consulta, obtén el número.

## Fase 2: Internals de PostgreSQL -- entendiendo el motor

Saber sintaxis SQL es lo básico. Entender *por qué* una consulta tarda 1,283 milisegundos en lugar de 2.6 milisegundos es lo que separa a un desarrollador de un ingeniero.

El directorio `internals/` contiene seis scripts que profundizan en el motor de PostgreSQL:

**EXPLAIN ANALYZE** mostró que un filtro simple en `flights WHERE departure_airport = 'SVO' AND status = 'Arrived'` escaneaba todas 65,664 filas (Sequential Scan, 33.9ms) hasta que creé un índice compuesto en `(departure_airport, status)`. La misma consulta luego usó un Bitmap Index Scan y terminó en 2.6ms -- una **mejora de 13x** con un único statement `CREATE INDEX`.

**Las vistas materializadas** entregaron el resultado más dramático: un resumen de retrasos de ruta que tardaba 174ms en tablas crudas sirvió los mismos datos en 0.13ms desde la vista materializada -- **1,300x más rápido**. El trade-off es el desfase: debes `REFRESH MATERIALIZED VIEW CONCURRENTLY` para actualizar los datos sin bloquear lecturas.

**El particionamiento** demostró cómo el particionamiento por rango de la tabla flights por mes habilita partition pruning: una consulta para vuelos de julio de 2017 escanea solo la partición de julio en lugar de la tabla completa. El output de EXPLAIN explícitamente muestra "Partitions selected: 1 of 5."

**La sintonización de VACUUM** mostró la mecánica de MVCC: después de actualizar 50,000 filas, la tabla tenía 50,000 dead tuples consumiendo espacio. Un VACUUM estándar marca ese espacio como reutilizable (pero no encoge el archivo); VACUUM FULL reescribe la tabla para recuperar espacio en disco pero toma un lock exclusivo.

**WAL y checkpoints** revelaron que una operación bulk generando 100,000 inserciones y 100,000 updates produce volumen de WAL medible, y que `synchronous_commit = off` puede acelerar escrituras al costo de perder los últimos ~600ms de commits en un crash -- aceptable para analytics, nunca para transacciones financieras.

Estos no son ejercicios académicos. Son las decisiones exactas que tomas cuando sintonizas una instancia PostgreSQL en producción en Cloud SQL.

## Fase 3: Migración a BigQuery -- el pipeline

El pipeline de migración es cuatro archivos Python: `extract.py` lee de PostgreSQL usando cursores en batch (56,000 filas/segundo), `transform.py` aplana columnas JSONB y convierte el tipo `point` a floats `latitude`/`longitude`, y `load.py` empuja DataFrames a BigQuery usando Application Default Credentials. El pipeline completo mueve 5.74 millones de filas en 102 segundos.

La traducción de esquema expuso cada diferencia entre los dos sistemas. La columna JSONB de PostgreSQL `airport_name` (almacenando `{"en": "Sheremetyevo", "ru": "..."}`) se convirtió en dos columnas planas: `airport_name_en` y `airport_name_ru`. El tipo `point` para coordenadas se convirtió en columnas separadas `longitude` y `latitude` FLOAT64. Los campos `character(3)` de longitud fija necesitaban espacios finales removidos. Todos los `timestamptz` se normalizaron a UTC (BigQuery almacena todos los timestamps en UTC).

El pipeline usa `gcloud` Application Default Credentials -- sin archivos JSON de cuenta de servicio, sin gestión de credenciales. En esta VM, `gcloud auth` ya está configurado, así que el cliente Python de BigQuery se autentica automáticamente.

## Fase 4: PostgreSQL vs BigQuery -- la comparación honesta

Ejecuté las mismas consultas de negocio en ambos sistemas y registré timing actual:

| Consulta | PostgreSQL (indexado) | BigQuery |
|:------|:--------------------|:---------|
| Análisis de retrasos de ruta (49K filas, 2 JOINs) | 111ms | ~1.5s |
| Ingresos por clase tarifa (2.3M filas) | 1,635ms | ~1.2s |
| Point lookup (1 vuelo por ID) | 2.6ms | ~800ms |
| Consulta de vista materializada | 0.13ms | N/A |

**PostgreSQL gana en point lookups** -- con un índice apropiado, un lookup de fila única tarda 2.6ms. El tiempo de consulta mínimo de BigQuery es ~500ms por overhead de job scheduling. Para un backend API sirviendo registros de vuelos individuales, PostgreSQL es **300x más rápido**.

**BigQuery gana en analytics de tabla completa** -- la consulta de ingresos escaneando 2.3 millones de filas de `ticket_flights` corrió más rápido en BigQuery (1.2s vs 1.6s) sin ningún diseño de índice. El almacenamiento columnar de BigQuery y ejecución paralela manejan agregaciones grandes naturalmente.

**El costo cuenta la historia real.** Para este dataset de 500MB con consultas analíticas, BigQuery cuesta ~$0.25/mes (pago por consulta en $5/TB). La instancia más pequeña de Cloud SQL cuesta ~$7/mes. A escala, la brecha se ensancha aún más: BigQuery cobra por lo que escaneas, Cloud SQL cobra por lo que provisiones.

La conclusión no es "BigQuery es mejor." Es "usa PostgreSQL para OLTP y point lookups, BigQuery para OLAP y analytics ad-hoc, y construye un pipeline entre ellos." Este proyecto implementa exactamente ese patrón.

## Fase 5: Análisis geoespacial y visualización

Las coordenadas de aeropuertos habilitaron una capa geoespacial que demuestra las capacidades GIS de ambos sistemas. En PostgreSQL, escribí una función haversine en PL/pgSQL para calcular distancias de gran círculo desde el tipo `point`. En BigQuery, el mismo cálculo usa `ST_GEOGPOINT()` y `ST_DISTANCE()` -- funciones incorporadas, sin necesidad de funciones personalizadas.

El análisis de distancias reveló que las tasas de retrasos no correlacionan linealmente con la longitud de ruta. Rutas cortas (<500km) y rutas muy largas (4,000km+) tienen porcentajes de retrasos similares. Los retrasos más altos se concentran en el rango de 500-2,000km -- rutas de medio alcance donde la presión de rotación es más alta.

Un notebook Jupyter une todo con gráficos interactivos de plotly (mapas de calor de retrasos, curvas Pareto de ingresos, rankings de factor de ocupación, comparaciones antes/después de optimización) y mapas folium mostrando la red de rutas coloreada por severidad de retraso. El mapa de rutas es la "imagen hero" del proyecto: 104 aeropuertos conectados por líneas que cambian de verde a rojo conforme aumentan los retrasos.

## Qué demuestra este proyecto

Esto no es un proyecto "aprende SQL". Es un workflow completo de ingeniería de datos:

1. **PostgreSQL en profundidad de producción** -- no solo consultas, sino EXPLAIN ANALYZE, estrategia de índices, particionamiento, VACUUM, WAL y configuración modelada en Cloud SQL
2. **Python ETL** -- extracción con cursores en batch, transformación de tipos JSONB y geoespaciales, carga a BigQuery con autenticación ADC
3. **Migración a BigQuery** -- traducción de esquemas, diferencias de sintaxis, comparación real de desempeño
4. **Análisis informado de trade-offs** -- no "cuál es mejor" sino "cuál es mejor *para esta carga de trabajo específica*"
5. **Visualización** -- gráficos interactivos y mapas que hacen patrones de datos inmediatamente visibles
6. **GIS en ambos sistemas** -- haversine en PL/pgSQL vs `ST_DISTANCE` en BQ, mismas preguntas, implementaciones diferentes

El código fuente completo está en <a href="https://github.com/GonorAndres/learning-posgre" target="_blank" rel="noopener">github.com/GonorAndres/learning-posgre</a>. Cada script es ejecutable, cada métrica es real, y el pipeline se puede reproducir con `docker compose up` y un proyecto de GCP.
