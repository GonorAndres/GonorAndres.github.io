---
title: "Suite Actuarial Mexicana: cuatro ramos de seguros en una sola librería Python"
description: "El ciclo operativo de una aseguradora mexicana se fragmenta entre hojas de cálculo que no se comunican. Esta librería unifica tarificación, reservas, reaseguro y cumplimiento regulatorio para vida, daños, salud y pensiones bajo un mismo marco con validación de dominio Pydantic y precisión Decimal. El resultado es una base modular que permite construir sistemas actuariales más complejos sin reescribir la lógica desde cero."
date: "2026-03-19"
lastModified: "2026-03-22"
category: "proyectos-y-analisis"
lang: "es"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reservas", "Chain Ladder", "Reaseguro", "Streamlit", "EMSSA-09", "SAT", "FastAPI", "GMM", "IMSS"]
---

En el área técnica de una aseguradora mexicana típica, el ciclo operativo trimestral se fragmenta en hojas de cálculo que no se comunican entre sí. Un actuario tarifica con una tabla EMSSA-09 pegada en Excel, otro calcula reservas con un triángulo de desarrollo separado, un tercero alimenta el formato RCS a mano, y al final alguien intenta cuadrar todo para el reporte que se entrega a la CNSF. Cada trimestre, el mismo ejercicio de reconciliación manual.

La **Suite Actuarial Mexicana** unifica esos flujos en una sola librería Python. Cubre cuatro ramos del mercado asegurador mexicano (vida, daños, salud y pensiones), con módulos transversales de reaseguro, reservas y cumplimiento regulatorio. Cada dato que entra al sistema se valida con Pydantic v2 antes de tocar una fórmula, y toda la cadena de cálculo usa `Decimal` en lugar de `float` para que las diferencias de centavos no se acumulen sobre carteras de miles de pólizas.

<img src="/screenshots/actuarial-suite.png" alt="Ejemplos interactivos de la Suite Actuarial Mexicana mostrando calculadoras de productos de vida, cumplimiento regulatorio y reservas técnicas" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

## El problema

El mercado asegurador mexicano opera bajo la LISF y la CUSF, un marco que impone requisitos que no existen en ninguna otra jurisdicción: tablas de mortalidad propias (EMSSA-09), formatos de reporte trimestrales con estructura definida por la CNSF, cálculo del RCS con parámetros calibrados al mercado mexicano, y reglas de deducibilidad fiscal que dependen de la Ley del ISR. Existe software actuarial de código abierto en Python (`chainladder`, `lifelines`), pero ninguno integra los requisitos regulatorios mexicanos. No hay una librería que sepa lo que es una EMSSA-09 o que calcule el RCS conforme a la LISF.

## Los cuatro dominios

### Vida

Tres productos (temporal, ordinario y dotal) construidos sobre la tabla EMSSA-09 con tarificación bajo el principio de equivalencia y tasa técnica del 5.5%. Cada producto hereda de una clase base que fija la secuencia de cálculo: validar asegurabilidad, calcular prima neta, aplicar recargos, construir resultado. Un hombre de 35 años con \$1,000,000 MXN de suma asegurada en un temporal a 20 años paga alrededor de \$5,900 anuales.

### Daños

Tarificación de autos calibrada con datos de la AMIS: frecuencia base, severidad promedio, loss ratio objetivo. El módulo incluye modelos de frecuencia-severidad y un sistema Bonus-Malus que ajusta la prima según el historial de siniestralidad del conductor.

### Salud

Gastos Médicos Mayores con tarificación por bandas de edad, cobertura de accidentes y enfermedades, y ajustes por deducible y coaseguro. El módulo refleja la estructura de los productos GMM que se comercializan en el mercado mexicano.

### Pensiones

Cálculo de pensiones bajo Ley 73 y Ley 97 del IMSS, rentas vitalicias y funciones de conmutación. Este módulo comparte la lógica actuarial con el <a href="/blog/pension-simulator/" style="color: #C17654; text-decoration: underline;">simulador de pensión</a>, pero integrado como parte de una librería que puede conectarse con los demás dominios.

## Módulos transversales

**Reaseguro.** Tres estrategias con validación de dominio: Quota Share (cesión proporcional), Excess of Loss (protección contra siniestros grandes, con reinstatements) y Stop Loss (protección agregada de cartera). Un `model_validator` verifica que el límite sea mayor que la retención; en hojas de cálculo, esa condición se viola con más frecuencia de la que uno quisiera admitir.

**Reservas.** Chain Ladder, Bornhuetter-Ferguson y Bootstrap. Lo que distingue esta implementación es que el Bootstrap responde con una distribución completa de reservas posibles, no solo una estimación puntual. Si P50 = \$2.5M y P75 = \$3.1M, hay un 25% de probabilidad de que la reserva necesaria sea al menos \$600,000 mayor que la mediana. Esa diferencia es directamente relevante para la decisión de cuánto capital mantener.

**Cumplimiento regulatorio.** El RCS calcula tres módulos de riesgo (vida, daños, inversión) y los agrega con una matriz de correlación que evita sumar linealmente. Las validaciones SAT determinan qué porción de cada prima es deducible para ISR. La Circular S-11.4 define las reservas técnicas. Ninguna otra librería pública implementa estos cálculos para el mercado mexicano.

## La API

Además de los ejemplos interactivos en Streamlit, la suite expone toda su funcionalidad como API REST vía FastAPI. Esto permite integrar los cálculos actuariales en otros sistemas sin depender de la interfaz visual: un sistema de cotización puede llamar al endpoint de tarificación, un proceso batch puede calcular reservas para toda la cartera, o un pipeline de datos puede ejecutar validaciones regulatorias como parte de un flujo automatizado.

## Lo que hace posible

La consecuencia más importante de tener esta suite no es la suite en sí, sino lo que permite construir encima. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a>, por ejemplo, construye su pipeline de mortalidad desde datos crudos del INEGI vía Lee-Carter, implementando su propia lógica de conmutación y tarificación. Con la suite como módulo, ese mismo pipeline podría reescribirse con código más limpio y más corto, reutilizando las funciones de conmutación, los productos de vida y el cálculo de RCS que ya están validados y probados. En lugar de reimplementar, importas.

Lo mismo aplica para cualquier proyecto actuarial nuevo: la suite elimina la necesidad de reescribir la lógica base cada vez. Un proyecto de tarificación de salud puede importar el módulo GMM y enfocarse en el análisis, no en la infraestructura. Un modelo de solvencia puede usar el módulo de RCS directamente. El <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">asistente de regulación</a> navega la LISF y la CUSF para encontrar las disposiciones; esta suite implementa la matemática que esas disposiciones definen.

La librería tiene cientos de pruebas unitarias cubriendo los cuatro dominios, con precisión Decimal en cada cálculo y validación Pydantic en cada entrada. El flujo de dependencias es unidireccional y sin ciclos, lo que permite probar cualquier módulo de forma aislada.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repositorio:</strong> <a href="https://github.com/GonorAndres/Analisis_Seguros_Mexico" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/Analisis_Seguros_Mexico</a></p>
  <p style="margin: 0;"><strong>Aplicación en vivo:</strong> <a href="https://suite-actuarial-d3qj5vwxtq-uc.a.run.app" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite-actuarial en Cloud Run</a></p>
</div>
