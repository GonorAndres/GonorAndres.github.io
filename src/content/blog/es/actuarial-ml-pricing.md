---
title: "Pricing de Seguros con ML: Lo que México Puede Aprender de la Revolución Actuarial Europea"
description: "Modelos de frecuencia-severidad sobre freMTPL2: Poisson GLM vs XGBoost vs LightGBM con explicabilidad SHAP, auditorías de fairness y un análisis transfronterizo de lo que las técnicas europeas de pricing con ML significan para el mercado mexicano donde el 70% de los autos no tiene seguro."
date: "2026-03-14"
category: "proyectos-y-analisis"
lang: "es"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frecuencia-severidad", "Optuna", "MLflow", "fairness"]
---

México es el único país de la OCDE sin seguro obligatorio federal de responsabilidad civil vehicular. Aproximadamente el 30% de los vehículos tienen alguna cobertura. El 70% restante representa 35 millones de autos sin seguro en las calles; una falla de mercado que corta de dos formas. Las víctimas de accidentes no tienen recurso legal. Las aseguradoras tarifican conservadoramente para compensar la selección adversa que enfrentan. Y los métodos usados por la mayoría de las aseguradoras mexicanas permanecen tradicionales: tablas de tarificación manuales con pocas variables, juicio actuarial ponderado sobre precisión algorítmica, uso limitado de las técnicas de modelado predictivo que ya han transformado el seguro europeo y norteamericano.

Este proyecto plantea una pregunta concreta: ¿qué puede aprender el mercado mexicano de seguros de auto de la revolución de ciencia de datos actuarial europea? No en teoría, sino demostrado sobre el mismo dataset que la comunidad actuarial global usa como benchmark.

## Por qué freMTPL2 importa

El dataset se llama freMTPL2. Contiene 677,991 pólizas reales de responsabilidad civil de un asegurador francés: conteos de siniestros, exposición, características del vehículo, demografía del conductor y densidad geográfica. Es el dataset que Noll, Salzmann y Wuthrich usaron en su paper fundacional de 2020 para demostrar que los gradient boosting machines superan a los GLMs en predicción de frecuencia de siniestros. Es el dataset que scikit-learn usa en su tutorial oficial de regresión Tweedie. Es el dataset que la Casualty Actuarial Society, la Asociación Actuarial Alemana (DAV) y el Insurance Pricing Game de Imperial College London referencian como el estándar.

Construir sobre freMTPL2 es una decisión deliberada, no un atajo. Cuando haces benchmark contra datos que usa la literatura publicada, tus resultados son directamente comparables. Un coeficiente de Gini de 0.28 en freMTPL2 es algo específico y verificable. En un dataset propietario, significa solo lo que tú digas.

## La descomposición actuarial

El pricing de seguros se reduce a dos problemas de predicción interconectados: con qué frecuencia ocurren los siniestros y cuánto cuestan cuando ocurren. La prima pura —que determina el precio técnico— es el producto de la frecuencia esperada por la severidad esperada. Esta descomposición frecuencia-severidad es el estándar actuarial, codificado en marcos regulatorios desde Solvencia II en Europa hasta la LISF en México. No es un truco de modelado; es una estructura obligatoria.

Para frecuencia, la regresión Poisson con función liga logarítmica y exposición como offset es el estándar. Para severidad, la distribución Gamma con liga logarítmica captura la distribución de costos sesgada a la derecha y estrictamente positiva una vez ocurre un siniestro. Estos GLMs forman el baseline regulatorio en todas las aseguradoras de autos globalmente, elegidos por tres razones: transparencia, auditabilidad y décadas de teoría actuarial detrás de ellos.

Los GLMs funcionan; la pregunta es si dejan precisión predictiva sobre la mesa. ¿No capturan interacciones no lineales entre variables? ¿Y la mejora de los modelos de machine learning es lo suficientemente grande como para justificar la complejidad adicional?

## Lo que muestran los modelos

La respuesta, consistente con los benchmarks publicados, es sí. En este dataset:

El **Poisson GLM** alcanza un coeficiente de Gini alrededor de 0.23 con un D-squared de aproximadamente 0.043. BonusMalus domina la tabla de coeficientes (la bonificación por no siniestralidad es la señal más fuerte), mientras que conductores jóvenes y zonas urbanas muestran las relatividades positivas esperadas. La interpretabilidad aquí es inherente: cada coeficiente mapea directamente a un factor multiplicativo sobre la frecuencia base.

**XGBoost** con objetivo Poisson, afinado vía Optuna con 100 iteraciones de optimización bayesiana, alcanza un Gini alrededor de 0.27 con deviance sustancialmente menor. **LightGBM** avanza a aproximadamente 0.28. Esto no es una mejora marginal. Representa una discriminación de riesgo materialmente superior, particularmente en las colas de la distribución donde están los asegurados más seguros y más riesgosos.

El análisis de double-lift expone dónde falla el GLM. Agrupa asegurados por predicción del GLM, luego compara la evaluación del GBM sobre esos mismos grupos. La divergencia es notable: el GLM sobretarifica a conductores suburbanos seguros y subtarifica a perfiles urbanos riesgosos. Esto es subsidio cruzado sistemático, y no es una curiosidad estadística. Es dinero. Una aseguradora que tarifica con mayor precisión atrae mejores riesgos y repele los peores, construyendo una ventaja competitiva que se acumula con el tiempo.

## El problema de la explicabilidad

Un modelo de caja negra que supera al GLM no tiene valor si los reguladores no pueden inspeccionarlo y los actuarios no pueden firmarlo. Esto no es hipotético. El EU AI Act (vigente desde 2024) clasifica el pricing de seguros como IA de alto riesgo. El Colorado AI Act entra en vigor en febrero 2026. México no ha emitido regulación específica de IA para seguros aún, pero la CNSF requiere notas técnicas para todos los registros de tarifas, y se espera una ley general de IA para 2026.

SHAP (SHapley Additive exPlanations) es la respuesta. TreeSHAP descompone la predicción del GBM ajustado para cada asegurado en contribuciones aditivas por variable. El resumen global de SHAP confirma lo que los actuarios ya saben: BonusMalus domina, seguido por edad del conductor y edad del vehículo. Lo que revela a continuación es más interesante. Las gráficas de dependencia SHAP muestran el efecto en forma de U de la edad del conductor (conductores jóvenes y mayores son más riesgosos) y la aceleración no lineal de BonusMalus arriba de 100. Estos son efectos reales, no artefactos estadísticos, y explican por qué la discriminación de riesgo del GBM es superior.

Kuo y Lupton (2023, revista Variance) formalizaron este resultado: SHAP combinado con gráficas de dependencia parcial provee la capa de interpretabilidad que los reguladores necesitan para aprobar modelos de pricing basados en ML. No es especulativo; es el estándar emergente.

## La pregunta de fairness

La variable Area en freMTPL2 codifica la densidad poblacional de A (rural) a F (urbano denso). La densidad es actuarialmente sólida: las zonas urbanas enfrentan más tráfico, más accidentes, costos de reparación más altos. La densidad también correlaciona con nivel socioeconómico. Francia monitorea esto bajo GDPR y la Directiva de Género de la UE. La desigualdad de ingresos entre la Ciudad de México y Oaxaca rural en México es un orden de magnitud mayor, lo que hace la misma pregunta mucho más aguda.

La auditoría de fairness compara las frecuencias predichas entre segmentos de Area para cada modelo. Si el GBM explota la densidad como proxy de algo que los reguladores consideran discriminatorio, la divergencia emerge: las predicciones por área del modelo divergen de la experiencia de siniestralidad real actuarialmente justificada. El análisis no resuelve la pregunta ética, pero la hace empíricamente contestable, que es el prerrequisito para cualquier discusión regulatoria.

## Conexiones con el resto del portafolio

Este proyecto ocupa una posición específica en el pipeline técnico de seguros. El [dashboard de reservas P&C](/blog/insurance-claims-dashboard) respondió la pregunta retrospectiva: qué pasa después de que los siniestros ocurren (patrones de desarrollo, IBNR, ratios de siniestralidad por ramo). Este responde la contraparte prospectiva: dadas las características de un asegurado, ¿qué prima debería pagar antes de que ocurra cualquier siniestro?

La conexión es directa. La frecuencia predicha del modelo de pricing alimenta los inputs de pérdida esperada del modelo de reservas. Si el modelo de pricing subestima sistemáticamente la frecuencia para un segmento (como el GLM hace para ciertos perfiles urbanos en el análisis de double-lift), el modelo de reservas eventualmente mostrará desarrollo adverso. Los dos proyectos son etapas consecutivas de un solo ciclo actuarial.

[SIMA](https://sima-451451662791.us-central1.run.app/) implementa la capa de cálculo regulatorio para México: reservas bajo LISF/CUSF, proyección de mortalidad Lee-Carter y suficiencia de capital mandatada por la CNSF. Las primas técnicas de este proyecto alimentan los módulos de reservas de SIMA río abajo. Productos distintos (auto vs. vida), misma lógica regulatoria: la CNSF requiere notas técnicas que demuestren suficiencia actuarial, y el pricing con ML más explicabilidad SHAP entrega exactamente eso.

El [GMM Explorer](https://gmm-explorer.vercel.app/contexto) aborda la distribución de severidad: dado un portafolio de siniestros, ¿qué mezcla de distribuciones describe mejor el costo? Este es el lado de severidad de la descomposición frecuencia-severidad que este proyecto maneja en el lado de frecuencia.

## Lo que esto significa para México

La brecha no es teórica. Solo el 15–20% de las aseguradoras mexicanas usa alguna forma de IA o ML en tarificación. Qualitas (33% de participación en auto) aún usa métodos tradicionales. Crabi es la única aseguradora de auto nativa digital con licencia en México en 25 años. México tiene 68 insurtechs, el segundo ecosistema más grande en América Latina, pero la disrupción de metodología de pricing apenas ha comenzado.

El entorno regulatorio es paradójicamente más permisivo que el europeo. La CNSF requiere notas técnicas para registros de tarifas pero no aprobación previa. No existe regulación específica de IA comparable al EU AI Act. Una aseguradora mexicana podría adoptar pricing con ML y explicabilidad SHAP hoy: presentar la nota técnica demostrando suficiencia actuarial y desplegar, evitando el proceso de aprobación multianual que enfrentan las aseguradoras europeas.

El caso de negocio es directo: primas adecuadas al riesgo basadas en ML significan precios más bajos para buenos conductores y precios más precisos para los malos. En un mercado donde el 70% de los vehículos no está asegurado, hacer el seguro más barato para la mayoría de la población no es solo ventaja competitiva; expande el mercado mismo. Con 96.5% de penetración móvil, México tiene la infraestructura para telemática basada en smartphones (UBI), el paso natural después de demostrar que las variables tradicionales ya soportan pricing con ML.

## Limitaciones y lo que sigue

Este proyecto usa datos europeos para demostrar técnicas relevantes para México. La limitación es clara: los patrones de manejo franceses, las flotas vehiculares y los perfiles de riesgo geográfico difieren de México. Un Nissan March en Guadalajara enfrenta riesgos distintos que un Renault Clio en Lyon. La metodología se transfiere; los parámetros no.

Lo que México carece es una base de datos centralizada y anonimizada de siniestros equivalente a freMTPL2. Francia tiene una. El Reino Unido tiene una. México no. AMIS (la Asociación Mexicana de Instituciones de Seguros) podría construir esto, con resultados transformadores: un freMTPL2 mexicano que permita a todas las aseguradoras, no solo a las más grandes, construir modelos de pricing basados en datos.

En el lado de modelado, CatBoost y Explainable Boosting Machines (EBMs) extenderían la comparación. Un GLM Tweedie que modele la prima pura directamente (omitiendo la descomposición frecuencia-severidad) es la extensión natural del baseline. Intervalos de confianza bootstrap sobre Gini y deviance convertirían estimaciones puntuales en rangos que reflejan incertidumbre honesta.

## Fundamento académico

Los cuatro papers que sustentan este proyecto:

Noll, Salzmann y Wuthrich (2020) establecieron el benchmark freMTPL2 y mostraron superioridad del GBM para frecuencia de siniestros. Colella y Jones (2023, CAS E-Forum) confirmaron que ningún modelo domina universalmente, validando el enfoque comparativo. MDPI Risks (2024) mostró que un modelo híbrido GLM+ANN supera a todos los modelos individuales, apuntando hacia estrategias de ensamble como el futuro probable del pricing actuarial. Kuo y Lupton (2023, Variance) formalizaron el marco de explicabilidad que hace el pricing con ML regulatoriamente viable.

Los PDFs están disponibles en el repositorio del proyecto bajo `docs/references/`.

## Material de referencia

- <a href="https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing" target="_blank" rel="noopener">Repositorio en GitHub</a>: Pipeline ML completo (GLMs Poisson/Gamma, XGBoost, LightGBM con tuning Optuna y tracking MLflow), análisis SHAP, auditoría de fairness, backend FastAPI y dashboard interactivo Next.js con 4 pestañas.
