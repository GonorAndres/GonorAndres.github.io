---
title: "Pricing de Seguros con ML: Lo que México Puede Aprender de la Revolución Actuarial Europea"
description: "Modelos de frecuencia-severidad sobre freMTPL2: Poisson GLM vs XGBoost vs LightGBM con explicabilidad SHAP, auditorías de fairness y un análisis transfronterizo de lo que las técnicas europeas de pricing con ML significan para el mercado mexicano donde el 70% de los autos no tiene seguro."
date: "2026-03-14"
category: "proyectos-y-analisis"
lang: "es"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frecuencia-severidad", "Optuna", "MLflow", "fairness"]
---

México es el único país de la OCDE sin seguro obligatorio federal de responsabilidad civil vehicular. Aproximadamente el 30% de los vehículos tienen alguna cobertura. El 70% restante no es un dato estadístico abstracto: son 35 millones de autos sin seguro en las calles, una falla de mercado con consecuencias directas para las víctimas de accidentes que no tienen recurso legal y para las aseguradoras que tarifican conservadoramente para compensar la selección adversa. Los métodos de pricing que usa la mayoría de las aseguradoras mexicanas siguen siendo tradicionales: tablas de tarificación manuales con pocas variables, juicio actuarial sobre precisión algorítmica, y uso limitado de las técnicas de modelado predictivo que han transformado el seguro europeo y norteamericano en la última década.

Este proyecto plantea una pregunta concreta: ¿qué puede aprender el mercado mexicano de seguros de auto de la revolución de ciencia de datos actuarial europea? No en teoría, sino demostrado sobre el mismo dataset que la comunidad actuarial global usa como benchmark.

## Por qué freMTPL2 importa

El dataset se llama freMTPL2. Contiene 677,991 pólizas reales de responsabilidad civil de un asegurador francés: conteos de siniestros, exposición, características del vehículo, demografía del conductor y densidad geográfica. Es el dataset que Noll, Salzmann y Wuthrich usaron en su paper fundacional de 2020 para demostrar que los gradient boosting machines superan a los GLMs en predicción de frecuencia de siniestros. Es el dataset que scikit-learn usa en su tutorial oficial de regresión Tweedie. Es el dataset que la Casualty Actuarial Society, la Asociación Actuarial Alemana (DAV) y el Insurance Pricing Game de Imperial College London referencian como el estándar.

Construir sobre freMTPL2 no es un atajo; es una decisión deliberada. Cuando haces benchmark contra los mismos datos que usa la literatura publicada, tus resultados son directamente comparables. Un coeficiente de Gini de 0.28 en freMTPL2 significa algo específico y verificable. Un Gini de 0.28 en un dataset propietario significa lo que tú digas que significa.

## La descomposición actuarial

El pricing de seguros no es un solo problema de predicción. Son dos: con qué frecuencia ocurren los siniestros (frecuencia), y cuando ocurren, cuánto cuestan (severidad). La prima pura que determina el precio técnico es el producto de la frecuencia esperada por la severidad esperada. Esta descomposición frecuencia-severidad no es un truco de modelado; es el estándar actuarial, codificado en marcos regulatorios desde Solvencia II en Europa hasta la LISF en México.

Para frecuencia, el modelo natural es la regresión Poisson con función liga logarítmica y la exposición como offset. Para severidad, condicional a que ocurra un siniestro, la distribución Gamma con liga logarítmica captura la distribución de costos sesgada a la derecha y estrictamente positiva. Estos son los GLMs que toda aseguradora de autos en el mundo usa como su baseline regulatorio. Son transparentes, auditables y respaldados por décadas de teoría actuarial.

La pregunta no es si los GLMs funcionan. Funcionan. La pregunta es si dejan precisión predictiva sobre la mesa al no capturar interacciones no lineales entre variables, y si la mejora de los modelos de machine learning es lo suficientemente grande como para justificar la complejidad adicional.

## Lo que muestran los modelos

La respuesta, consistente con los benchmarks publicados, es sí. En este dataset:

El **Poisson GLM** alcanza un coeficiente de Gini alrededor de 0.23 y un D-squared de aproximadamente 0.043. BonusMalus (el coeficiente de bonificación por no siniestralidad) domina la tabla de coeficientes, con conductores jóvenes y zonas urbanas mostrando las relatividades positivas esperadas. El modelo es interpretable por diseño: cada coeficiente mapea directamente a un factor multiplicativo sobre la frecuencia base.

**XGBoost** con objetivo Poisson, afinado vía Optuna con 100 iteraciones de optimización bayesiana, alcanza un Gini alrededor de 0.27 y deviance sustancialmente menor. **LightGBM** avanza ligeramente más, a aproximadamente 0.28. La mejora no es marginal; representa una discriminación de riesgo materialmente superior, particularmente en las colas de la distribución donde están los asegurados de mayor y menor riesgo.

El hallazgo crítico del análisis de double-lift es donde falla el GLM. Cuando agrupas asegurados por predicción del GLM y comparas la visión del GBM sobre los mismos grupos, la divergencia revela subsidio cruzado sistemático: el GLM sobretarifica a conductores suburbanos seguros y subtarifica a perfiles urbanos riesgosos. Eso no es una curiosidad estadística; es dinero. Una aseguradora que tarifica con mayor precisión atrae mejores riesgos y repele los peores, creando una ventaja competitiva que se acumula con el tiempo.

## El problema de la explicabilidad

Un modelo de caja negra que supera al GLM es inútil si el regulador no puede inspeccionarlo y el actuario no puede firmarlo. Esto no es hipotético. El EU AI Act, vigente desde 2024, clasifica el pricing de seguros como IA de alto riesgo. El Colorado AI Act entra en vigor en febrero 2026. México no tiene regulación específica de IA para seguros todavía, pero la CNSF requiere notas técnicas para todos los registros de tarifas, y se espera una ley general de IA para 2026.

SHAP (SHapley Additive exPlanations) resuelve esto. TreeSHAP sobre el GBM ajustado produce, para cada asegurado, una descomposición aditiva de la predicción en contribuciones por variable. El resumen global de SHAP confirma lo que los actuarios ya saben: BonusMalus es el predictor dominante, seguido por edad del conductor y edad del vehículo. Pero las gráficas de dependencia SHAP revelan lo que la estructura lineal del GLM no puede capturar: el efecto de la edad del conductor sobre la frecuencia tiene forma de U (conductores jóvenes y mayores son más riesgosos), y el efecto de BonusMalus se acelera no linealmente arriba de 100. Estas no linealidades son efectos reales, no artefactos, y explican el poder discriminatorio superior del GBM.

El paper de Kuo y Lupton (2023) en la revista Variance formalizó esto: SHAP combinado con gráficas de dependencia parcial provee la capa de interpretabilidad que los reguladores necesitan para aprobar modelos de pricing basados en ML. La técnica no es especulativa; es el estándar emergente.

## La pregunta de fairness

La variable Area en freMTPL2 codifica la densidad poblacional de A (rural) a F (urbano denso). La densidad está actuarialmente justificada: las zonas urbanas tienen más tráfico, más accidentes, costos de reparación más altos. Pero la densidad también correlaciona con nivel socioeconómico. En Francia, esto se monitorea bajo el marco del GDPR y la Directiva de Género de la UE. En México, donde la desigualdad de ingresos entre la Ciudad de México y Oaxaca rural es de un orden de magnitud mayor, la pregunta es aún más directa.

La auditoría de fairness en este proyecto compara las frecuencias predichas entre segmentos de Area para cada modelo. Si el GBM explota la densidad como proxy de algo que el regulador considera discriminatorio, esa explotación aparece como divergencia entre las predicciones por área del modelo y la experiencia de siniestralidad real actuarialmente justificada. El análisis no resuelve la pregunta ética, pero la hace empíricamente contestable, que es el prerrequisito para cualquier discusión regulatoria.

## Conexiones con el resto del portafolio

Este proyecto ocupa una posición específica en el pipeline técnico de seguros. El [dashboard de reservas P&C](/blog/insurance-claims-dashboard) analizó lo que pasa después de que los siniestros ocurren: patrones de desarrollo, estimación de IBNR, ratios de siniestralidad por ramo. Esa es la pregunta retrospectiva. Este proyecto es la contraparte prospectiva: dadas las características de un asegurado, ¿qué prima debería pagar antes de que ocurra cualquier siniestro?

La frecuencia predicha del modelo de pricing alimenta directamente los inputs de pérdida esperada del modelo de reservas. Si el modelo de pricing subestima sistemáticamente la frecuencia para un segmento (como el análisis de double-lift muestra que el GLM hace para ciertos perfiles urbanos), el modelo de reservas eventualmente mostrará desarrollo adverso para ese segmento. Los dos proyectos son etapas consecutivas del mismo ciclo actuarial.

[SIMA](https://sima-451451662791.us-central1.run.app/) implementa la capa de cálculo regulatorio para el mercado mexicano: cálculos de reservas bajo LISF/CUSF, proyección de mortalidad Lee-Carter y el marco de suficiencia de capital que la CNSF requiere. Los modelos de pricing de este proyecto producen las primas técnicas que los módulos de reservas de SIMA procesan río abajo. Productos distintos (auto vs. vida), pero la misma lógica regulatoria aplica: la CNSF requiere que las notas técnicas demuestren la suficiencia actuarial de la tarifa, y el pricing con ML más explicabilidad SHAP provee exactamente esa demostración.

El [GMM Explorer](https://gmm-explorer.vercel.app/contexto) aborda el lado de la distribución de severidad: dado un portafolio de siniestros, ¿qué mezcla de distribuciones describe mejor el costo? Ese es el componente de severidad de la descomposición frecuencia-severidad que este proyecto implementa para el lado de frecuencia.

## Lo que esto significa para México

La brecha no es teórica. Solo el 15 al 20% de las aseguradoras mexicanas usan alguna forma de IA o ML en sus procesos de tarificación. Qualitas, líder del mercado con el 33% de participación en auto, tarifica con métodos tradicionales. Crabi es la única aseguradora de auto nativa digital con licencia en México en los últimos 25 años. Hay 68 insurtechs en el país (segundo ecosistema más grande en América Latina), pero la disrupción real de la metodología de pricing apenas ha comenzado.

El entorno regulatorio es, paradójicamente, más permisivo que el europeo. La CNSF requiere notas técnicas para registros de tarifas pero no requiere aprobación previa de tarifas. No hay regulación específica de IA equivalente al EU AI Act. Eso significa que una aseguradora mexicana podría adoptar pricing con ML y explicabilidad SHAP hoy, presentar la nota técnica con la demostración de suficiencia actuarial, y desplegarlo, sin el proceso de aprobación regulatoria multianual que enfrentan las aseguradoras europeas.

El caso de negocio es directo: primas adecuadas al riesgo basadas en pricing con ML significan precios más bajos para buenos conductores y precios más precisos para los malos. En un mercado donde el 70% de los vehículos no está asegurado, hacer el seguro más barato para la mayoría de la población no es solo una ventaja competitiva; es un camino para expandir el mercado mismo. Con 96.5% de penetración móvil, México también tiene la infraestructura para telemática basada en smartphones (UBI), la evolución natural después de demostrar que las variables tradicionales ya soportan pricing con ML.

## Limitaciones y lo que sigue

Este proyecto usa datos europeos para demostrar técnicas relevantes para México. La limitación obvia es que los patrones de manejo franceses, las flotas vehiculares y los perfiles de riesgo geográfico difieren de los mexicanos. Un Nissan March en Guadalajara y un Renault Clio en Lyon enfrentan riesgos distintos. La metodología se transfiere; los parámetros no.

Lo que México carece, y lo que este proyecto implícitamente argumenta, es una base de datos centralizada y anonimizada de siniestros equivalente a freMTPL2. Francia tiene una. El Reino Unido tiene una. México no. AMIS (la Asociación Mexicana de Instituciones de Seguros) podría liderar este esfuerzo, y el resultado sería transformador: un freMTPL2 mexicano que permita a toda aseguradora, no solo a las más grandes, construir modelos de pricing basados en datos.

En el lado de modelado, CatBoost y Explainable Boosting Machines (EBMs) extenderían la comparación. Un GLM Tweedie que modele la prima pura directamente (saltando la descomposición frecuencia-severidad) es la extensión natural del baseline. Y los intervalos de confianza bootstrap sobre las métricas de Gini y deviance convertirían estimaciones puntuales en rangos que llevan incertidumbre honesta.

## Fundamento académico

Los cuatro papers que sustentan este proyecto:

Noll, Salzmann y Wuthrich (2020) establecieron el benchmark freMTPL2 y demostraron la superioridad del GBM sobre el GLM para frecuencia de siniestros. Colella y Jones (2023) en el CAS E-Forum confirmaron que ningún modelo domina universalmente, validando el enfoque comparativo. El paper de MDPI Risks (2024) mostró que un modelo híbrido GLM+ANN supera a todos los modelos individuales, apuntando hacia las estrategias de ensamble que son el futuro probable del pricing actuarial. Y Kuo y Lupton (2023) en Variance formalizaron el marco de explicabilidad que hace el pricing con ML regulatoriamente viable.

Los PDFs están disponibles en el repositorio del proyecto bajo `docs/references/`.

## Material de referencia

- <a href="https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing" target="_blank" rel="noopener">Repositorio en GitHub</a>: Pipeline ML completo (GLMs Poisson/Gamma, XGBoost, LightGBM con tuning Optuna y tracking MLflow), análisis SHAP, auditoría de fairness, backend FastAPI y dashboard interactivo Next.js con 4 pestañas.
