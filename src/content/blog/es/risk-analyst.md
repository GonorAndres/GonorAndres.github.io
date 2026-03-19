---
title: "Risk Analyst: 13 Proyectos de Análisis Cuantitativo de Riesgos Financieros"
description: "Desde VaR y simulación Monte Carlo hasta deep hedging y redes neuronales en grafos para riesgo sistémico. Un currículum completo de riesgo financiero ejercicios de prueba y documentación."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "es"
tags: ["Python", "Riesgo Financiero", "VaR", "Monte Carlo", "Machine Learning", "Deep Hedging", "Copulas", "EVT"]
---

¿Cómo pasas de un número de VaR en una hoja de cálculo a un sistema en el que una mesa de riesgos realmente confía? Lo construyes tú mismo, pieza por pieza. Este proyecto son 13 módulos que avanzan desde los fundamentos (VaR de portafolio, motores Monte Carlo) a herramientas de grado regulatorio (pruebas de estrés, riesgo de cola con EVT) hasta territorio de investigación (deep hedging, redes neuronales en grafos para contagio sistémico, una innovación no trivial en el campo). Cada módulo combina teoría en LaTeX con Python tipado, tests automatizados y resultados reproducibles. Son ejercicios modelados con información pública; alguien con experiencia real en el medio encontrará margen de mejora sustancial, y ese es precisamente el punto de partida.

## Las tres capas

Los tres niveles reflejan cómo se acumula realmente el conocimiento en riesgos. Empiezas con las herramientas que todos necesitan (VaR, Monte Carlo, scoring crediticio, GARCH). Luego enfrentas los problemas que la regulación y la gestión de portafolios te ponen enfrente (colas extremas, dependencia por cópulas, escenarios de estrés). Después llegas a la frontera, donde el machine learning se encuentra con preguntas abiertas.

### Tier 1: Fundamentos (P01 a P04)

**P01. Portfolio Risk Dashboard.** Tres formas de calcular VaR (histórico, paramétrico, Monte Carlo), tres formas de saber cuándo falla (Kupiec, Christoffersen, semáforo de Basilea). El dashboard muestra VaR y CVaR rolling a múltiples niveles de confianza; lo interesante es el backtesting rolling, que detecta exactamente cuándo el modelo empieza a subestimar pérdidas. Cada prueba verifica una propiedad matemática, no solo que el código corra: el CVaR debe exceder al VaR, ambos deben crecer con el nivel de confianza, el Monte Carlo debe converger al analítico bajo normalidad.

**P02. Monte Carlo Simulation Engine.** Movimiento browniano geométrico correlacionado vía Cholesky, con tres técnicas de reducción de varianza para que las simulaciones converjan en tiempo razonable. Las antitéticas reducen varianza un 60%; las variables de control la reducen un 85%. El motor replica precios de opciones europeas contra Black-Scholes con error menor al 1% en 100,000 trayectorias.

**P03. Credit Scoring con ML.** Regresión logística, XGBoost y LightGBM sobre el mismo dataset de crédito. Selección de features con Weight of Evidence e Information Value; calibración con Platt scaling e isotónica; explicabilidad con SHAP. AUC arriba de 0.85. Las pruebas de calibración son las que más importan: verifican que cuando el modelo dice "5% de probabilidad de default," aproximadamente 5% de esos acreditados realmente incumplen.

**P04. Volatility Modeling.** La familia GARCH completa (GARCH(1,1), GJR-GARCH, EGARCH, APARCH), HAR-RV para volatilidad realizada y Markov switching para detección de regímenes. El modelo de Markov es el más revelador: identifica transiciones entre regímenes de calma y turbulencia con probabilidades filtradas, produciendo un VaR condicional que sabe si el mercado está en crisis o no.

### Tier 2: Intermedio a Avanzado (P05 a P07)

**P05. EVT para Riesgo de Cola.** Teoría de valores extremos a través de dos lentes: block maxima (GEV) y peaks-over-threshold (GPD), con selección automática de umbral vía mean residual life plots. El resultado clave es aleccionador: el VaR al 99.9% bajo GPD resulta entre 40 y 60% mayor que el gaussiano. Las colas de los retornos financieros son más pesadas de lo que la normal predice, y la brecha se amplía precisamente en los niveles de confianza que preocupan a los reguladores.

**P06. Copula Dependency Modeling.** Cinco familias de cópulas (Gaussiana, t, Clayton, Gumbel, Frank) ajustadas sobre marginales filtradas con GARCH. La cópula t cuenta la historia que preocupa a los reguladores: cuando los mercados caen, los activos se correlacionan más de lo que sugiere la correlación lineal. El VaR del portafolio bajo cópula t resulta entre 15 y 25% mayor que bajo la Gaussiana, lo que significa que cualquier modelo de riesgo basado en correlación lineal es sistemáticamente optimista sobre la diversificación.

**P07. Stress Testing Framework.** Escenarios tipo DFAST/CCAR (base, adverso, severo) transmitidos al portafolio vía regresión factorial. El módulo de reverse stress testing invierte la pregunta habitual: en lugar de preguntar "¿qué pasa si el PIB cae 5%?", pregunta "¿qué combinación macro produce una pérdida inaceptable?" Esa inversión suele ser más útil para los comités de riesgos.

### Tier 3: Frontera (P08 a P13)

**P08. Deep Hedging.** Redes neuronales que aprenden estrategias de cobertura desde cero, incluyendo costos de transacción, sin asumir ningún modelo de mercado particular. Cuando los costos de transacción son significativos, las estrategias aprendidas superan al delta hedging clásico porque internalizan el costo de rebalancear en lugar de ignorarlo.

**P09. CVA Counterparty Risk.** Ajuste de valoración crediticia desde primeros principios: bootstrapping de hazard rates desde spreads de CDS, simulación de perfiles de exposición (EE, PFE), y modelado de wrong-way risk, el escenario donde tu exposición a una contraparte aumenta precisamente cuando esa contraparte tiene más probabilidad de default.

**P10. GNN Credit Contagion.** Redes neuronales en grafos sobre redes interbancarias, modelando cómo la quiebra de un banco se propaga por el sistema. DebtRank cuantifica la importancia sistémica de cada nodo; el GNN predice qué nodos son más vulnerables al contagio antes de que ocurra. Las métricas de riesgo sistémico (CoVaR, SRISK) se calculan directamente desde la topología del grafo.

**P11. Conformal Risk Prediction.** Predicción conformal aplicada a bandas de VaR y ES. La garantía es notable: cobertura nominal sin importar la distribución subyacente, sin supuestos paramétricos. Los intervalos se adaptan automáticamente al régimen de volatilidad.

**P12. Climate Risk Scenarios.** Escenarios NGFS (Net Zero, Delayed Transition, Current Policies) traducidos a impacto sobre portafolio: Climate VaR, exposición a activos varados, WACI. Los índices de sensibilidad de Sobol revelan qué supuestos climáticos realmente dominan la incertidumbre, una pregunta que la mayoría de los reportes de riesgo climático deja sin responder.

**P13. RL for Portfolio Risk.** Agentes de reinforcement learning (PPO, SAC) que optimizan rendimiento ajustado por riesgo bajo restricción de CVaR. El agente aprende cuándo rebalancear y en qué proporción, reduciendo el drawdown máximo entre 30 y 40% respecto a equal-weight sin sacrificar rendimiento esperado.

## Validación

Cada prueba verifica una propiedad matemática, no solo que el código se ejecute. El VaR debe crecer con el nivel de confianza. El CVaR debe exceder al VaR. El Monte Carlo debe converger al analítico. Las probabilidades calibradas deben reflejar las frecuencias observadas. Si una prueba pasa, significa que la implementación respeta la teoría.

Estas son propiedades que en la teoría se dan por hecho, pero una computadora no las tiene en cuenta por sí sola. El programa funciona tan bien como lo programemos: qué tan claras son nuestras instrucciones, qué tan lógicas son las operaciones entre sí. Los tests formalizan esa verificación.

## Stack técnico

El proyecto usa Python exclusivamente, con separación clara entre datos, modelos, medidas de riesgo, simulación y visualización:

- **Riesgo y finanzas:** QuantLib, riskfolio-lib, arch (GARCH), pyextremes (EVT), copulae
- **Machine learning:** scikit-learn, XGBoost, LightGBM, PyTorch, PyTorch Geometric, SHAP
- **Simulación:** motor Monte Carlo propio con reducción de varianza (antitéticas, control variates, importance sampling)
- **Datos:** yfinance, FRED, pandas
- **Documentación:** LaTeX (texlive) para teoría, Jupyter para walkthroughs interactivos

## Conexión con el resto del portafolio

Este proyecto se construye directamente sobre trabajo que ya existe en el portafolio. El <a href="/blog/cartera-autos/">proyecto de cartera de autos</a> usa triángulos de pérdida y reservas para una sola línea de negocio; aquí esas ideas se generalizan a medidas de riesgo de portafolio entre clases de activos. Los proyectos de <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Evaluaci%C3%B3nDerivadosDivisas">derivados</a> y <a href="https://drive.google.com/drive/folders/1Dz54zcTpa9quMFCkgddBN5GWQfy6CIXv">Markowitz</a> introdujeron pricing y optimización a nivel fundamental; P02 (Monte Carlo engine) y P08 (deep hedging) los llevan al estado del arte. El <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model">modelo de crédito</a> empezó como un scoring básico; P03 le agrega SHAP, calibración y WoE/IV, mientras que P10 escala el mismo problema a redes de contagio con GNNs.

El código, los tests y la documentación completa están en <a href="https://github.com/GonorAndres/risk-analyst" target="_blank" rel="noopener">GitHub</a>.
