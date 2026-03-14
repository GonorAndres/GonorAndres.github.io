---
title: "Pricing de Seguros con ML: Lo que Mexico Puede Aprender de la Revolucion Actuarial Europea"
description: "Modelos de frecuencia-severidad sobre freMTPL2: Poisson GLM vs XGBoost vs LightGBM con explicabilidad SHAP, auditorias de fairness y un analisis transfronterizo de lo que las tecnicas europeas de pricing con ML significan para el mercado mexicano donde el 70% de los autos no tiene seguro."
date: "2026-03-14"
category: "proyectos-y-analisis"
lang: "es"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frecuencia-severidad", "Optuna", "MLflow", "fairness"]
---

Mexico es el unico pais de la OCDE sin seguro obligatorio federal de responsabilidad civil vehicular. Aproximadamente el 30% de los vehiculos tienen alguna cobertura. El 70% restante no es un dato estadistico abstracto: son 35 millones de autos sin seguro en las calles, una falla de mercado con consecuencias directas para las victimas de accidentes que no tienen recurso legal y para las aseguradoras que tarifican conservadoramente para compensar la seleccion adversa. Los metodos de pricing que usa la mayoria de las aseguradoras mexicanas siguen siendo tradicionales: tablas de tarificacion manuales con pocas variables, juicio actuarial sobre precision algoritmica, y uso limitado de las tecnicas de modelado predictivo que han transformado el seguro europeo y norteamericano en la ultima decada.

Este proyecto plantea una pregunta concreta: ¿que puede aprender el mercado mexicano de seguros de auto de la revolucion de ciencia de datos actuarial europea? No en teoria, sino demostrado sobre el mismo dataset que la comunidad actuarial global usa como benchmark.

## Por que freMTPL2 importa

El dataset se llama freMTPL2. Contiene 677,991 polizas reales de responsabilidad civil de un asegurador frances: conteos de siniestros, exposicion, caracteristicas del vehiculo, demografia del conductor y densidad geografica. Es el dataset que Noll, Salzmann y Wuthrich usaron en su paper fundacional de 2020 para demostrar que los gradient boosting machines superan a los GLMs en prediccion de frecuencia de siniestros. Es el dataset que scikit-learn usa en su tutorial oficial de regresion Tweedie. Es el dataset que la Casualty Actuarial Society, la Asociacion Actuarial Alemana (DAV) y el Insurance Pricing Game de Imperial College London referencian como el estandar.

Construir sobre freMTPL2 no es un atajo; es una decision deliberada. Cuando haces benchmark contra los mismos datos que usa la literatura publicada, tus resultados son directamente comparables. Un coeficiente de Gini de 0.28 en freMTPL2 significa algo especifico y verificable. Un Gini de 0.28 en un dataset propietario significa lo que tu digas que significa.

## La descomposicion actuarial

El pricing de seguros no es un solo problema de prediccion. Son dos: con que frecuencia ocurren los siniestros (frecuencia), y cuando ocurren, cuanto cuestan (severidad). La prima pura que determina el precio tecnico es el producto de la frecuencia esperada por la severidad esperada. Esta descomposicion frecuencia-severidad no es un truco de modelado; es el estandar actuarial, codificado en marcos regulatorios desde Solvencia II en Europa hasta la LISF en Mexico.

Para frecuencia, el modelo natural es la regresion Poisson con funcion liga logaritmica y la exposicion como offset. Para severidad, condicional a que ocurra un siniestro, la distribucion Gamma con liga logaritmica captura la distribucion de costos sesgada a la derecha y estrictamente positiva. Estos son los GLMs que toda aseguradora de autos en el mundo usa como su baseline regulatorio. Son transparentes, auditables y respaldados por decadas de teoria actuarial.

La pregunta no es si los GLMs funcionan. Funcionan. La pregunta es si dejan precision predictiva sobre la mesa al no capturar interacciones no lineales entre variables, y si la mejora de los modelos de machine learning es lo suficientemente grande como para justificar la complejidad adicional.

## Lo que muestran los modelos

La respuesta, consistente con los benchmarks publicados, es si. En este dataset:

El **Poisson GLM** alcanza un coeficiente de Gini alrededor de 0.23 y un D-squared de aproximadamente 0.043. BonusMalus (el coeficiente de bonificacion por no siniestralidad) domina la tabla de coeficientes, con conductores jovenes y zonas urbanas mostrando las relatividades positivas esperadas. El modelo es interpretable por diseno: cada coeficiente mapea directamente a un factor multiplicativo sobre la frecuencia base.

**XGBoost** con objetivo Poisson, afinado via Optuna con 100 iteraciones de optimizacion bayesiana, alcanza un Gini alrededor de 0.27 y deviance sustancialmente menor. **LightGBM** avanza ligeramente mas, a aproximadamente 0.28. La mejora no es marginal; representa una discriminacion de riesgo materialmente superior, particularmente en las colas de la distribucion donde estan los asegurados de mayor y menor riesgo.

El hallazgo critico del analisis de double-lift es donde falla el GLM. Cuando agrupas asegurados por prediccion del GLM y comparas la vision del GBM sobre los mismos grupos, la divergencia revela subsidio cruzado sistematico: el GLM sobretarifica a conductores suburbanos seguros y subtarifica a perfiles urbanos riesgosos. Eso no es una curiosidad estadistica; es dinero. Una aseguradora que tarifica con mayor precision atrae mejores riesgos y repele los peores, creando una ventaja competitiva que se acumula con el tiempo.

## El problema de la explicabilidad

Un modelo de caja negra que supera al GLM es inutil si el regulador no puede inspeccionarlo y el actuario no puede firmarlo. Esto no es hipotetico. El EU AI Act, vigente desde 2024, clasifica el pricing de seguros como IA de alto riesgo. El Colorado AI Act entra en vigor en febrero 2026. Mexico no tiene regulacion especifica de IA para seguros todavia, pero la CNSF requiere notas tecnicas para todos los registros de tarifas, y se espera una ley general de IA para 2026.

SHAP (SHapley Additive exPlanations) resuelve esto. TreeSHAP sobre el GBM ajustado produce, para cada asegurado, una descomposicion aditiva de la prediccion en contribuciones por variable. El resumen global de SHAP confirma lo que los actuarios ya saben: BonusMalus es el predictor dominante, seguido por edad del conductor y edad del vehiculo. Pero las graficas de dependencia SHAP revelan lo que la estructura lineal del GLM no puede capturar: el efecto de la edad del conductor sobre la frecuencia tiene forma de U (conductores jovenes y mayores son mas riesgosos), y el efecto de BonusMalus se acelera no linealmente arriba de 100. Estas no linealidades son efectos reales, no artefactos, y explican el poder discriminatorio superior del GBM.

El paper de Kuo y Lupton (2023) en la revista Variance formalizo esto: SHAP combinado con graficas de dependencia parcial provee la capa de interpretabilidad que los reguladores necesitan para aprobar modelos de pricing basados en ML. La tecnica no es especulativa; es el estandar emergente.

## La pregunta de fairness

La variable Area en freMTPL2 codifica la densidad poblacional de A (rural) a F (urbano denso). La densidad esta actuarialmente justificada: las zonas urbanas tienen mas trafico, mas accidentes, costos de reparacion mas altos. Pero la densidad tambien correlaciona con nivel socioeconomico. En Francia, esto se monitorea bajo el marco del GDPR y la Directiva de Genero de la UE. En Mexico, donde la desigualdad de ingresos entre la Ciudad de Mexico y Oaxaca rural es de un orden de magnitud mayor, la pregunta es aun mas directa.

La auditoria de fairness en este proyecto compara las frecuencias predichas entre segmentos de Area para cada modelo. Si el GBM explota la densidad como proxy de algo que el regulador considera discriminatorio, esa explotacion aparece como divergencia entre las predicciones por area del modelo y la experiencia de siniestralidad real actuarialmente justificada. El analisis no resuelve la pregunta etica, pero la hace empiricamente contestable, que es el prerrequisito para cualquier discusion regulatoria.

## Conexiones con el resto del portafolio

Este proyecto ocupa una posicion especifica en el pipeline tecnico de seguros. El [dashboard de reservas P&C](/blog/insurance-claims-dashboard) analizo lo que pasa despues de que los siniestros ocurren: patrones de desarrollo, estimacion de IBNR, ratios de siniestralidad por ramo. Esa es la pregunta retrospectiva. Este proyecto es la contraparte prospectiva: dadas las caracteristicas de un asegurado, ¿que prima deberia pagar antes de que ocurra cualquier siniestro?

La frecuencia predicha del modelo de pricing alimenta directamente los inputs de perdida esperada del modelo de reservas. Si el modelo de pricing subestima sistematicamente la frecuencia para un segmento (como el analisis de double-lift muestra que el GLM hace para ciertos perfiles urbanos), el modelo de reservas eventualmente mostrara desarrollo adverso para ese segmento. Los dos proyectos son etapas consecutivas del mismo ciclo actuarial.

[SIMA](https://sima-451451662791.us-central1.run.app/) implementa la capa de calculo regulatorio para el mercado mexicano: calculos de reservas bajo LISF/CUSF, proyeccion de mortalidad Lee-Carter y el marco de suficiencia de capital que la CNSF requiere. Los modelos de pricing de este proyecto producen las primas tecnicas que los modulos de reservas de SIMA procesan rio abajo. Productos distintos (auto vs. vida), pero la misma logica regulatoria aplica: la CNSF requiere que las notas tecnicas demuestren la suficiencia actuarial de la tarifa, y el pricing con ML mas explicabilidad SHAP provee exactamente esa demostracion.

El [GMM Explorer](https://gmm-explorer.vercel.app/contexto) aborda el lado de la distribucion de severidad: dado un portafolio de siniestros, ¿que mezcla de distribuciones describe mejor el costo? Ese es el componente de severidad de la descomposicion frecuencia-severidad que este proyecto implementa para el lado de frecuencia.

## Lo que esto significa para Mexico

La brecha no es teorica. Solo el 15 al 20% de las aseguradoras mexicanas usan alguna forma de IA o ML en sus procesos de tarificacion. Qualitas, lider del mercado con el 33% de participacion en auto, tarifica con metodos tradicionales. Crabi es la unica aseguradora de auto nativa digital con licencia en Mexico en los ultimos 25 anos. Hay 68 insurtechs en el pais (segundo ecosistema mas grande en America Latina), pero la disrupcion real de la metodologia de pricing apenas ha comenzado.

El entorno regulatorio es, paradojicamente, mas permisivo que el europeo. La CNSF requiere notas tecnicas para registros de tarifas pero no requiere aprobacion previa de tarifas. No hay regulacion especifica de IA equivalente al EU AI Act. Eso significa que una aseguradora mexicana podria adoptar pricing con ML y explicabilidad SHAP hoy, presentar la nota tecnica con la demostracion de suficiencia actuarial, y desplegarlo, sin el proceso de aprobacion regulatoria multianual que enfrentan las aseguradoras europeas.

El caso de negocio es directo: primas adecuadas al riesgo basadas en pricing con ML significan precios mas bajos para buenos conductores y precios mas precisos para los malos. En un mercado donde el 70% de los vehiculos no esta asegurado, hacer el seguro mas barato para la mayoria de la poblacion no es solo una ventaja competitiva; es un camino para expandir el mercado mismo. Con 96.5% de penetracion movil, Mexico tambien tiene la infraestructura para telematica basada en smartphones (UBI), la evolucion natural despues de demostrar que las variables tradicionales ya soportan pricing con ML.

## Limitaciones y lo que sigue

Este proyecto usa datos europeos para demostrar tecnicas relevantes para Mexico. La limitacion obvia es que los patrones de manejo franceses, las flotas vehiculares y los perfiles de riesgo geografico difieren de los mexicanos. Un Nissan March en Guadalajara y un Renault Clio en Lyon enfrentan riesgos distintos. La metodologia se transfiere; los parametros no.

Lo que Mexico carece, y lo que este proyecto implicitamente argumenta, es una base de datos centralizada y anonimizada de siniestros equivalente a freMTPL2. Francia tiene una. El Reino Unido tiene una. Mexico no. AMIS (la Asociacion Mexicana de Instituciones de Seguros) podria liderar este esfuerzo, y el resultado seria transformador: un freMTPL2 mexicano que permita a toda aseguradora, no solo a las mas grandes, construir modelos de pricing basados en datos.

En el lado de modelado, CatBoost y Explainable Boosting Machines (EBMs) extenderian la comparacion. Un GLM Tweedie que modele la prima pura directamente (saltando la descomposicion frecuencia-severidad) es la extension natural del baseline. Y los intervalos de confianza bootstrap sobre las metricas de Gini y deviance convertirian estimaciones puntuales en rangos que llevan incertidumbre honesta.

## Fundamento academico

Los cuatro papers que sustentan este proyecto:

Noll, Salzmann y Wuthrich (2020) establecieron el benchmark freMTPL2 y demostraron la superioridad del GBM sobre el GLM para frecuencia de siniestros. Colella y Jones (2023) en el CAS E-Forum confirmaron que ningun modelo domina universalmente, validando el enfoque comparativo. El paper de MDPI Risks (2024) mostro que un modelo hibrido GLM+ANN supera a todos los modelos individuales, apuntando hacia las estrategias de ensamble que son el futuro probable del pricing actuarial. Y Kuo y Lupton (2023) en Variance formalizaron el marco de explicabilidad que hace el pricing con ML regulatoriamente viable.

Los PDFs estan disponibles en el repositorio del proyecto bajo `docs/references/`.

## Material de referencia

- <a href="https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing" target="_blank" rel="noopener">Repositorio en GitHub</a>: Pipeline ML completo (GLMs Poisson/Gamma, XGBoost, LightGBM con tuning Optuna y tracking MLflow), analisis SHAP, auditoria de fairness, backend FastAPI y dashboard interactivo Next.js con 4 pestanas.
