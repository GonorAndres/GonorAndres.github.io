---
title: "Por Qué un Actuario Construye Plataformas de Datos (y Cómo Hacerlo por $10 al Mes)"
description: "6 proyectos sobre GCP que demuestran cómo la ingeniería de datos transforma el trabajo actuarial: warehouse dimensional de siniestros en BigQuery, orquestación con Dagster y Cloud Run, streaming con Pub/Sub y Apache Beam, infraestructura como código con Terraform, y pricing con GLM Tweedie. La plataforma completa opera por menos de $10 al mes, frente a los $1,000+ que costaría con arquitecturas convencionales."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "es"
tags: ["BigQuery", "Terraform", "Pub/Sub", "Apache Beam", "Dagster", "Cloud Run", "DuckDB", "GLM Tweedie", "GCP", "actuarial"]
---

Los modelos actuariales viven en Excel. Los datos de siniestros llegan por correo electrónico. El proceso de pricing empieza cada trimestre con alguien copiando columnas de un archivo a otro. Cuando la CNSF pide el reporte de solvencia, el equipo reconstruye el pipeline a mano: descargar los CSVs del sistema de ajustadores, limpiar nombres, cruzar con catálogos, alimentar la hoja de cálculo de triángulos de pérdida, generar los números que van al regulador. <a href="/blog/sima/">SIMA</a> demostró que un actuario puede construir un motor de cálculo completo, desde datos crudos de mortalidad hasta requerimientos de capital bajo LISF. Pero SIMA asume que los datos ya están limpios y disponibles. La siguiente pregunta es más fundamental: ¿puede un actuario construir la infraestructura que mueve esos datos desde su origen hasta el modelo, de forma automática, testada y reproducible? Aprender una disciplina entera para responder esa pregunta resultó en 6 proyectos interconectados que forman una plataforma de datos completa sobre Google Cloud.

## El problema real

Una aseguradora mediana en México recibe entre 5,000 y 50,000 siniestros al año. Cada siniestro llega como un registro del sistema de ajustadores, con campos inconsistentes, códigos de estado que cambian entre versiones del catálogo, montos en diferentes etapas de liquidación. El flujo típico: el área de siniestros exporta un CSV, lo envía por correo al área técnica, un analista lo abre en Excel, lo transforma manualmente (renombrar columnas, filtrar por ramo, convertir fechas), lo pega en la hoja de triángulos, y genera los factores de desarrollo. Si alguien pregunta por qué el ratio de siniestralidad de Responsabilidad Civil subió 3 puntos, la respuesta requiere repetir el proceso con un filtro diferente.

Esto funciona con 500 siniestros. Se vuelve frágil con 5,000. Se rompe con 50,000. Y el problema no es solo de volumen: es de confiabilidad. Cuando el pipeline es manual, no hay registro de qué transformaciones se aplicaron, no hay tests que verifiquen que los montos cuadran, no hay forma de reproducir exactamente el mismo resultado si alguien pregunta un mes después. La ingeniería de datos existe para resolver exactamente esto: pipelines automatizados, versionados y testados que mueven datos desde la fuente hasta la decisión.

## La plataforma: 6 proyectos, una arquitectura

Los 6 proyectos no son ejercicios independientes. Son capas de una misma plataforma: el warehouse almacena, el orquestador ejecuta, el streaming ingesta, Terraform provisiona, y el modelo de pricing consume. Cada proyecto se construyó sobre lo que el anterior dejó funcionando.

### P01: Claims Data Warehouse

El punto de partida es la pregunta más básica de cualquier operación de seguros: ¿dónde viven los datos de siniestros y cómo se consultan? La respuesta convencional en México es "en una hoja de Excel que alguien mantiene actualizada". La respuesta de ingeniería de datos es un warehouse dimensional.

El esquema estrella tiene 4 tablas de dimensiones (pólizas, coberturas, fechas, geografía) y 2 tablas de hechos (transacciones de siniestros y snapshots mensuales). Dataform orquesta la transformación SQL en 4 capas: staging (limpieza y tipado), intermediate (joins y enriquecimiento), marts (métricas de negocio), y reports (vistas listas para consumo). Los nombres de asegurados son en español mexicano, los códigos de estado corresponden a entidades federativas, los montos están en MXN. Esto no es cosmético: un warehouse que usa datos de dominio reales demuestra que quien lo construyó entiende qué significan los campos, no solo cómo moverlos.

El desarrollo local corre sobre DuckDB: sin instalación, sin servidor, en proceso. Cuando el pipeline está listo, el mismo SQL se ejecuta en BigQuery sin cambios significativos. El dashboard de siniestros está desplegado en Cloud Run: <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">claims-dashboard</a>. Muestra triángulos de pérdida, frecuencia de siniestros por cobertura y desarrollo temporal. Los 52 tests de pytest cubren esquema, integridad referencial y reglas de negocio (montos no negativos, fechas de reporte posteriores a la fecha de ocurrencia, sumas que cuadran entre capas).

Costo: menos de \$1 USD al mes. BigQuery free tier cubre 10 GB de almacenamiento y 1 TB de consultas. GCS para los archivos fuente cuesta centavos.

### P02: Pipeline ELT orquestado

Con el warehouse construido, la pregunta es quién lo alimenta y cuándo. En la industria, la respuesta estándar es Apache Airflow, y su versión administrada en GCP es Cloud Composer. Cloud Composer cuesta \$400 USD al mes como mínimo porque mantiene un cluster de Kubernetes corriendo permanentemente, incluso cuando no hay DAGs ejecutándose. Para un pipeline lineal sin fan-out ni dependencias complejas, eso es como alquilar un autobús para llevar a una persona.

La decisión fue Cloud Run + Cloud Scheduler: un contenedor que se ejecuta bajo demanda vía HTTP trigger, programado con cron. Costo: \$0.10 USD al mes. La misma lógica de negocio, el mismo resultado, 4,000 veces más barato. Dagster corre localmente para desarrollo: su interfaz gráfica gratuita muestra el lineage de assets, logs de ejecución y materialización incremental. Un DAG de referencia en Airflow está incluido en el repositorio para demostrar que conozco los patrones de producción que usan las empresas; simplemente no tiene sentido económico desplegarlos para este volumen.

Lo que se rompió durante el despliegue: Cloud Run esperaba un servidor HTTP escuchando en un puerto. El Dockerfile original ejecutaba el pipeline como un script batch que terminaba inmediatamente. Cloud Run interpretaba la terminación como un crash y reiniciaba el contenedor en loop. La solución fue agregar un endpoint HTTP que dispara la ejecución y devuelve el resultado. Un error simple, pero ilustrativo de la diferencia entre que algo funcione localmente y que funcione en producción.

### P03: Ingesta de siniestros en streaming

Los siniestros no llegan en batch diario. Un ajustador registra un siniestro a las 3 de la tarde; otro a las 3:15. El modelo operativo real es un flujo continuo de eventos. Pub/Sub actúa como bus de eventos: cada registro de siniestro es un mensaje con tipo de cobertura, deducible, código de estado, monto estimado. Un subscriber en Cloud Run valida el esquema, enriquece con datos de catálogo y escribe al warehouse. Los mensajes inválidos van a un dead-letter topic para revisión posterior.

Apache Beam procesa agregaciones ventaneadas sobre el flujo: frecuencia de siniestros por hora, montos acumulados por cobertura, conteos por estado. El punto sutil es que este pipeline corre en modo batch, no en streaming. La API de Beam es la misma; la diferencia entre batch y streaming es literalmente el flag `--streaming` en la línea de comandos. El código demuestra el patrón completo (ventanas, timestamps, triggers) sin incurrir en el costo de Dataflow streaming, que puede superar los \$1,000 USD al mes para un job continuo. En producción, activar streaming es cambiar un parámetro, no reescribir código.

Costo: entre \$1 y \$5 USD al mes. Pub/Sub cobra por mensaje (los primeros 10 GB son gratuitos), Cloud Run cobra por invocación, Beam batch corre como un job efímero que cuesta centavos por ejecución.

### P04: Infraestructura como código con Terraform

Cada recurso de GCP que usan los proyectos anteriores está definido en Terraform: 24 recursos organizados en 6 módulos (IAM, BigQuery con 5 datasets, GCS, Pub/Sub, Cloud Run, Scheduler). El beneficio es concreto: si el proyecto completo se elimina por accidente, `terraform apply` lo reconstruye en minutos. Cada cambio de infraestructura pasa por un PR con `terraform plan` en CI y `terraform apply` automático al merge.

Workload Identity Federation elimina las llaves de servicio: GitHub Actions se autentica contra GCP sin secretos estáticos, usando tokens OIDC de corta duración. Esto no es una sofisticación innecesaria; es el estándar de seguridad que Google recomienda desde 2021 y que las auditorías de seguridad exigen.

Lo que se rompió: la paradoja del bootstrap. El backend de Terraform almacena el estado en un bucket de GCS. Pero ese bucket es un recurso que Terraform debería crear. No puedes ejecutar `terraform init` sin que el bucket exista, y no puedes crear el bucket sin ejecutar Terraform. La solución es un bootstrap con estado local: crear el bucket con estado almacenado en disco, luego migrar el estado al bucket recién creado con `terraform init -migrate-state`. Documentado, reproducible, resuelto en 10 minutos una vez que entiendes el problema.

Costo: \$0. Terraform es open source. El bucket de estado cuesta fracciones de centavo.

### P05: Streaming verdadero (solo local)

P03 usa Beam en batch para demostrar patrones de streaming. P05 implementa streaming real: watermarks, triggers compuestos (AfterWatermark con firings tempranos y tardíos), modo acumulativo, latencia permitida de 1 hora, y deduplicación por ventana usando BagState. La diferencia técnica con P03 es fundamental. P03 usa modo DISCARDING (cada disparo emite solo datos nuevos) y no maneja datos tardíos. P05 usa modo ACCUMULATING (cada disparo emite el acumulado completo), acepta datos que llegan hasta 1 hora después del cierre de ventana, y garantiza semántica exactly-once.

Este proyecto no está desplegado. Dataflow streaming cuesta entre \$50 y \$100 USD por día porque mantiene workers permanentes. El código es Dataflow-ready: solo cambia el runner de `DirectRunner` a `DataflowRunner`. No desplegarlo es una decisión de costo, no una limitación técnica. Si un empleador necesita ver streaming en producción, un demo de 2 horas costaría menos de \$10 USD.

### P06: Pipeline de pricing con ML

Todo lo anterior converge aquí: los datos del warehouse, procesados por el pipeline orquestado, alimentan un modelo de pricing actuarial. La ingeniería de features es SQL puro en 3 capas de transformación, diseñado para ejecutarse en BigQuery ML sin modificación.

El modelo es un GLM Tweedie con parámetro de potencia $p = 1.5$. La distribución Tweedie es el estándar actuarial para modelar la prima pura porque resuelve un problema técnico específico: la mayoría de los asegurados no tienen siniestros en un período dado (punto de masa en cero), pero cuando ocurre un siniestro el costo es una variable continua positiva. La Tweedie con $1 < p < 2$ es exactamente una Poisson compuesta con severidad Gamma, que es la descomposición frecuencia-severidad que la industria usa desde hace décadas, pero estimada en un solo modelo. La prima pura se modela como $E[Y] = \exp(X\beta)$, donde $Y$ es el costo total por póliza y $X$ incluye características del vehículo, del conductor y geográficas.

La evaluación usa métricas actuariales: coeficiente de Gini para discriminación de riesgo, curvas de lift para verificar que el modelo ordena correctamente los riesgos, y ratio A/E (actual vs. expected) por segmento para detectar subsidio cruzado. La adecuación de prima por tipo de cobertura es el output final: el número que el actuario defiende ante la CNSF en la nota técnica.

¿Por qué Tweedie GLM y no XGBoost? Interpretabilidad y cumplimiento regulatorio. La CNSF requiere notas técnicas que demuestren la suficiencia actuarial de la tarifa. Un GLM produce coeficientes directamente interpretables como factores multiplicativos sobre la prima base. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> en el portafolio de data science explora XGBoost y LightGBM con explicabilidad SHAP; este proyecto demuestra el baseline regulatorio.

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

La filosofía detrás de estos números no es austeridad por austeridad. Es selección deliberada de herramientas por patrón de uso. DuckDB localmente porque el desarrollo iterativo sobre datos de prueba no necesita un servidor. Cloud Run con scale-to-zero porque un pipeline que corre 5 minutos al día no justifica un cluster permanente. Beam en batch porque la API de streaming es idéntica y el patrón queda demostrado sin el costo operativo. Cada decisión tiene una justificación técnica; el ahorro es consecuencia, no objetivo.

## Decisiones y trade-offs

| Decisión | Alternativa | Razón |
|----------|-------------|-------|
| DuckDB local | PostgreSQL | Zero-install, en proceso, suficiente para datos de desarrollo |
| Dagster local + Cloud Run | Airflow / Composer | Dagster para DX (UI gratuita, assets); Cloud Run para producción (4,000x más barato) |
| Beam batch | Beam streaming | Misma API, 1,000x menos costo, el código es idéntico |
| Tweedie GLM | XGBoost | Interpretabilidad + cumplimiento CNSF. El ML está en otro proyecto |
| Terraform | Consola GCP | Reproducibilidad. `terraform apply` reconstruye todo en minutos |
| Workload Identity Federation | Llaves de servicio | Sin secretos estáticos, tokens de corta duración, estándar Google |

Cada trade-off tiene una respuesta diferente en otro contexto. Una aseguradora con 200 DAGs interdependientes necesita Composer. Un pipeline de fraude en tiempo real necesita streaming verdadero. Un modelo de pricing para un portafolio de millones de pólizas justifica XGBoost con SHAP. Las decisiones correctas para este portafolio son las que demuestran comprensión de los trade-offs, no las que demuestran presupuesto.

## Conexión con el trabajo actuarial

Esta no es una plataforma genérica de ingeniería de datos. Cada dataset contiene datos de seguros. Cada pipeline procesa siniestros. El warehouse construye triángulos de pérdida. El modelo de pricing tarifica coberturas. El topic de Pub/Sub transporta eventos de siniestros con tipos de cobertura, deducibles y códigos de entidad federativa.

Un equipo actuarial tradicional recibe un CSV y empieza a construir fórmulas. Esta plataforma recibe un evento de siniestro, lo valida contra esquema, lo enriquece con datos de catálogo, lo almacena en un warehouse dimensional, lo agrega en ventanas temporales y lo alimenta a un modelo de pricing. Todo automático, todo testado, todo versionado. Esa es la diferencia que la infraestructura cloud aporta al trabajo actuarial: hace que los modelos sean confiables porque el pipeline de datos es confiable.

Las conexiones con el resto del portafolio son directas. <a href="/blog/sima/">SIMA</a> es el motor de cálculo que esta plataforma podría alimentar: las tablas de mortalidad graduadas, las funciones de conmutación, los cálculos de reservas y SCR que SIMA expone vía API necesitan datos limpios y actualizados como input. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> usa la misma descomposición frecuencia-severidad que P06, pero explora modelos de mayor complejidad predictiva. El <a href="/blog/data-analyst-portfolio/">portafolio de analista de datos</a> representa la capa de análisis que se asienta sobre esta infraestructura: los dashboards, las segmentaciones y los reportes ejecutivos que consumen los marts del warehouse.

## Lo que cambiaría

Migrar de datos sintéticos a freMTPL2 (French Motor Third-Party Liability). Es público, actuarialmente realista y benchmarkeable contra literatura publicada. Los datos sintéticos demuestran el pipeline; freMTPL2 demostraría que los modelos producen resultados con significado actuarial verificable.

Desplegar P05 en Dataflow por al menos una corrida de demostración. Dos horas de streaming costarían entre \$5 y \$10 USD y producirían evidencia concreta de que el código funciona en el runner de producción, no solo en el runner directo.

Agregar monitoreo de calidad de datos como un proyecto separado. Great Expectations o Soda sobre cada capa del warehouse, con alertas cuando un batch rompe las expectativas (montos negativos, fechas futuras, códigos de estado inexistentes). En producción, la calidad de datos es tan crítica como la disponibilidad.

Construir un dashboard ejecutivo en Looker Studio que conecte los 6 proyectos en una vista unificada: volumen de ingesta (P03), estado del pipeline (P02), métricas del warehouse (P01), y resultados de pricing (P06). El tipo de vista que un Chief Actuary abriría cada mañana.

## Para qué sirve todo esto

La disciplina de ingeniería de datos no reemplaza el juicio actuarial. Lo amplifica. Un actuario que sabe construir pipelines no depende de que TI le entregue los datos limpios la próxima semana. Un actuario que entiende Terraform puede provisionar la infraestructura que su modelo necesita sin esperar aprobaciones de cloud engineering. Un actuario que maneja streaming puede procesar siniestros en tiempo real en lugar de esperar el corte mensual. Estas no son habilidades teóricas: son las que separan al actuario que opera dentro de Excel del actuario que diseña los sistemas que alimentan a Excel.

El código, los tests y la documentación están en <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. El dashboard de siniestros está en producción en <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">Cloud Run</a>.
