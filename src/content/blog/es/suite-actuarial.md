---
title: "Suite Actuarial Mexicana: ciclo operativo completo en una sola librería Python"
description: "Las aseguradoras medianas en México tarifican en Excel, reservan en otro Excel, y alimentan el RCS a mano. Esta librería unifica ese ciclo: EMSSA-09, productos de vida, tres estrategias de reaseguro, reservas con incertidumbre explícita, y cumplimiento regulatorio bajo LISF y CUSF, con 307 pruebas y precisión Decimal en cada cálculo."
date: "2026-03-19"
lastModified: "2026-03-22"
category: "proyectos-y-analisis"
lang: "es"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reservas", "Chain Ladder", "Reaseguro", "Streamlit", "EMSSA-09", "SAT"]
---

En el área técnica de una aseguradora mexicana típica, el ciclo operativo trimestral se fragmenta en hojas de cálculo que no se comunican entre sí. Un actuario tarifica con una tabla EMSSA-09 pegada en Excel, otro calcula reservas con un triángulo separado, un tercero alimenta el formato RCS a mano, y al final alguien intenta cuadrar todo para el reporte que se entrega a la CNSF. Cada trimestre, el mismo ejercicio de reconciliación manual.

La **Suite Actuarial Mexicana** unifica esos flujos en una sola librería Python. Cubre desde la tabla de mortalidad EMSSA-09 hasta el reporte trimestral a la CNSF, pasando por tarificación de productos de vida, tres estrategias de reaseguro, métodos avanzados de reservas y validaciones fiscales del SAT.

<img src="/screenshots/actuarial-suite.png" alt="Dashboard de la Suite Actuarial Mexicana mostrando calculadoras de productos de vida, cumplimiento regulatorio y reservas técnicas" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

## El problema: por qué una suite actuarial en Python

El mercado asegurador mexicano opera bajo la LISF y la CUSF, un marco que impone requisitos que no existen en ninguna otra jurisdicción: tablas de mortalidad propias (EMSSA-09), formatos de reporte trimestrales con estructura definida por la CNSF, cálculo del RCS con parámetros calibrados al mercado mexicano, y reglas de deducibilidad que dependen de la Ley del ISR.

Existe software actuarial de código abierto en Python: `chainladder` para reservas, `lifelines` para análisis de supervivencia. Pero ninguno integra los requisitos regulatorios mexicanos. No hay una librería que sepa lo que es una EMSSA-09, que calcule el RCS conforme a la LISF, o que valide la deducibilidad de primas según el artículo 151 de la LISR. Para aseguradoras medianas y chicas, esa laguna implica hojas de cálculo con fórmulas que nadie revisa, y errores que se descubren en la auditoría.

Dos decisiones de diseño definen la suite. La primera es Pydantic v2 como guardia de dominio: cada dato que entra al sistema se valida antes de tocar una fórmula. Un asegurado con edad negativa o una tasa técnica del 200% simplemente no entran. La segunda es `Decimal` en lugar de `float` en toda la cadena de cálculo. En carteras de miles de pólizas, la diferencia de centavos se acumula; la precisión aritmética no es un lujo académico.

## Productos de vida

Los tres productos heredan de una clase base abstracta que fija la secuencia de cálculo mediante Template Method: validar asegurabilidad, calcular prima neta, aplicar recargos, construir resultado. Cada producto concreto implementa su propia fórmula actuarial.

La **EMSSA-09** es la tabla de mortalidad regulatoria para seguros de vida en México. La suite la carga desde un CSV y la encapsula en un modelo que soporta interpolación para edades intermedias y valida que cada `qx` esté entre 0 y 1. La tarificación sigue el principio de equivalencia: el valor presente actuarial de los beneficios futuros iguala el valor presente de las primas futuras. La tasa técnica es 5.5%, el máximo que la CNSF permite para productos tradicionales.

El **seguro temporal** es riesgo puro: no hay pago si el asegurado sobrevive al plazo. El **ordinario** es vitalicio: el pago está garantizado, solo es cuestión de cuándo. El **dotal** combina protección con ahorro: paga la suma asegurada por muerte o por supervivencia al vencimiento. Un hombre de 35 años con \$1,000,000 MXN de suma asegurada en un temporal a 20 años paga alrededor de \$5,900 anuales con la EMSSA-09 y tasa técnica del 5.5%.

A diferencia de <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a>, que construye su propio modelo de mortalidad desde datos crudos del INEGI vía Lee-Carter, esta suite usa directamente la tabla regulatoria EMSSA-09. Son dos enfoques complementarios: uno construye la demografía desde la fuente, el otro aplica la tabla que el regulador exige en la nota técnica.

## Reaseguro

El reaseguro es el seguro de las aseguradoras. La suite implementa tres estrategias con validación de dominio en cada una.

El **Quota Share** cede un porcentaje fijo de todas las pólizas: primas y siniestros. Simple y predecible, con la desventaja de que cedes la misma proporción de los riesgos rentables y de los no rentables.

El **Excess of Loss** protege contra siniestros individuales grandes. El reasegurador entra solo cuando el siniestro supera la retención de la cedente. Un contrato "500 xs 200" significa que la cedente retiene los primeros \$200,000 y el reasegurador paga el exceso hasta \$500,000 adicionales. La implementación incluye reinstatements: reinstalar el límite después de usarlo pagando una prima adicional. Un `model_validator` verifica que el límite sea mayor que la retención; en hojas de cálculo con celdas editables, esa condición se viola con más frecuencia de la que uno quisiera admitir.

El **Stop Loss** protege la cartera completa. Se activa cuando la siniestralidad total supera un umbral (attachment point). Si los siniestros de una cartera de \$10M de primas alcanzan 90% y el contrato es "80% xs 20%", el reasegurador paga \$1M del exceso.

## Reservas: Chain Ladder, Bornhuetter-Ferguson, Bootstrap

La estimación de IBNR es uno de los problemas centrales de la práctica actuarial en daños. La suite implementa Chain Ladder y Bornhuetter-Ferguson, pero lo que distingue esta implementación es el módulo de Bootstrap.

Chain Ladder produce una estimación puntual. Bornhuetter-Ferguson la complementa ponderando con una expectativa a priori del loss ratio, lo que la hace más estable para años de origen recientes con poco desarrollo. Pero ninguno responde la pregunta más importante: ¿qué tan equivocada puede estar esta estimación?

El Bootstrap responde con una distribución completa. Calcula residuales de Pearson sobre el triángulo original, remuestrea esos residuales para generar 1,000 triángulos sintéticos, ejecuta Chain Ladder en cada uno y obtiene percentiles de la distribución de reservas posibles. Si P50 = \$2.5M y P75 = \$3.1M, hay un 25% de probabilidad de que la reserva necesaria sea al menos \$600,000 mayor que la mediana. Esa diferencia es directamente relevante para la decisión de cuánto capital mantener. El <a href="/blog/insurance-claims-dashboard/" style="color: #C17654; text-decoration: underline;">Insurance Claims Dashboard</a> explora esta mecánica con más detalle desde la perspectiva del análisis de cartera.

## Cumplimiento regulatorio

Esta es la parte que diferencia a la suite de cualquier otro paquete actuarial de código abierto. No existe, hasta donde investigué, ninguna librería pública que implemente el RCS mexicano, las reglas de la Circular S-11.4, o las validaciones fiscales del SAT para primas.

El **RCS** calcula tres módulos de riesgo: suscripción vida (mortalidad, longevidad, invalidez, gastos), suscripción daños (riesgo de prima y reserva) e inversión (mercado, crédito, concentración). La agregación usa una matriz de correlación que evita sumar los riesgos linealmente. La correlación vida-daños es 0.00 porque la mortalidad y los siniestros de autos son estadísticamente independientes. La correlación vida-inversión y daños-inversión es 0.25 porque una crisis financiera afecta la capacidad de cumplir con ambos tipos de obligaciones a través de la cartera. Con RCS vida \$28M, daños \$30M e inversión \$35M, la suma lineal daría \$93M; la agregación con correlaciones da \$75M. Esos \$18M de diferencia son capital que la aseguradora puede invertir en lugar de inmovilizar.

La **Circular S-11.4** define cómo calcular reservas técnicas. El módulo implementa la reserva matemática por el método prospectivo y la reserva de riesgos en curso para seguros de corto plazo, ambas con validador de suficiencia.

Las **validaciones SAT** determinan qué porción de cada prima es deducible para ISR según el tipo de seguro y el régimen fiscal del contribuyente. El `ValidadorPrimasDeducibles` recibe la UMA anual vigente, calcula límites en pesos y devuelve el monto deducible con el fundamento legal exacto: artículo 151 de la LISR para personas físicas, artículo 25 para personas morales.

El <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">asistente de regulación</a> navega la LISF y la CUSF para encontrar las disposiciones relevantes. Esta suite implementa la matemática que esas disposiciones definen. Son herramientas complementarias: una localiza el artículo, la otra ejecuta el cálculo.

## Decisiones de ingeniería

La suite tiene 34 módulos de producción en 7 subpaquetes y 307 pruebas con 87% de cobertura. El flujo de dependencias es unidireccional: `core` no importa de nadie; `products`, `reinsurance`, `reservas` y `regulatorio` importan de `core`; `reportes` importa de `regulatorio`. Sin ciclos, cualquier módulo se puede probar de forma aislada.

Cada modelo Pydantic incluye `json_schema_extra` con ejemplos concretos que funcionan como documentación ejecutable. Los errores de validación están escritos para el actuario, no para el desarrollador: "Recargos totales (115%) superan el 100%" comunica el problema de forma inmediata.

El dashboard Streamlit tiene tres páginas con Plotly: calculadora de productos de vida con análisis de sensibilidad, monitor de cumplimiento regulatorio con calculadoras de RCS y validaciones SAT, y análisis de reservas técnicas con triángulos de desarrollo y comparación de métodos.

## Lo que aprendí

La parte más difícil no fue implementar Chain Ladder ni las fórmulas de vida, que son estándar en cualquier jurisdicción. Lo difícil fue la especificidad regulatoria mexicana: la EMSSA-09 como tabla base, la Circular S-11.4 para reservas técnicas, las reglas de deducibilidad del artículo 151 de la LISR, los formatos de reporte CNSF con sus validaciones de fechas y trimestres. Esos módulos requirieron horas de investigación en circulares y textos de ley, con las menores referencias de implementación disponibles.

La segunda lección tiene que ver con la matriz de correlación del RCS. La fórmula de agregación es álgebra vectorial sencilla. Lo difícil no es implementarla sino entender por qué la CNSF eligió esas correlaciones específicas. Los números codifican la visión del regulador sobre cómo interactuan los riesgos en el mercado mexicano. Implementar la fórmula sin entender la lógica detrás de los parámetros es mecanografía, no ingeniería actuarial. La <a href="/projects/life-insurance" style="color: #C17654; text-decoration: underline;">nota técnica de seguros de vida</a> documenta esa lógica aplicada a productos concretos.

Una limitación real: el dashboard es demostrativo, no operativo. Una aseguradora que quisiera adoptarlo tendría que integrar sus propios datos, validar las tablas y parámetros contra sus notas técnicas aprobadas por la CNSF, y hacer auditoría actuarial de los resultados. La suite resuelve el problema de fragmentación; no resuelve el problema de la integración con sistemas legados.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repositorio:</strong> <a href="https://github.com/GonorAndres/Analisis_Seguros_Mexico" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/Analisis_Seguros_Mexico</a></p>
  <p style="margin: 0;"><strong>Aplicación en vivo:</strong> <a href="https://suite-actuarial-d3qj5vwxtq-uc.a.run.app" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite-actuarial en Cloud Run</a></p>
</div>
