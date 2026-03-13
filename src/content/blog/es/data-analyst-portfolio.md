---
title: "Portafolio de Analista de Datos: 7 Proyectos End-to-End"
description: "De la pregunta de negocio al insight accionable. 7 proyectos de analisis de datos que cubren e-commerce, seguros, finanzas, pruebas A/B, KPIs ejecutivos y eficiencia operacional. SQL, Python, Streamlit, Next.js y Power BI."
date: "2026-03-13"
category: "proyectos-y-analisis"
lang: "es"
tags: ["portafolio", "data-analyst", "SQL", "Python", "Streamlit", "Next.js", "Power BI"]
---

<img src="/screenshots/data-analyst-portafolio.png" alt="Portafolio de Analista de Datos" style="width:100%;border-radius:0.75rem;margin-bottom:2rem;box-shadow:0 4px 16px rgba(0,0,0,0.08);" />

El trabajo de un analista de datos no es producir graficas. Es convertir una pregunta de negocio en una decision informada. Cada proyecto de este portafolio sigue ese arco completo: un stakeholder tiene una pregunta, los datos existen en algun formato inconveniente, el analisis produce un hallazgo, y el hallazgo se entrega en un formato que la audiencia puede usar para actuar.

Construi estos 7 proyectos durante mi transicion de actuaria a roles hibridos de analisis de datos. La formacion actuarial aporta rigor estadistico (Kaplan-Meier, distribuciones de severidad, metodos de reserva) pero los roles de DA exigen herramientas diferentes: SQL fluido, dashboards interactivos, storytelling para audiencias no tecnicas, y la capacidad de moverse entre dominios sin perder profundidad. Estos proyectos demuestran exactamente eso.

El hilo conductor es metodologico: ETL cuidadoso, analisis exploratorio antes de cualquier conclusion, segmentacion como herramienta recurrente, y entrega en el formato que el stakeholder necesita, ya sea un dashboard interactivo, un PDF automatizado o una app de Streamlit.

## Los 7 proyectos

### 00 - Airbnb CDMX: analisis de mercado

**Pregunta de negocio:** Como esta estructurado el mercado de rentas cortas en Ciudad de Mexico, y que tan concentrada esta la oferta?

El dataset de Inside Airbnb para CDMX contiene 27,051 listings con 79 columnas. El pipeline ETL limpia precios (llegan como strings con simbolo de moneda), gestiona nulos y segmenta hosts entre operadores enterprise y casuales. El hallazgo central: el 7% de los hosts controla el 40% de la oferta. Blueground, Mr. W y Clau no son anfitriones compartiendo su departamento, son empresas de hospitalidad operando a escala industrial. Cuauhtemoc concentra el 46% de los listings, mientras que las alcaldias perifericas como Tlalpan (MXN 2,493 promedio) muestran pricing premium con oferta escasa.

Dashboard construido con Next.js y Recharts, arquitectura estatica (JSON precalculado, zero backend).

**Estado:** Completo | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">GitHub</a>

### 01 - Reservas actuariales P&C: IBNR y siniestralidad

**Pregunta de negocio:** De las 6 lineas de negocio del portafolio, cuales son rentables y cual es el IBNR total que la aseguradora debe reservar?

Analisis de reservas sobre datos regulatorios NAIC Schedule P con metodos Chain-Ladder y Bornhuetter-Ferguson. El dataset incluye ~50K siniestros sinteticos con distribuciones actuarialmente realistas (lognormal para severidad, Poisson para frecuencia, exponencial para rezago de reporte). El resultado: solo Private Passenger Auto y Product Liability son rentables. Medical Malpractice muestra un ratio de perdidas de ~280%, una senal clara de pricing estructuralmente insuficiente. El IBNR total del portafolio es ~$20.4M, concentrado desproporcionadamente en las lineas de cola larga.

Dashboard interactivo con Next.js y FastAPI: triangulos de perdida en heatmap, waterfall de IBNR, frecuencia-severidad y tendencia de ratios combinados.

**Estado:** Completo | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">GitHub</a>

### 02 - Cohortes de E-Commerce: retencion, RFM y LTV

**Pregunta de negocio:** Que diferencia al 3% de clientes que recompran en Olist del 97% que no regresa?

El Brazilian E-Commerce Public Dataset tiene ~99K ordenes en 9 CSVs. El caveat critico: solo ~3% de los clientes son compradores repetidos, lo que transforma el analisis de cohortes clasico en una investigacion sobre que diferencia a ese 3%. El pipeline usa `customer_unique_id` (no `customer_id`) para evitar contar duplicados. El analisis incluye matrices de retencion, curvas de supervivencia Kaplan-Meier, segmentacion RFM y estimacion de LTV.

App de Streamlit desplegada en Cloud Run con pipeline tecnico completo visible (notebooks convertidos a HTML embebidos en la app).

**Estado:** Completo | <a href="https://da-cohort-streamlit-451451662791.us-central1.run.app/" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/02-ecommerce-cohort-analysis" target="_blank" rel="noopener">GitHub</a>

### 03 - Pruebas A/B: frecuentista, bayesiano y paradoja de Simpson

**Pregunta de negocio:** Si ejecutamos un test A/B de conversion, que enfoque estadistico nos da la respuesta mas confiable y por que los resultados agregados pueden mentir?

Evaluacion de tasas de conversion con tres enfoques: test frecuentista clasico, inferencia bayesiana con distribucion Beta y PyMC, y monitoreo secuencial. El proyecto incluye un analisis explicito de la paradoja de Simpson: como los resultados agregados del test pueden invertirse al segmentar por subgrupo, un riesgo real en cualquier experimento de producto.

Dashboard interactivo con Next.js que permite explorar cada enfoque estadistico, calcular potencia de prueba y visualizar la convergencia bayesiana.

**Estado:** En progreso | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/03-ab-test-analysis" target="_blank" rel="noopener">GitHub</a>

### 04 - Reporte KPI Ejecutivo: metricas SaaS automatizadas

**Pregunta de negocio:** Como automatizar la generacion de reportes ejecutivos mensuales con deteccion de anomalias y forecast de metricas clave?

Pipeline automatizado que genera reportes ejecutivos en PDF a partir de metricas SaaS (MRR, churn, CAC, LTV). Incluye deteccion de anomalias sobre series de tiempo y forecast de metricas para el trimestre siguiente. El output es un PDF bilingue (espanol/ingles) listo para enviar al C-suite, con visualizaciones Plotly exportadas a imagen.

5 notebooks que cubren desde generacion de datos hasta automatizacion del reporte. Dashboard Next.js complementario.

**Estado:** En progreso | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/04-executive-kpi-report" target="_blank" rel="noopener">GitHub</a>

### 05 - Portafolio Financiero: Monte Carlo y frontera eficiente

**Pregunta de negocio:** Dado un portafolio de activos, cual es su perfil de riesgo-rendimiento y como se compara contra la frontera eficiente?

Analisis de portafolio con simulacion Monte Carlo, calculo de frontera eficiente de Markowitz, metricas de riesgo (VaR, CVaR, Sharpe, Sortino) y atribucion de rendimiento. La app de Streamlit permite al usuario definir su portafolio y ver en tiempo real como se posiciona respecto a la frontera eficiente y los benchmarks.

4 notebooks cubriendo adquisicion de datos, construccion de portafolio, analisis de rendimiento y analitica de riesgo.

**Estado:** En progreso | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/05-financial-portfolio-tracker" target="_blank" rel="noopener">GitHub</a>

### 06 - Eficiencia Operacional: NYC 311, mineria de procesos y SLA

**Pregunta de negocio:** Que patrones de ineficiencia existen en las solicitudes de servicio de NYC 311 y donde se violan los SLAs sistematicamente?

Analisis de eficiencia operacional sobre datos de NYC 311 (solicitudes de servicio publico). Incluye mineria de procesos para identificar cuellos de botella, analisis de cumplimiento de SLAs por agencia y tipo de solicitud, y segmentacion geografica de tiempos de respuesta.

Dashboard Next.js con visualizaciones de flujos de proceso, heatmaps de SLA y rankings de agencias.

**Estado:** En progreso | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/06-operational-efficiency" target="_blank" rel="noopener">GitHub</a>

## Decisiones de arquitectura

La eleccion de herramienta de entrega no es arbitraria. Depende de tres factores: quien es la audiencia, que tan interactivo necesita ser el output, y cual es el ciclo de actualizacion.

**Next.js** (proyectos 00, 01, 03, 04, 06) cuando el dashboard es un producto terminado que necesita control total sobre la estetica, modo oscuro, responsive en movil, y componentes reutilizables entre proyectos. El costo es mayor: requiere conocimiento de React, TypeScript y un pipeline de build. Se justifica cuando el dashboard tiene vida larga o cuando los componentes se reutilizan (KPICard, ChartContainer y ThemeToggle se comparten entre todos los dashboards de Next.js).

**Streamlit** (proyectos 02, 05) cuando el analisis vive en Python y la prioridad es pasar de notebook a app interactiva con minimo overhead. Streamlit es la opcion correcta cuando el analista es la misma persona que va a mantener la app y el stack de Python ya esta establecido. El patron de notebook-en-Streamlit (convertir notebooks a HTML y embederlos como pagina de proceso tecnico) anade valor de portafolio: el viewer ve el codigo completo detras de cada visualizacion sin salir de la app.

**Power BI** aparece en el plan para los proyectos 04 y 06 como formato complementario, orientado a stakeholders que ya trabajan en el ecosistema Microsoft y esperan filtros de segmentacion drag-and-drop.

La decision entre **JSON estatico** (Airbnb, zero backend) y **API con FastAPI** (Olist, Insurance) depende de si los filtros del usuario cambian el computo subyacente. Si los datos caben en memoria y las agregaciones son fijas, JSON estatico elimina toda la complejidad de infraestructura. Si el analisis de cohortes o los triangulos de perdida dependen de los filtros aplicados, el backend es necesario.

## Aprendizajes transversales

Despues de construir 7 proyectos en dominios diferentes, los patrones recurrentes son mas instructivos que cualquier hallazgo individual.

**El ETL consume la mayor parte del tiempo real.** En todos los proyectos, la limpieza y transformacion de datos tomo mas tiempo que el analisis. Los precios de Airbnb llegan como strings con simbolo de moneda y comas. Los timestamps de Olist necesitan parsing cuidadoso para construir cohortes correctas. Los datos del NAIC Schedule P requieren validacion cruzada entre tablas antes de construir triangulos confiables. Los datos de NYC 311 tienen inconsistencias entre agencias en como registran los tipos de solicitud. La metodologia es transferible: validacion de tipos, manejo explicito de nulos, logging de registros descartados.

**La segmentacion por percentiles aparece en todos los dominios.** Clasificar hosts de Airbnb en enterprise vs casual (por numero de listings), segmentar clientes de Olist en clusters RFM (por recencia, frecuencia y monto), clasificar lineas de negocio de seguros por perfil de cola, segmentar agencias de NYC por cumplimiento de SLA. El patron es identico: definir umbrales sobre una distribucion, asignar etiquetas, medir diferencias entre grupos, tomar decisiones basadas en la heterogeneidad.

**El 3% de recompra de Olist cambia como se enmarca un analisis de cohortes.** Cuando la gran mayoria de clientes son one-time buyers, la pregunta no es "que tan bien retenemos" sino "que diferencia a los que regresan." Ese reencuadre aplica en seguros (que diferencia a las polizas que renuevan), en SaaS (que diferencia a los usuarios que no hacen churn) y en cualquier negocio con alta tasa de abandono.

**El rigor estadistico de la formacion actuarial se aplica directamente a producto.** Kaplan-Meier para curvas de supervivencia de clientes. Distribuciones de severidad para modelar LTV. Bornhuetter-Ferguson como ejemplo de como combinar datos observados con un prior cuando la experiencia es escasa. Estos no son metodos exclusivos de seguros; son herramientas estadisticas que la mayoria de analistas de producto no usa porque no las conoce.

## Conexiones con el portafolio actuarial

Este portafolio de DA no existe en aislamiento. Los proyectos actuariales en el portafolio principal complementan directamente el trabajo aqui:

- **SIMA** (Sistema Integral de Modelacion Actuarial) comparte con el proyecto 01 la logica de calculo de reservas, aunque para productos de vida en lugar de danos. Los mismos factores de descuento y patrones de desarrollo que aparecen en los triangulos del NAIC viven como funciones modulares en el motor de SIMA.
- **GMM Explorer** conecta con la segmentacion de este portafolio: definir grupos a partir de distribuciones de siniestros de Gastos Medicos Mayores es el mismo patron de clasificacion por percentiles que aparece en RFM, segmentacion de hosts y analisis de SLA.
- Las **notas tecnicas de seguros** (vida y danos) son el referente regulatorio: los marcos de la CNSF que gobiernan como se calculan reservas en el mercado mexicano. La metodologia del proyecto 01 es analoga, adaptada al contexto americano (NAIC).

## Material de referencia

- <a href="https://github.com/GonorAndres/data-analyst-path" target="_blank" rel="noopener">Repositorio principal en GitHub</a>: Codigo completo de los 7 proyectos, notebooks numerados, queries SQL, pipelines ETL y configuracion de despliegue.
- <a href="https://da-cohort-streamlit-451451662791.us-central1.run.app/" target="_blank" rel="noopener">E-Commerce Cohort Analysis (App en vivo)</a>: Streamlit desplegado en Cloud Run con pipeline tecnico completo.
