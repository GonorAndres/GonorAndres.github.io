# Future Portfolio Projects

## 1. Dashboard Interactivo TIIE/CETES

**Objetivo:** Visualizador en tiempo real de tasas de referencia del mercado mexicano.

**Alcance:**
- Consumir la API publica de Banxico (SIE) para obtener series historicas de TIIE, CETES, tipo de cambio
- Graficas interactivas con zoom, filtros por periodo y comparacion entre instrumentos
- Calculos derivados: spreads, volatilidad rolling, correlaciones entre tasas
- Contexto editorial breve por periodo (crisis, decisiones de politica monetaria)

**Stack:** React island en Astro, D3.js o Recharts para graficas, fetch directo a API Banxico (sin backend)

**Valor diferenciador:** Demuestra conocimiento del mercado financiero mexicano, manejo de APIs publicas y capacidad de construir herramientas utiles para el sector. Ningun candidato actuarial junior tiene esto en su portafolio.

**Categoria blog:** mercado-mexicano

---

## 2. Visualizador de Tablas de Mortalidad y Analisis de Supervivencia

**Objetivo:** Herramienta interactiva para explorar tablas de mortalidad mexicanas y curvas de supervivencia.

**Alcance:**
- Cargar datos de CONAPO o INEGI (tablas de mortalidad por sexo, entidad, periodo)
- Visualizar qx, lx, ex interactivamente con sliders por edad y filtros por poblacion
- Comparar curvas de supervivencia entre entidades o periodos
- Implementar Kaplan-Meier basico con datos de ejemplo
- Explicar conceptos actuariales (fuerza de mortalidad, esperanza de vida, ley de Gompertz) de forma accesible

**Stack:** React island en Astro, SVG/Canvas para graficas, datos pre-procesados en JSON desde archivos CONAPO

**Valor diferenciador:** Conecta directamente la formacion actuarial con habilidades de visualizacion de datos. Es el proyecto que mas claramente dice "soy actuario Y se programar". No existe nada similar en portafolios actuariales en Mexico.

**Categoria blog:** actuaria-para-todos

---

## 3. Blog Post: Resumen No Tecnico del Articulo de Investigacion

**Objetivo:** Articulo de blog que explique en lenguaje accesible el tema del paper en proceso de publicacion del internship de data science.

**Alcance:**
- Contexto del problema: por que importa, quien se beneficia
- Metodologia simplificada: que tecnicas se usaron y por que, sin formulas densas
- Resultados clave y que significan en la practica
- Reflexion personal sobre el proceso de investigacion
- Link al paper cuando se publique

**Stack:** Markdown en content collection del blog, posiblemente con graficas estaticas o diagramas SVG

**Valor diferenciador:** Demuestra capacidad de comunicar investigacion a audiencia amplia. Los reclutadores ven que puedes ir mas alla del codigo y explicar el "por que". Tambien valida la experiencia del internship con evidencia tangible.

**Categoria blog:** proyectos-y-analisis

---

## 4. Blog Post: Metodologia de Tarificacion del GMM Explorer

**Objetivo:** Desglose tecnico-accesible del modelo de tarificacion de Gastos Medicos Mayores implementado en gmm-explorer.vercel.app.

**Alcance:**
- Explicar la estructura de tarificacion: frecuencia x severidad x factor de edad
- Visualizar como cambia la prima por edad (el factor 7.4x entre 25 y 70 anios)
- Detallar las fuentes de datos: 95.9M asegurados-anio, 5.1M siniestros (2020-2024)
- Contexto regulatorio: que exige la CNSF y como el modelo lo cumple
- Comparar con enfoques alternativos de pricing

**Stack:** Markdown con posibles componentes React embebidos para graficas interactivas de factores de edad

**Valor diferenciador:** Transforma un proyecto academico en contenido de referencia. Si alguien busca "tarificacion GMM Mexico" y encuentra tu blog, eso es posicionamiento profesional real. Tambien refuerza la narrativa del CV: "construyo herramientas Y explico la teoria detras".

**Categoria blog:** actuaria-para-todos

---

## 5. SIMA - Sistema Integral de Modelacion Actuarial (Web Platform)

**Objetivo:** Desplegar la plataforma web de SIMA como aplicacion interactiva, integrando el motor de calculo actuarial ya construido (Phase 2 completa) con un frontend profesional.

**Alcance:**
- Construir API con FastAPI sobre los 6 modulos existentes del engine (life tables, commutation, actuarial values, premiums, reserves, mortality data)
- Frontend interactivo: el usuario selecciona pais, periodo, sexo, edad de entrada, tipo de producto (vida entera, temporal, dotal) y obtiene primas, reservas y trayectorias
- Visualizar curvas de reserva, tablas de mortalidad procesadas, funciones de conmutacion
- Escenarios de sensibilidad: choques de tasa de interes y mortalidad sobre las reservas
- Documentar la alineacion regulatoria (LISF Art. 217, CUSF 7.3-7.6, EMSSA-2009)
- Desplegar en Vercel o Railway, linkear desde el portafolio

**Stack:** FastAPI (backend), React island o app standalone, Recharts/D3 para graficas, datos HMD pre-cargados

**Estado actual:** Phase 2 completa (6 modulos, 38 tests passing, backward recursion optimizada). Falta Phase 1 (Lee-Carter), Phase 3 (capital SCR) y Phase 4 (web).

**Valor diferenciador:** Ningun actuario junior en Mexico tiene un sistema de valuacion de reservas funcional, con tests, alineado a regulacion y desplegado como web app. Esto es el proyecto que cierra la narrativa completa: teoria actuarial + ingenieria de software + regulacion mexicana.

**Categoria blog:** actuaria-para-todos / proyectos-y-analisis

---

## Orden de prioridad sugerido

1. **Post del articulo de investigacion** (3) -- requiere menos desarrollo tecnico, alto impacto en CV
2. **Post de metodologia GMM** (4) -- el contenido ya existe en tu cabeza, solo hay que escribirlo
3. **SIMA web platform** (5) -- Phase 2 ya esta lista, el frontend es el paso natural siguiente
4. **Dashboard TIIE/CETES** (1) -- proyecto tecnico con datos reales, buena complejidad
5. **Visualizador de mortalidad** (2) -- proyecto independiente de SIMA, enfocado en CONAPO/INEGI y Kaplan-Meier interactivo
