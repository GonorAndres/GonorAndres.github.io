---
title: "Por Qué un Actuario Construye Plataformas de Datos (y Cómo Hacerlo por $10 al Mes)"
description: "6 proyectos sobre GCP que demuestran cómo la ingeniería de datos transforma el trabajo actuarial: warehouse dimensional de siniestros en BigQuery, orquestación con Dagster y Cloud Run, streaming con Pub/Sub y Apache Beam, infraestructura como código con Terraform, y pricing con GLM Tweedie. La plataforma completa opera por menos de $10 al mes, frente a los $1,000+ que costaría con arquitecturas convencionales."
date: "2026-03-18"
lastModified: "2026-03-21"
category: "proyectos-y-analisis"
lang: "es"
shape: "narrative"
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

La idea central es organizar los datos para que un actuario pueda hacer preguntas directamente: "muéstrame los siniestros incurridos por cobertura y trimestre de ocurrencia". Un esquema estrella hace exactamente eso: 4 dimensiones (pólizas, coberturas, fechas, geografía) rodean 2 tablas de hechos (transacciones y snapshots mensuales). En lugar de buscar entre hojas de Excel, escribes una consulta y obtienes la respuesta.

Los datos crudos pasan por 4 capas de transformación orquestadas con Dataform: primero se limpian y estandarizan (staging), luego se cruzan y enriquecen con catálogos (intermediate), después se calculan métricas como triángulos de pérdida y frecuencia (marts), y finalmente se preparan vistas listas para el dashboard (reports). Cada capa alimenta la siguiente, y cualquier error se detecta antes de llegar al modelo. Todo con nombres en español mexicano, códigos INEGI, montos en MXN, porque un warehouse que refleja el dominio real demuestra comprensión del negocio, no solo capacidad de mover columnas.

Para desarrollo local se usa DuckDB: se ejecuta directamente en tu máquina, sin instalar servidores ni pagar nada. Lo valioso es que el mismo SQL corre en BigQuery sin cambios, así que lo que funciona en local funciona en producción. El dashboard está en Cloud Run: <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">claims-dashboard</a>. Muestra triángulos, frecuencia por cobertura, desarrollo temporal. Cincuenta y dos tests de pytest verifican que el esquema sea correcto, que las referencias entre tablas sean consistentes y que las reglas de negocio se cumplan (montos positivos, fechas coherentes, sumas que cuadran entre capas).

Costo: menos de \$1 USD al mes. BigQuery free tier cubre 10 GB de almacenamiento y 1 TB de consultas. GCS para los archivos fuente cuesta centavos.

### P02: Pipeline ELT orquestado

Con el warehouse construido: ¿quién lo alimenta y cuándo? En la industria, el estándar es Apache Airflow; en GCP, Cloud Composer. Cloud Composer cuesta \$400+ USD/mes porque mantiene Kubernetes corriendo permanentemente, incluso sin DAGs ejecutándose. Un pipeline lineal sin fan-out: es como alquilar un autobús para una persona.

La alternativa es Cloud Run + Cloud Scheduler: un contenedor que se despierta cuando toca, ejecuta el pipeline, y se apaga. Como un empleado que llega, hace su trabajo y se va, en lugar de quedarse sentado 24 horas esperando instrucciones. Costo: \$0.10 USD al mes. La lógica es idéntica, el resultado es idéntico, 4,000 veces más barato. Este patrón aplica a cualquier pipeline pequeño o mediano que corra en horarios predecibles.

Para desarrollo local se usa Dagster, que ofrece algo que Cloud Run no tiene: una interfaz visual donde ves el flujo de tus datos, rastrear qué se ejecutó y cuándo, y depurar fallos sin leer logs en terminal. Un DAG de referencia en Airflow también está en el repositorio, porque si un empleador usa Airflow, puede ver que conozco su herramienta. La decisión de no desplegarlo es económica, no técnica.

La lección de despliegue ilustra bien qué pasa cuando las suposiciones locales chocan con la realidad de la nube. Cloud Run espera un servidor HTTP escuchando permanentemente. El Dockerfile original ejecutaba el pipeline como script que terminaba al acabar. Cloud Run interpretaba esa terminación como un fallo y reiniciaba en loop. La solución fue agregar un endpoint HTTP que dispara la ejecución bajo demanda. Error simple, pero exactamente el tipo de problema que solo aparece en producción.

### P03: Ingesta de siniestros en streaming

En la realidad, los siniestros no esperan a que alguien corra un proceso al final del día. Un ajustador registra un caso a las 3pm, otro a las 3:15, otro a las 4. La pregunta es: ¿puede el sistema reaccionar a cada uno conforme llega, en lugar de esperar a que se acumulen?

Pub/Sub funciona como un buzón que nunca pierde una carta. Cada siniestro se convierte en un mensaje con su cobertura, deducible, estado y monto. Un servicio en Cloud Run recibe cada mensaje, verifica que los campos estén completos y sean válidos, lo enriquece con información de catálogos (tipo de cobertura, entidad federativa), y lo escribe al warehouse. Si un mensaje llega mal formado, se separa automáticamente para revisión en lugar de contaminar los datos.

Apache Beam se encarga de agrupar esos eventos por ventanas de tiempo: ¿cuántos siniestros llegaron en esta hora? ¿Cuál es el monto acumulado por cobertura en este turno? ¿Cuántos casos abiertos por estado hoy? El detalle importante: el código está escrito con la misma lógica que usaría un sistema en tiempo real, pero corre en batch para ahorrar costos. Dataflow en modo streaming cuesta \$1,000+ al mes de forma continua. En batch, cuesta centavos por ejecución. El código es idéntico; pasar a tiempo real es cambiar un parámetro de configuración, no reescribir nada.

Costo: entre \$1 y \$5 USD al mes. Pub/Sub cobra por mensaje (los primeros 10 GB son gratuitos), Cloud Run cobra por invocación, Beam batch corre como un job efímero que cuesta centavos por ejecución.

### P04: Infraestructura como código con Terraform

¿Qué pasa si toda la plataforma desaparece? ¿Se puede reconstruir? Terraform responde esa pregunta. Es una herramienta que permite describir toda tu infraestructura en archivos de texto: en lugar de entrar a la consola de Google Cloud y crear recursos uno por uno haciendo clic, escribes qué necesitas (bases de datos, almacenamiento, servicios, permisos) y Terraform lo crea por ti. Si algo se borra o se rompe, un solo comando (`terraform apply`) lo reconstruye en minutos.

Esto importa por tres razones concretas. Reproducibilidad: cualquier persona con acceso al repositorio puede levantar la plataforma completa desde cero. Auditabilidad: cada cambio en la infraestructura queda registrado en Git, igual que el código. Colaboración: los cambios se revisan en pull requests antes de aplicarse, con `terraform plan` mostrando exactamente qué va a cambiar antes de que suceda.

La plataforma tiene 24 recursos organizados en 6 módulos (permisos, base de datos, almacenamiento, mensajería, servicios y programación). Para el despliegue automático, GitHub Actions se conecta a GCP sin necesidad de guardar contraseñas ni llaves de servicio: usa Workload Identity Federation, que genera tokens temporales de corta duración. En la práctica esto significa que nadie tiene credenciales que puedan filtrarse.

La lección aprendida: Terraform guarda el estado de tu infraestructura en un archivo remoto (un bucket en GCS). Pero ese bucket es parte de la infraestructura que Terraform debería crear. No puedes inicializar Terraform sin el bucket, ni crear el bucket sin Terraform. La solución es crear el bucket primero con estado local en disco, y luego migrar. Una paradoja que parece trivial, pero que solo descubres cuando despliegas de verdad.

Costo: \$0. Terraform es open source. El bucket de estado cuesta fracciones de centavo.

### P05: Streaming verdadero (solo local)

P03 responde "¿qué pasó hoy?" después de que los hechos ocurrieron. P05 responde "¿qué está pasando ahora mismo?" mientras ocurre. La diferencia importa en producción: detectar fraude necesita segundos, no horas. Monitorear la suficiencia de reservas se beneficia de ver oleadas de siniestros conforme suceden, no al día siguiente.

¿Qué ganas con streaming verdadero que no tienes con batch? Tres cosas. Primera: los datos que llegan tarde se manejan correctamente. Un siniestro registrado con retraso de 40 minutos se incorpora a la ventana temporal correcta, no se pierde ni se cuenta doble. Segunda: los resultados se actualizan conforme llega nueva información. En lugar de un número final al cierre del día, tienes estimaciones que se refinan hora por hora. Tercera: deduplicación garantizada, cada evento se procesa exactamente una vez por ventana, sin importar si el mensaje se reenvió.

Técnicamente, P03 usa modo descarte (cada resultado es independiente, sin datos tardíos). P05 usa modo acumulativo (cada resultado incluye todo lo anterior), acepta datos hasta 1 hora después del cierre de ventana, y garantiza procesamiento exactamente una vez mediante deduplicación por estado.

Este proyecto no está desplegado porque Dataflow en modo streaming cuesta entre \$50 y \$100 USD al día, ya que requiere workers corriendo permanentemente. El código está listo para Dataflow, solo cambia el destino de ejecución. No desplegarlo es una decisión de costos, no una limitación técnica. Un demo de 2 horas costaría menos de \$10 USD si fuera necesario para demostrar que funciona en producción.

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

El trabajo actuarial, en el fondo, consiste en tomar grandes volúmenes de eventos inciertos (siniestros, pagos, reclamaciones) y convertirlos en números confiables: reservas, primas, requerimientos de capital. Una plataforma de datos hace exactamente lo mismo, pero automatizado.

Piénsalo así: los siniestros llegan uno por uno (streaming), se agrupan por período (warehouse), se agregan en triángulos de desarrollo (marts), y alimentan modelos de pricing. Ese flujo es el proceso actuarial. La diferencia es que en lugar de depender de que alguien copie columnas correctamente entre archivos, cada paso está automatizado, verificado con tests, y registrado en Git. Cuando la CNSF pregunta cómo llegaste a un número, la respuesta es un commit, un log de ejecución, y 52 pruebas pasando.

Las conexiones con el resto del portafolio son naturales. <a href="/blog/sima/">SIMA</a> calcula mortalidad graduada, funciones de conmutación y requerimientos de capital bajo LISF; todo eso necesita datos limpios como insumo, exactamente lo que esta plataforma produce. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> usa la misma descomposición frecuencia-severidad que P06, pero explora modelos de mayor complejidad para comparar contra el baseline regulatorio. El <a href="/blog/data-analyst-portfolio/">portafolio de analista de datos</a> es la capa de análisis sobre esta infraestructura: los dashboards y reportes que consumen lo que los marts producen.

Cuando la infraestructura de datos es confiable, el juicio actuarial se concentra en lo que realmente importa: elegir supuestos, calibrar modelos, interpretar resultados. No en limpiar datos.

## Lo que cambiaría

Migrar a freMTPL2 (French Motor Third-Party Liability). Es público, actuarialmente realista y benchmarkeable contra literatura. Los datos sintéticos demuestran el pipeline; freMTPL2 demostraría que los modelos producen resultados con significado verificable.

Desplegar P05 en Dataflow por al menos una demostración. Dos horas costarían \$5-10 USD y producirían evidencia concreta de que el código funciona en producción, no solo en el runner directo.

Agregar monitoreo de calidad de datos como proyecto separado. Great Expectations o Soda sobre cada capa, con alertas cuando un batch rompe expectativas. En producción, la calidad de datos es tan crítica como la disponibilidad.

Construir un dashboard ejecutivo en Looker Studio conectando los 6 proyectos en una vista unificada: volumen de ingesta, estado del pipeline, métricas del warehouse, resultados de pricing. El tipo de vista que un Chief Actuary abre cada mañana.

## Para qué sirve todo esto

La ingeniería de datos no reemplaza el juicio actuarial. Lo amplifica. Un actuario que construye pipelines no depende de TI para los datos limpios. Un actuario que entiende Terraform provisiona infraestructura sin esperar aprobaciones. Un actuario que maneja streaming procesa siniestros en tiempo real. Estas no son habilidades teóricas: separan al actuario que opera dentro de Excel del que diseña los sistemas que lo alimentan.

El código, los tests y la documentación están en <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. El dashboard de siniestros está en producción en <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">Cloud Run</a>.
