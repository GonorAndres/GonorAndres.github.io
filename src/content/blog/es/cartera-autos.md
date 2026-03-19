---
title: "Plataforma de Siniestralidad Auto: Tarificación GLM, Reservas IBNR y Detección de Fraude en un Solo Dashboard"
description: "Dashboard R Shiny con 140,000 pólizas sintéticas calibradas al mercado mexicano. Motor de tarificación GLM de dos partes (Poisson frecuencia + Gamma severidad), reservas IBNR por Chain Ladder y Bornhuetter-Ferguson, pruebas de estrés Monte Carlo con VaR/TVaR y detección de fraude por distancia de Mahalanobis. 17 módulos, arquitectura bslib, desplegado en Cloud Run."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "es"
tags: ["R", "Shiny", "GLM", "IBNR", "Monte Carlo", "bslib", "CONDUSEF", "AMIS", "fraude", "autos"]
---

En México, cerca del 70% de los vehículos circulan sin seguro. Para las aseguradoras que cubren el 30% restante, la pregunta central es la misma de siempre: cuánto cobrar, cuánto reservar y dónde está el riesgo. Este proyecto construye una plataforma actuarial completa para responder esas tres preguntas con datos sintéticos calibrados a parámetros reales del mercado mexicano.

## Los datos: 140,000 pólizas en cinco años

El dataset cubre el período 2020-2024 con 140,385 pólizas, 11,762 siniestros y 24,900 pagos de desarrollo distribuidos en cinco años de desarrollo (0-4). La generación parte de 12,000 pólizas nuevas por año con una tasa de renovación del 82%, produciendo el crecimiento orgánico que vería una cartera real.

Los parámetros de calibración vienen de fuentes públicas: frecuencia base de 8.5% (CONDUSEF), severidad promedio de \$24,000 MXN (AMIS), loss ratio objetivo de 75% (promedio sectorial AMIS). La distribución de siniestros sigue el patrón típico de autos en México: colisión 65%, daños 20%, robo parcial 10%, robo total 4%, incendio 1%. El patrón de desarrollo usa la cola corta característica de autos: 60% pagado en el año de ocurrencia, 85% al primer desarrollo, 95% al segundo, 99% al tercero, 100% al cuarto.

La cartera cubre 13 estados mexicanos, 18 modelos de 10 marcas (Nissan, Volkswagen, Chevrolet, Toyota, Ford, Honda, Hyundai, Mazda, Kia, Seat) y tres tipos de vehículo. Los KPIs logrados son coherentes con el mercado: loss ratio de 71.1% (objetivo 75%), frecuencia de 8.38% (objetivo 8.5%), severidad de \$29,396 (objetivo \$24,000; la desviación refleja la inflación acumulada al 4% anual sobre cinco años).

## Motor de tarificación GLM

El pricing usa un modelo de dos partes que es el estándar de la industria para autos. La primera parte modela la frecuencia con un GLM Poisson (liga log) donde la variable respuesta es el conteo de siniestros por póliza con exposición como offset. La segunda parte modela la severidad con un GLM Gamma (liga log) sobre los montos individuales de siniestros.

Los predictores incluyen edad del conductor (cuatro tramos: menores de 25, 25-35, 35-50, 50+), género, tipo de vehículo, zona geográfica de riesgo (alta, media, baja), canal de venta y segmento de score crediticio. Los factores de riesgo capturan patrones conocidos del mercado mexicano: conductores menores de 25 con 1.35x de recargo, SUVs con 1.15x, zonas de alto riesgo como CDMX y Estado de México con 1.30x.

El módulo incluye un cotizador interactivo que calcula la prima pura en tiempo real según el perfil del asegurado, tablas de relatividades por factor, descomposición waterfall de la prima, y diagnósticos del modelo (residuales, Q-Q plots, observado vs predicho por factor).

## Reservas IBNR

Las reservas se estiman con dos metodologías: Chain Ladder y Bornhuetter-Ferguson. La implementación de Chain Ladder calcula link ratios ponderados por volumen, factores de desarrollo acumulados (CDFs) hasta el ultimado, y error estándar de Mack. El IBNR resulta de la diferencia entre el ultimado proyectado y lo pagado hasta la fecha.

Bornhuetter-Ferguson mezcla la proyección de Chain Ladder con una expectativa a priori del loss ratio (75% por defecto, ajustable entre 60% y 90%). El método es más estable para años de accidente inmaduros, donde los link ratios de Chain Ladder pueden ser volátiles por el bajo volumen de datos.

La interfaz muestra el triángulo de desarrollo (incremental y acumulado), la tabla de link ratios, los CDFs, y una comparación de IBNR por año de accidente entre ambos métodos. Esto conecta directamente con SIMA, donde las reservas son para seguros de vida: Chain Ladder y Bornhuetter-Ferguson son idénticos en la mecánica, pero la cola de desarrollo es radicalmente distinta. En autos, cuatro años de desarrollo son suficientes; en vida, los pagos pueden extenderse décadas.

## Pruebas de estrés Monte Carlo

El módulo de escenarios implementa un modelo de riesgo colectivo donde la frecuencia agregada sigue una Poisson y la severidad individual una Gamma. La simulación genera de 1,000 a 50,000 realizaciones de la pérdida agregada, aplicando multiplicadores de estrés tanto a la frecuencia (0.5x a 2.0x) como a la severidad (0.5x a 2.0x).

Las medidas de riesgo calculadas incluyen VaR al 95%, 99% y 99.5%, TVaR a los mismos niveles, media y desviación estándar. La salida visual compara la densidad de pérdidas baseline contra el escenario estresado, con curva de excedencia y tabla de impacto. El TVaR es particularmente relevante para la regulación mexicana, donde la CNSF lo usa como medida de riesgo para el cálculo de RCS.

## Detección de fraude

El módulo de fraude combina dos enfoques. El primero es detección de anomalías por distancia de Mahalanobis, estratificada por tipo de siniestro, sobre tres variables: monto del siniestro, días al reporte y deducible. La distancia se convierte a percentil para facilitar la comparación global, usando una matriz de covarianza regularizada para manejar matrices singulares.

El segundo es un sistema de banderas heurísticas con cinco reglas: múltiples siniestros en la misma póliza en 60 días, siniestro dentro de 30 días del inicio de la póliza, monto superior a 3x la mediana del tipo, retraso de reporte mayor a 10 días, y monto superior al 90% de la suma asegurada. El score compuesto pondera 40% Mahalanobis y 60% banderas, con umbral de 0.7 para flaggeo.

## Decisiones de ingeniería

La aplicación tiene 17 módulos R organizados en tres capas: 13 módulos de interfaz (uno por pestaña), 4 módulos de utilidades (métricas, tema, datos, exportación). La arquitectura usa bslib con Bootstrap 5 para responsividad. Los gráficos usan Plotly para interactividad, las tablas DT para filtrado y ordenamiento.

La separación entre cálculo y presentación es estricta: las funciones actuariales viven en los módulos de utilidades, sin dependencia de Shiny, lo que permite testing aislado. El deployment es Docker sobre Google Cloud Run con CI/CD vía GitHub Actions y autenticación por Workload Identity Federation, el mismo patrón que uso en el simulador de pensiones y en SIMA.

## Lo que aprendí

La variable que más afecta la tarificación en autos mexicanos es la zona geográfica, por encima de la edad del conductor o el tipo de vehículo. CDMX y Estado de México concentran la mayor frecuencia y severidad, lo que hace sentido con los datos de robos de AMIS.

La diferencia práctica entre Chain Ladder y Bornhuetter-Ferguson aparece en los años inmaduros: Chain Ladder amplifica la volatilidad de los primeros link ratios, mientras que BF la suaviza con la expectativa a priori. Para una cartera de autos con desarrollo corto, la diferencia es menor que en ramos de cola larga como responsabilidad civil.

Una limitación importante: los datos son sintéticos. Los patrones de correlación entre variables (por ejemplo, zona geográfica y tipo de vehículo) están definidos en la generación, no descubiertos en datos reales. Con datos de AMIS o CONDUSEF, los GLMs capturarían interacciones que aquí no existen. El siguiente paso sería calibrar con datos públicos de la CONDUSEF o construir un convenio de datos con una aseguradora.

La aplicación está desplegada en <a href="https://cartera-autos-451451662791.us-central1.run.app" target="_blank" rel="noopener">Google Cloud Run</a> y el código fuente está en <a href="https://github.com/GonorAndres/CarteraSeguroAutos" target="_blank" rel="noopener">GitHub</a>.
