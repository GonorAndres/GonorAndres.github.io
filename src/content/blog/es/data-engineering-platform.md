---
title: "Por Qué un Actuario Construye Plataformas de Datos (y Cómo Hacerlo por $10 al Mes)"
description: "6 proyectos sobre GCP que demuestran cómo la ingeniería de datos transforma el trabajo actuarial: warehouse dimensional de siniestros en BigQuery, orquestación con Dagster y Cloud Run, streaming con Pub/Sub y Apache Beam, infraestructura como código con Terraform, y pricing con GLM Tweedie. La plataforma completa opera por menos de $10 al mes, frente a los $1,000+ que costaría con arquitecturas convencionales."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "es"
tags: ["BigQuery", "Terraform", "Pub/Sub", "Apache Beam", "Dagster", "Cloud Run", "DuckDB", "GLM Tweedie", "GCP", "actuarial"]
---

Los modelos actuariales viven en Excel. Los datos de siniestros llegan por correo. El pricing empieza cada trimestre cuando alguien copia columnas de un archivo a otro. Cuando la CNSF pide el reporte de solvencia, el equipo reconstruye el pipeline a mano. Descargar CSVs, limpiar nombres, cruzar catálogos, alimentar la hoja de triángulos de pérdida, generar números para el regulador. <a href="/blog/sima/">SIMA</a> demostró que un actuario construye un motor de cálculo completo: mortalidad graduada, requerimientos de capital bajo LISF. Pero SIMA asume datos limpios y disponibles. La pregunta siguiente es más fundamental. ¿Puede un actuario construir la infraestructura que mueve esos datos desde su origen hasta el modelo, automáticamente, testeada y reproducible? Aprender una disciplina entera para responder eso resultó en 6 proyectos interconectados formando una plataforma de datos completa en Google Cloud.

## El problema real

Una aseguradora mediana en México recibe entre 5,000 y 50,000 siniestros al año. Cada uno llega con campos inconsistentes, códigos de estado cambiantes, montos en diferentes etapas de liquidación. El flujo típico: siniestros exporta un CSV, lo envía al área técnica, un analista lo abre en Excel, lo transforma a mano (renombrar, filtrar, convertir fechas), lo pega en triángulos, genera factores. Si preguntan por qué Responsabilidad Civil subió 3 puntos, la respuesta requiere repetir el proceso con otro filtro.

A 500 siniestros funciona. A 5,000 se vuelve frágil. A 50,000 se rompe. El problema no es solo volumen: es confiabilidad. Manual significa sin auditoría, sin tests de integridad, sin reproducibilidad. Si preguntan un mes después, repites todo. La ingeniería de datos existe para esto: pipelines automatizados, versionados, testeados que mueven datos desde la fuente hasta la decisión.

## La plataforma: 6 proyectos, una arquitectura

Los 6 proyectos no son ejercicios independientes. Son capas de una plataforma: warehouse para almacenar, orquestador para ejecutar, streaming para ingestar, Terraform para provisionar, pricing para consumir. Cada uno se construyó sobre lo anterior.

### P01: Claims Data Warehouse

El punto de partida es la pregunta más básica: ¿dónde viven los datos de siniestros y cómo se consultan? En México, la respuesta convencional es "en una hoja de Excel que alguien mantiene actualizada". La respuesta de ingeniería de datos es diferente: un warehouse dimensional.

El esquema estrella tiene 4 dimensiones (pólizas, coberturas, fechas, geografía) y 2 tablas de hechos (transacciones y snapshots mensuales). Dataform orquesta SQL en 4 capas: staging (limpieza, tipado); intermediate (joins, enriquecimiento); marts (métricas); reports (vistas de consumo). Los nombres están en español mexicano, los códigos en INEGI, los montos en MXN. Esto no es cosmético: un warehouse con datos reales demuestra comprensión del dominio, no solo movimiento de columnas.

Desarrollo local en DuckDB: sin instalación, en proceso, cero servidor. El mismo SQL se ejecuta en BigQuery sin cambios. El dashboard está en Cloud Run: <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">claims-dashboard</a>. Muestra triángulos, frecuencia por cobertura, desarrollo temporal. Cincuenta y dos tests de pytest cubren esquema, integridad referencial, reglas de negocio (montos positivos, fechas consistentes, sumas validadas entre capas).

Costo: menos de \$1 USD al mes. BigQuery free tier cubre 10 GB de almacenamiento y 1 TB de consultas. GCS para los archivos fuente cuesta centavos.

### P02: Pipeline ELT orquestado

Con el warehouse construido: ¿quién lo alimenta y cuándo? En la industria, el estándar es Apache Airflow; en GCP, Cloud Composer. Cloud Composer cuesta \$400+ USD/mes porque mantiene Kubernetes corriendo permanentemente, incluso sin DAGs ejecutándose. Un pipeline lineal sin fan-out: es como alquilar un autobús para una persona.

La alternativa: Cloud Run + Cloud Scheduler. Un contenedor que se ejecuta bajo demanda vía HTTP, programado con cron. Costo: \$0.10 USD/mes. La lógica es idéntica, el resultado es idéntico, 4,000 veces más barato. Localmente corre Dagster: interfaz gratuita, lineage de assets, logs y materialización incremental. Un DAG de referencia en Airflow está en el repositorio como evidencia de competencia con herramientas estándar. La economía simplemente no justifica desplogarlas para este volumen.

La ruptura durante despliegue: Cloud Run esperaba un servidor HTTP escuchando. El Dockerfile original ejecutaba el pipeline como script batch que terminaba. Cloud Run interpretaba la terminación como crash y reiniciaba en loop. La solución fue agregar un endpoint HTTP que dispara ejecución. Error simple, pero ilustrativo de la diferencia entre "funciona local" y "funciona en producción".

### P03: Ingesta de siniestros en streaming

Los siniestros no llegan en batch diario. Un ajustador registra a las 3pm; otro a las 3:15. El modelo real es flujo continuo. Pub/Sub actúa como bus de eventos: cada siniestro es un mensaje con cobertura, deducible, estado, monto. Un subscriber en Cloud Run valida esquema, enriquece con catálogos, escribe al warehouse. Mensajes inválidos van a dead-letter para revisión.

Apache Beam procesa agregaciones ventaneadas: frecuencia por hora, montos por cobertura, conteos por estado. El punto sutil: este pipeline corre en batch, no streaming. La API de Beam es idéntica; la diferencia es el flag `--streaming` en la línea de comandos. El código demuestra ventanas, timestamps, triggers sin el costo de Dataflow streaming (\$1,000+/mes continuo). En producción, activar streaming es cambiar un parámetro.

Costo: entre \$1 y \$5 USD al mes. Pub/Sub cobra por mensaje (los primeros 10 GB son gratuitos), Cloud Run cobra por invocación, Beam batch corre como un job efímero que cuesta centavos por ejecución.

### P04: Infraestructura como código con Terraform

Cada recurso de GCP está definido en Terraform: 24 recursos en 6 módulos (IAM, BigQuery, GCS, Pub/Sub, Cloud Run, Scheduler). El beneficio es concreto: si todo se elimina, `terraform apply` lo reconstruye en minutos. Cada cambio pasa por PR con `terraform plan` en CI y `terraform apply` automático.

Workload Identity Federation elimina llaves de servicio: GitHub Actions se autentica sin secretos estáticos, usando tokens OIDC de corta duración. No es sofisticación innecesaria; es el estándar Google desde 2021 y lo que exigen las auditorías.

La ruptura: la paradoja del bootstrap. Terraform almacena estado en un bucket de GCS. Ese bucket es un recurso que Terraform debería crear. No puedes ejecutar `terraform init` sin el bucket, ni crear el bucket sin Terraform. La solución es bootstrap local: crear el bucket con estado en disco, luego migrar con `terraform init -migrate-state`. Documentado, reproducible, 10 minutos una vez que entiiendes el problema.

Costo: \$0. Terraform es open source. El bucket de estado cuesta fracciones de centavo.

### P05: Streaming verdadero (solo local)

P03 usa Beam en batch para demostrar patrones. P05 implementa streaming real: watermarks, triggers compuestos, modo acumulativo, 1 hora de latencia permitida, deduplicación por ventana. La diferencia es fundamental. P03 usa DISCARDING (emite solo nuevos) sin late data. P05 usa ACCUMULATING (emite acumulado completo), acepta datos hasta 1 hora después del cierre, garantiza exactly-once.

Este proyecto no está desplegado. Dataflow streaming cuesta \$50-100 USD/día (workers permanentes). El código es Dataflow-ready: solo cambia el runner. No desplegarlo es decisión de costo, no limitación técnica. Un demo de 2 horas costaría menos de \$10 USD si fuera necesario.

### P06: Pipeline de pricing con ML

Todo anterior converge aquí: datos del warehouse procesados por el pipeline orquestado alimentan un modelo de pricing. La ingeniería de features es SQL puro en 3 capas de transformación, diseñado para BigQuery ML sin modificación.

El modelo es un GLM Tweedie con $p = 1.5$. La Tweedie es el estándar actuarial porque resuelve un problema específico: mayoría de asegurados sin siniestros (masa en cero), pero cuando hay siniestro el costo es continuo y positivo. La Tweedie con $1 < p < 2$ es Poisson compuesta con severidad Gamma: la descomposición frecuencia-severidad que la industria usa desde décadas, estimada en un modelo único. Prima pura: $E[Y] = \exp(X\beta)$, donde $Y$ es costo total por póliza y $X$ incluye características del vehículo, conductor y geografía.

La evaluación usa métricas actuariales: Gini para discriminación, lift para ordenamiento de riesgos, ratio A/E por segmento para subsidios cruzados. La adecuación de prima por cobertura es el output final: el número que el actuario defiende ante la CNSF.

¿Por qué Tweedie GLM y no XGBoost? Interpretabilidad y cumplimiento regulatorio. La CNSF requiere notas que demuestren suficiencia actuarial. Un GLM produce coeficientes interpretables como multiplicadores sobre prima base. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> explora XGBoost y LightGBM con SHAP; este demuestra el baseline regulatorio.

## La estrategia de costos

| Proyecto | Costo mensual | Alternativa convencional |
|----------|--------------|--------------------------|
| P01: Claims Warehouse | < $1 | Enterprise DWH: $500+ |
| P02: Pipeline orquestado | $0.10 | Cloud Composer: $400+ |
| P03: Streaming (batch Beam) | $1-5 | Dataflow streaming: $1,000+ |
| P04: Terraform | $0 | Provisión manual en consola |
| P05: Streaming real | $0 (local) | Dataflow streaming: $1,500+ |
| P06: Pricing ML | < $1 | BigQuery ML: incluido |
| **Total** | **< $10** | **$2,000+** |

La filosofía detrás de estos números no es austeridad por austeridad. Es selección deliberada de herramientas. DuckDB localmente porque desarrollo iterativo no necesita servidor. Cloud Run con scale-to-zero porque un pipeline de 5 minutos/día no justifica cluster permanente. Beam en batch porque la API de streaming es idéntica y el patrón se demuestra sin costo operativo. Cada decisión tiene justificación técnica; el ahorro es consecuencia.

## Decisiones y trade-offs

| Decisión | Alternativa | Razón |
|----------|-------------|-------|
| DuckDB local | PostgreSQL | Zero-install, en proceso, suficiente para datos de desarrollo |
| Dagster local + Cloud Run | Airflow / Composer | Dagster para DX (UI gratuita, assets); Cloud Run para producción (4,000x más barato) |
| Beam batch | Beam streaming | Misma API, 1,000x menos costo, el código es idéntico |
| Tweedie GLM | XGBoost | Interpretabilidad + cumplimiento CNSF. El ML está en otro proyecto |
| Terraform | Consola GCP | Reproducibilidad. `terraform apply` reconstruye todo en minutos |
| Workload Identity Federation | Llaves de servicio | Sin secretos estáticos, tokens de corta duración, estándar Google |

Cada trade-off tiene respuesta diferente en otro contexto. Una aseguradora con 200 DAGs interdependientes necesita Composer. Un pipeline de fraude en tiempo real necesita streaming verdadero. Pricing para millones de pólizas justifica XGBoost con SHAP. Las decisiones correctas son las que demuestran comprensión de los trade-offs.

## Conexión con el trabajo actuarial

Esta no es una plataforma genérica. Cada dataset contiene datos de seguros. Cada pipeline procesa siniestros. El warehouse construye triángulos. El pricing tarifica coberturas. El topic de Pub/Sub transporta eventos con cobertura, deducibles, códigos de entidad federativa.

Equipo actuarial tradicional recibe un CSV y construye fórmulas. Esta plataforma recibe un evento, lo valida contra esquema, lo enriquece con catálogos, lo almacena en warehouse dimensional, lo agrega en ventanas temporales, lo alimenta al modelo de pricing. Todo automático, todo testado, todo versionado. Esa es la diferencia que la infraestructura cloud aporta: hace que los modelos sean confiables porque el pipeline es confiable.

Las conexiones con el portafolio son directas. <a href="/blog/sima/">SIMA</a> es el motor de cálculo que esta plataforma podría alimentar. Las tablas graduadas, funciones de conmutación, cálculos de SCR que SIMA expone necesitan datos limpios como input. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> usa la misma descomposición frecuencia-severidad que P06, pero explora modelos con mayor complejidad. El <a href="/blog/data-analyst-portfolio/">portafolio de analista de datos</a> es la capa de análisis sobre esta infraestructura: dashboards, segmentaciones, reportes que consumen los marts.

## Lo que cambiaría

Migrar a freMTPL2 (French Motor Third-Party Liability). Es público, actuarialmente realista y benchmarkeable contra literatura. Los datos sintéticos demuestran el pipeline; freMTPL2 demostraría que los modelos producen resultados con significado verificable.

Desplegar P05 en Dataflow por al menos una demostración. Dos horas costarían \$5-10 USD y producirían evidencia concreta de que el código funciona en producción, no solo en el runner directo.

Agregar monitoreo de calidad de datos como proyecto separado. Great Expectations o Soda sobre cada capa, con alertas cuando un batch rompe expectativas. En producción, la calidad de datos es tan crítica como la disponibilidad.

Construir un dashboard ejecutivo en Looker Studio conectando los 6 proyectos en una vista unificada: volumen de ingesta, estado del pipeline, métricas del warehouse, resultados de pricing. El tipo de vista que un Chief Actuary abre cada mañana.

## Para qué sirve todo esto

La ingeniería de datos no reemplaza el juicio actuarial. Lo amplifica. Un actuario que construye pipelines no depende de TI para los datos limpios. Un actuario que entiende Terraform provisiona infraestructura sin esperar aprobaciones. Un actuario que maneja streaming procesa siniestros en tiempo real. Estas no son habilidades teóricas: separan al actuario que opera dentro de Excel del que diseña los sistemas que lo alimentan.

El código, los tests y la documentación están en <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. El dashboard de siniestros está en producción en <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">Cloud Run</a>.
