---
title: "Simulador de Pensión IMSS: Ley 73, Ley 97 y Fondo Bienestar en una Sola Herramienta"
description: "Aplicación R Shiny que calcula la pensión de retiro bajo los tres regímenes vigentes del IMSS. Implementa la tabla del Artículo 167 para Ley 73, las tasas escalonadas de la reforma DOF 2020 para Ley 97, y el complemento del Fondo de Pensiones para el Bienestar (2024). Con proyección AFORE bajo tres escenarios de rendimiento, análisis de sensibilidad y reporte PDF descargable. 126 tests unitarios, Docker + Cloud Run."
date: "2026-03-16"
category: "proyectos-y-analisis"
lang: "es"
tags: ["R", "Shiny", "IMSS", "AFORE", "Pensiones", "Ley 73", "Ley 97", "Fondo Bienestar", "seguridad social", "CONSAR"]
---

Desde julio de 1997, México tiene dos sistemas de pensiones del IMSS corriendo en paralelo. Los trabajadores que empezaron a cotizar antes de esa fecha se pensionan bajo Ley 73, con una fórmula de beneficio definido que depende de su salario y semanas cotizadas. Los que empezaron después caen en Ley 97, con cuentas individuales en AFORE cuyo saldo acumulado determina la pensión. En mayo de 2024, el gobierno publicó en el DOF el decreto del Fondo de Pensiones para el Bienestar, una tercera capa que complementa la pensión de trabajadores Ley 97 con ingresos por debajo del salario promedio del IMSS. El resultado es un sistema donde tres conjuntos de reglas coexisten, cada uno con sus propias fórmulas, requisitos de elegibilidad y supuestos. Este simulador calcula los tres en un solo lugar, con las tasas actualizadas a 2025.

## Dos leyes, tres escenarios

La Ley 73 usa una tabla de 23 tramos salariales (Artículo 167 de la LSS) que asigna a cada rango un porcentaje base (cuantía básica) y un incremento por cada año cotizado después de 500 semanas. Un trabajador con salario de 1.77 veces el mínimo y 1,500 semanas tiene 19 años de incrementos sobre la base, lo que produce un porcentaje total de ~73%. Si se retira a los 65, recibe el 100% de ese cálculo; a los 60, solo el 75% (factor de cesantía). La pensión mínima es un salario mínimo mensual ($8,474 en 2025). El mecanismo es determinista: mismos insumos, mismo resultado.

La Ley 97 funciona con otra lógica. El trabajador y su patrón aportan cada mes a una cuenta AFORE, y el saldo crece con el rendimiento real menos la comisión de la administradora. Al retirarse, la pensión sale de dividir el saldo acumulado entre los meses de esperanza de vida (retiro programado). El resultado depende críticamente de tres variables que nadie puede predecir con certeza: el rendimiento real de la AFORE, la densidad de cotización (qué porcentaje de los meses realmente cotizaste), y la comisión de la administradora. Si el saldo proyectado produce una pensión inferior a 2.5 UMAs mensuales ($8,598 en 2025), el gobierno garantiza ese mínimo.

El Fondo Bienestar entra como complemento para trabajadores Ley 97 que cumplen cuatro condiciones: régimen Ley 97, edad mínima de 65 años, al menos 1,000 semanas cotizadas, y salario por debajo del umbral del Fondo (~$17,364/mes en 2025, indexado al salario promedio IMSS). Para los elegibles, el Fondo cubre la diferencia entre la pensión AFORE y el 100% de su último salario, con tope en el umbral.

## La reforma que cambia las cuentas

La reforma DOF de diciembre 2020 incrementó las aportaciones patronales al seguro de retiro de manera gradual entre 2023 y 2030. El cambio más relevante es que las tasas CEAV (Cesantía en Edad Avanzada y Vejez) del patrón ya no son un porcentaje plano: están escalonadas en 8 tramos según el salario del trabajador medido en UMAs. Para el tramo más alto (4.01+ UMAs, salarios arriba de ~$13,600/mes), la tasa patronal de CEAV sube de 4.241% en 2023 a 11.875% en 2030. La tasa del trabajador (1.125%) y el retiro patronal (2%) no cambian.

Este escalonamiento tiene una implicación directa en la proyección de saldos AFORE: usar una tasa plana de aportación para toda la proyección subestima el saldo final entre 15% y 25%, dependiendo del tramo salarial y los años restantes hasta el retiro. El simulador aplica la tasa correcta para cada año de la proyección usando los datos del DOF, con las 8 tablas de transición de 2023 a 2030, y la tasa final de 2030 para años posteriores.

La misma reforma cambió las semanas mínimas para pensionarse bajo Ley 97: de 750 en 2021, incrementando 25 semanas cada año, hasta llegar a 1,000 en 2031. Para 2025, el requisito es 850 semanas. Este calendario de transición es independiente de las 1,000 semanas que exige el Fondo Bienestar.

## El Fondo de Pensiones para el Bienestar

El decreto del 1 de mayo de 2024 creó el Fondo como respuesta a un problema concreto: las proyecciones de tasa de reemplazo para trabajadores Ley 97 son bajas, típicamente entre 20% y 40% del último salario para quienes no hacen aportaciones voluntarias. El Fondo busca cerrar esa brecha para trabajadores de ingresos medios y bajos.

La fórmula es directa: complemento = mín(salario, umbral) - pensión AFORE. Si tu pensión AFORE es de $5,000 y tu salario era de $12,000, el complemento es $7,000, para una pensión total de $12,000 (100% de reemplazo). Si tu salario superaba el umbral, el complemento se calcula con el umbral como tope.

Hay que ser transparentes sobre los riesgos de este esquema. El Fondo se financia del presupuesto federal, sin un impuesto dedicado ni reserva constituida. Su viabilidad fiscal a 20 o 30 años depende de decisiones políticas futuras que nadie puede garantizar. El simulador presenta el Fondo como un escenario posible, con avisos explícitos de que se trata de una proyección bajo supuestos actuales, y que las condiciones pueden cambiar. Tratar el complemento como un hecho consumado sería irresponsable; presentarlo como un escenario educativo es lo correcto.

## Qué revelan los números

Para un trabajador Ley 73 con salario de $15,000/mes y 1,500 semanas cotizadas, el simulador calcula una pensión de $11,245/mes (75% de reemplazo) a los 65 años. Con Modalidad 40 (5 años cotizando al máximo SBC), la pensión sube a $17,694, con un costo de $6,939/mes y un periodo de recuperación de 14 meses. El mecanismo es predecible: mismos datos, mismo resultado, sin variabilidad por rendimientos de mercado.

Para un trabajador Ley 97 con el mismo salario, $300,000 de saldo actual en AFORE, 800 semanas y rendimiento base de 4% real, el saldo proyectado a los 65 años es de $1,624,910. El retiro programado produce $7,965/mes (saldo entre 204 meses de esperanza de vida masculina). Ese monto queda por debajo de la pensión mínima garantizada de $8,598/mes (2.5 UMAs mensuales), así que el piso legal aplica. Con el Fondo Bienestar, la pensión sube a $15,000/mes: el complemento de $6,401 cubre la diferencia entre el mínimo garantizado y el salario completo.

El efecto de género es cuantificable. Una mujer con salario de $12,000/mes, $150,000 de saldo y 600 semanas proyecta un saldo de $1,011,005 a los 65 años. Pero como la esperanza de vida femenina es mayor (240 meses vs. 204 para hombres), el retiro programado baja a $4,212/mes para el mismo tipo de cálculo. El Fondo Bienestar complementa hasta los $12,000 de salario, pero sin el Fondo, la diferencia de género en la pensión es de casi 50% con el mismo saldo.

El análisis de sensibilidad entre escenarios conservador (3%), base (4%) y optimista (5%) produce un rango de 30-40% en el saldo proyectado. Pero la variable que más mueve el resultado para Ley 97 es la reforma de contribuciones, que casi triplica las tasas CEAV patronales entre 2023 y 2030. El factor de cesantía funciona como se espera: a los 62 años, la pensión Ley 73 es el 85% de la calculada a los 65 ($10,588 vs. ~$12,456 implícitos a factor 100%).

Un hallazgo de la validación: el simulador originalmente no rechazaba semanas por debajo de 500 para Ley 73. Con 300 semanas, producía un cálculo que caía al piso mínimo ($8,485), cuando en realidad un trabajador con menos de 500 semanas no tiene derecho a pensión bajo Ley 73, solo a devolución de recursos. Este tipo de detección es exactamente para lo que sirve un pipeline de CI/CD con 126 tests: el bug se identificó, se corrigió y se desplegó en el mismo ciclo. Hoy la validación ya está en producción.

## Decisiones de ingeniería

La arquitectura separa el cálculo de la presentación. Las fórmulas viven en `R/calculations.R` (777 líneas) para Ley 73/97 y `R/fondo_bienestar.R` (505 líneas) para el complemento, sin dependencia alguna de Shiny. Los módulos se pueden ejecutar y testear desde la terminal con `testthat`, lo que permitió mantener 126 tests unitarios que verifican la tabla del Artículo 167, los factores de cesantía, la proyección AFORE con tasas variables, el cálculo del complemento del Fondo, y los casos borde (semanas insuficientes, salario sobre tope, rendimiento cero).

Las constantes regulatorias (UMA 2025: $113.14 diaria, salario mínimo: $278.80, umbral del Fondo: $17,364) están centralizadas en `R/constants.R`, fuera de cualquier contexto Shiny, de modo que un cambio de año fiscal requiere actualizar un solo archivo. Las tasas de reforma DOF 2020 se leen de un CSV con los 8 tramos y las columnas 2023-2030, no están hardcodeadas.

La interfaz es un wizard de 4 pasos construido con `bslib` (Bootstrap 5 para R Shiny) y navegación controlada por `shinyjs`. Los gráficos de trayectoria de saldo usan Plotly para interactividad. El usuario puede descargar un reporte PDF generado con `rmarkdown` que incluye todos los supuestos y resultados del cálculo. El deployment es Docker sobre Google Cloud Run con CI/CD vía GitHub Actions y Workload Identity Federation.

## Lo que aprendí

La variable que más mueve el resultado para un trabajador Ley 97 es el calendario de contribuciones de la reforma 2020, por encima del rendimiento o la comisión de la AFORE. La razón es que las tasas CEAV prácticamente se triplican entre 2023 y 2030 para los tramos salariales altos, y ese incremento se acumula compuestamente por el resto de la vida laboral.

La extrapolación del umbral del Fondo Bienestar es una decisión de modelado, no un cálculo. El umbral de 2025 ($17,364) es el salario promedio IMSS publicado; para años futuros, el simulador asume un crecimiento de 3.5% anual, calibrado con la tendencia observada. Cualquier otra tasa de crecimiento produce resultados significativamente diferentes. El simulador lo documenta como un supuesto, porque eso es lo que es.

Un detalle que conecta con otros proyectos del portafolio: la pensión por retiro programado de Ley 97 divide el saldo entre la esperanza de vida restante. Esa esperanza de vida viene de tablas simplificadas de CONAPO (17 años para hombres a los 65, 20 para mujeres). En un contexto actuarial más riguroso, esas tablas se proyectarían con modelos de mortalidad para capturar la mejora secular en longevidad, algo que modificaría las pensiones resultantes.

La aplicación está desplegada en <a href="https://simulador-pension-d3qj5vwxtq-uc.a.run.app/" target="_blank" rel="noopener">Google Cloud Run</a> y el código fuente está en <a href="https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar" target="_blank" rel="noopener">GitHub</a>.
