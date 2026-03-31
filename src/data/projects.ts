import type { Lang } from '../i18n';

export type ProjectCategory = 'actuarial' | 'data-science' | 'data-engineering' | 'quant-finance' | 'applied-math';

export interface Project {
  slug: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  url: string;           // primary link: live app, Drive folder, Colab, or GitHub if no live version
  repo?: string;         // GitHub repo URL — only set when url points to a live deployment
  platform: 'GitHub' | 'Drive' | 'Vercel' | 'Colab' | 'GCP' | 'HuggingFace' | 'Firebase';
  category: ProjectCategory;
  tags: Record<Lang, string[]>;
  variant: 'standard' | 'tall' | 'wide';
  screenshot?: string;
  relatedTo?: string[];
  blogSlug?: string;     // English slug of the blog post for this project (e.g. 'sima', 'actuarial-ml-pricing')
  tier: 1 | 2 | 3 | 4; // internal priority: 1=full package, 2=screenshot+blog, 3=academic, 4=minimal
  status?: 'completed' | 'in-development'; // omit or 'completed' = done; 'in-development' = shows badge
  creation_date: string;           // YYYY-MM-DD — when the project was built/started
  last_modification_date?: string; // YYYY-MM-DD — last significant update (optional)
}

export const projects: Project[] = [
  // repo: https://github.com/GonorAndres/SIMA
  // live: https://sima-d3qj5vwxtq-uc.a.run.app
  // local: /home/andtega349/SIMA
  // source: original work, demographic data from CONAPO/INEGI for mortality projection
  {
    slug: 'sima',
    title: {
      es: 'SIMA - Sistema Integral de Modelación Actuarial',
      en: 'SIMA - Integrated Actuarial Modeling System',
    },
    description: {
      es: 'Valuar reservas de vida exige conectar proyección de mortalidad, producto y capital regulatorio en un solo flujo. SIMA lo hace de extremo a extremo: proyecta mortalidad con Lee-Carter, construye tablas de conmutación, valúa reservas para tres productos y calcula el RCS con pruebas de estrés bajo la LISF. Desplegado en Google Cloud.',
      en: 'Valuing life insurance reserves requires connecting mortality projection, product design, and regulatory capital in one continuous flow. SIMA handles it end-to-end: Lee-Carter mortality projection, commutation tables, reserve valuation for three products, and RCS capital requirements with stress testing under LISF. Deployed on Google Cloud.',
    },
    url: 'https://sima-d3qj5vwxtq-uc.a.run.app',
    repo: 'https://github.com/GonorAndres/SIMA',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Python', 'FastAPI', 'React', 'Lee-Carter', 'SVD', 'LISF', 'Solvencia II', 'GCP'],
      en: ['Python', 'FastAPI', 'React', 'Lee-Carter', 'SVD', 'LISF', 'Solvency II', 'GCP'],
    },
    variant: 'wide',
    screenshot: '/screenshots/sima.png',
    relatedTo: ['life-insurance', 'property-insurance', 'gmm-explorer', 'michoacan', 'data-analyst-portfolio'],
    blogSlug: 'sima',
    tier: 1,
    creation_date: '2026-01-23',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/gmm-explorer
  // live: https://gmm-explorer.vercel.app/contexto
  // local: /home/andtega349/gmm-explorer
  // source: CNSF open data — 5.1M GMM claims, 95.9M insured-years (2020-2024)
  {
    slug: 'gmm-explorer',
    title: {
      es: 'GMM Explorer - Gastos Médicos Mayores',
      en: 'GMM Explorer - Major Medical Expenses',
    },
    description: {
      es: 'Tarificar GMM sin datos reales es especular. Este proyecto procesa 5.1M siniestros y 95.9M asegurados-año publicados por la CNSF (2020-2024), los clasifica en tres niveles de hospitalización con IA y calcula la prima pura por frecuencia-severidad ajustada por inflación médica. El resultado: un tarificador interactivo desplegado en Vercel.',
      en: 'Pricing major medical insurance without real claims data is guesswork. This project processes 5.1M claims and 95.9M insured-years from CNSF open data (2020-2024), classifies them into three hospitalization levels with AI, and calculates the net premium via frequency-severity adjusted for medical inflation. The output: an interactive tariff calculator on Vercel.',
    },
    url: 'https://gmm-explorer.vercel.app/contexto',
    repo: 'https://github.com/GonorAndres/gmm-explorer',
    platform: 'Vercel',
    category: 'actuarial',
    tags: {
      es: ['Next.js', 'Python', 'Actuaría', 'GMM', 'Tarificación', 'CNSF', 'Claude AI', 'Frecuencia-Severidad', 'Credibilidad'],
      en: ['Next.js', 'Python', 'Actuarial', 'GMM', 'Pricing', 'CNSF', 'Claude AI', 'Frequency-Severity', 'Credibility'],
    },
    variant: 'wide',
    screenshot: '/screenshots/gmm-explorer.png',
    blogSlug: 'gmm-explorer',
    tier: 1,
    relatedTo: ['sima', 'life-insurance', 'property-insurance', 'data-analyst-portfolio'],
    creation_date: '2025-12-07',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/data-analyst-path
  // live: 7 dashboards deployed — see blog post for individual URLs
  // local: /home/andtega349/data-analyst-path
  // source: NAIC Schedule P (insurance reserves), Olist e-commerce (Kaggle), Airbnb CDMX (Inside Airbnb)
  {
    slug: 'data-analyst-portfolio',
    title: {
      es: 'Portafolio de Analista de Datos',
      en: 'Data Analyst Portfolio',
    },
    description: {
      es: 'Un analista de datos se evalúa por el rango de problemas que puede resolver, no solo por las herramientas que conoce. Este portafolio reúne 7 proyectos end-to-end: cohortes de e-commerce, reservas actuariales, pruebas A/B, KPIs ejecutivos y análisis de riesgo financiero. Todos desplegados con dashboards interactivos.',
      en: 'A data analyst is evaluated by the range of problems they can solve, not just the tools they know. This portfolio brings together 7 end-to-end projects: e-commerce cohorts, actuarial reserves, A/B testing, executive KPIs, and financial risk analysis. All deployed with interactive dashboards.',
    },
    url: 'https://demo-aesthetics.vercel.app/',
    repo: 'https://github.com/GonorAndres/data-analyst-path',
    platform: 'Vercel',
    category: 'data-science',
    tags: {
      es: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
      en: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
    },
    variant: 'wide',
    screenshot: '/screenshots/data-analyst-portafolio.png',
    relatedTo: ['sima', 'gmm-explorer', 'ab-testing', 'credit-risk'],
    blogSlug: 'data-analyst-portfolio',
    tier: 1,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/data-engineer-path
  // local: /home/andtega349/data-engineer-path
  // source: 6 projects building a complete GCP data platform for insurance claims
  // 4 deployed to GCP (P01-P04), 2 local-only (P05-P06), total platform cost <$10/month
  {
    slug: 'data-engineering-platform',
    title: {
      es: 'Plataforma de Datos en GCP para Seguros',
      en: 'GCP Data Platform for Insurance',
    },
    description: {
      es: 'Un siniestro de seguros recorre un camino largo entre el evento y el modelo que lo tarifica. Automatizar ese flujo produce datos más rápidos, confiables y consistentes. Este proyecto construye cada tramo sobre GCP: ingesta en tiempo real con Pub/Sub y Beam, warehouse dimensional en BigQuery, orquestación con Dagster, infraestructura con Terraform y un modelo GLM Tweedie que convierte los datos limpios en prima actuarial. Seis etapas, un solo flujo.',
      en: 'An insurance claim travels a long path between the event and the model that prices it. Automating that flow produces faster, more reliable, and more consistent data. This project builds every segment on GCP: real-time ingestion with Pub/Sub and Beam, dimensional warehouse in BigQuery, Dagster orchestration, Terraform infrastructure, and a Tweedie GLM that turns clean data into actuarial premium. Six stages, one continuous flow.',
    },
    url: 'https://github.com/GonorAndres/data-engineer-path',
    platform: 'GitHub',
    category: 'data-engineering',
    tags: {
      es: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'GLM Tweedie'],
      en: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'Tweedie GLM'],
    },
    variant: 'wide',
    screenshot: '/screenshots/data-engineering-platform.png',
    relatedTo: ['sima', 'insurance-pricing-ml', 'data-analyst-portfolio'],
    blogSlug: 'data-engineering-platform',
    tier: 1,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/regulation-actuarial-agent
  // local: /home/andtega349/lisf-agent
  // live: https://actuarial-regulation-agent-d3qj5vwxtq-uc.a.run.app/
  // source: LISF + CUSF PDFs — Mexican insurance and surety regulation
  {
    slug: 'lisf-agent',
    title: {
      es: 'Asistente de Regulación Actuarial',
      en: 'Actuarial Regulation Assistant',
    },
    description: {
      es: 'La LISF y la CUSF suman más de mil artículos y su interpretación requiere navegar entre disposiciones interrelacionadas. Este agente, construido con el Claude Agent SDK, indexa el texto completo de ambas leyes y genera respuestas contextualizadas con referencia exacta al artículo. Backend FastAPI desplegado en GCP; sin alucinaciones de citas. Código de acceso: actuaria-claude.',
      en: 'LISF and CUSF together span over a thousand articles, and interpreting them requires navigating interrelated provisions. This agent, built with the Claude Agent SDK, indexes the full text of both laws and returns contextualized answers with exact article references. FastAPI backend deployed on GCP; no hallucinated citations. Access code: actuaria-claude.',
    },
    url: 'https://actuarial-regulation-agent-d3qj5vwxtq-uc.a.run.app/',
    repo: 'https://github.com/GonorAndres/regulation-actuarial-agent',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Claude SDK', 'FastAPI', 'LISF', 'CUSF', 'Python', 'GCP'],
      en: ['Claude SDK', 'FastAPI', 'LISF', 'CUSF', 'Python', 'GCP'],
    },
    variant: 'standard',
    screenshot: '/screenshots/lisf-agent.png',
    relatedTo: ['sima'],
    blogSlug: 'regulation-agent-rag',
    tier: 1,
    creation_date: '2026-02-01',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/seguridad-social
  // local: /home/andtega349/seguridad_social/fondo_bienestar
  // source: original calculations based on LSS (Ley del Seguro Social), UMA historical values, AFORE commission data
  {
    slug: 'pension-simulator',
    title: {
      es: 'Simulador de Pensión IMSS + Fondo Bienestar',
      en: 'IMSS Pension Simulator + Fondo Bienestar',
    },
    description: {
      es: 'La mayoría de los trabajadores mexicanos no sabe bajo qué régimen de pensión cotiza ni cuánto recibirá al retiro. Esta aplicación R Shiny resuelve esa ambigüedad: ingresa salario, semanas cotizadas y rendimiento AFORE esperado para obtener la pensión estimada bajo Ley 73, Ley 97 y Fondo Bienestar, con análisis de sensibilidad y reporte descargable.',
      en: 'Most Mexican workers do not know which pension regime they are enrolled in or what they will actually receive at retirement. This R Shiny app resolves that ambiguity: enter salary, contribution weeks, and expected AFORE return to get estimated benefits under Ley 73, Ley 97, and Fondo Bienestar, with sensitivity analysis and a downloadable report.',
    },
    url: 'https://simulador-pension-d3qj5vwxtq-uc.a.run.app/',
    repo: 'https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['R', 'Shiny', 'IMSS', 'AFORE', 'Pensiones'],
      en: ['R', 'Shiny', 'IMSS', 'AFORE', 'Pensions'],
    },
    variant: 'standard',
    screenshot: '/screenshots/pension-simulator.png',
    relatedTo: ['sima', 'life-insurance'],
    blogSlug: 'pension-simulator',
    tier: 1,
    creation_date: '2026-02-07',
    last_modification_date: '2026-03-17',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original technical note (UNAM coursework), aligned to LISF/CUSF regulation
  {
    slug: 'life-insurance',
    title: {
      es: 'Nota Técnica - Seguro de Vida',
      en: 'Technical Note - Life Insurance',
    },
    description: {
      es: 'Registrar un seguro de vida ante la CNSF implica entregar bases técnicas que justifiquen cada supuesto biométrico y cada carga. Esta nota técnica recorre el ciclo completo del producto individual: bases de mortalidad, cálculo de prima neta y comercial, valuación de reservas y cuantificación del requerimiento de capital de solvencia bajo la LISF.',
      en: 'Registering a life insurance product with CNSF requires submitting technical bases that justify every biometric assumption and loading. This technical note covers the full individual product cycle: mortality bases, net and commercial premium calculation, reserve valuation, and solvency capital requirement quantification under LISF.',
    },
    url: 'https://drive.google.com/drive/folders/1PfotLUbidzwk8gdW4kbqQfLB4PbkuYBj',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaría', 'Seguros', 'Regulación'],
      en: ['Actuarial', 'Insurance', 'Regulation'],
    },
    variant: 'standard',
    screenshot: '/screenshots/vida-tecnica.png',
    relatedTo: ['sima', 'property-insurance', 'michoacan', 'gmm-explorer'],
    tier: 3,
    creation_date: '2024-12-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original technical note (UNAM coursework), CNSF auto insurance data
  {
    slug: 'property-insurance',
    title: {
      es: 'Nota Técnica - Seguro de Daños',
      en: 'Technical Note - Property Insurance',
    },
    description: {
      es: 'La prima de un seguro de daños mezcla exposición al riesgo, gastos operativos y margen de utilidad: descomponerlos correctamente requiere estadística. Esta nota técnica usa datos públicos de la CNSF para construir el modelo de frecuencia-severidad para autos, contrasta su estructura con el ramo de vida y entrega un cotizador funcional en Excel.',
      en: 'A property insurance premium blends risk exposure, operating expenses, and profit margin; decomposing them correctly requires statistics. This technical note uses CNSF public data to build a frequency-severity model for auto insurance, contrasts its structure with the life branch, and delivers a functional Excel quoter.',
    },
    url: 'https://drive.google.com/drive/folders/12tF-Ma_sWtDM5k6zYzNx8btUGS78b-0W',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaría', 'Autos', 'CNSF'],
      en: ['Actuarial', 'Auto', 'CNSF'],
    },
    variant: 'standard',
    screenshot: '/screenshots/danos-tecnica.png',
    relatedTo: ['sima', 'life-insurance', 'gmm-explorer'],
    tier: 3,
    creation_date: '2025-06-01',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: EvaluaciónDerivadosDivisas)
  // source: real FX market data (MXN/USD forward curve)
  {
    slug: 'derivatives',
    title: {
      es: 'Derivados de Divisas - MCF',
      en: 'Currency Derivatives - QMF',
    },
    description: {
      es: 'El mercado de divisas cotiza tipo spot, forwards y opciones al mismo tiempo; cada precio implica una tasa o volatilidad distinta. Este análisis construye la curva forward MXN/USD a partir de datos reales, valúa contratos forward, calcula spreads bid-offer y mapea la superficie de volatilidad implícita para distintos strikes y vencimientos.',
      en: 'The FX market quotes spot, forwards, and options simultaneously; each price implies a different rate or volatility. This analysis builds the MXN/USD forward curve from real market data, prices forward contracts, calculates bid-offer spreads, and maps the implied volatility surface across strikes and maturities.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Evaluaci%C3%B3nDerivadosDivisas',
    platform: 'GitHub',
    category: 'quant-finance',
    tags: {
      es: ['Python', 'Derivados', 'Opciones'],
      en: ['Python', 'Derivatives', 'Options'],
    },
    variant: 'wide',
    screenshot: '/screenshots/derivatives.png',
    relatedTo: ['markowitz'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: Mexican stock market price data (10 assets, historical prices)
  {
    slug: 'markowitz',
    title: {
      es: 'Optimización de Portafolio - Markowitz',
      en: 'Portfolio Optimization - Markowitz',
    },
    description: {
      es: 'La decisión de asignación de activos determina más del rendimiento de una cartera que la selección individual de cada valor. Este proyecto aplica optimización de Markowitz a 10 activos del mercado mexicano, construye la frontera eficiente y calcula la cartera tangente, que alcanzó 110% de rendimiento anualizado en el período de prueba.',
      en: 'Asset allocation decisions explain more of a portfolio\'s return than individual security selection. This project applies Markowitz optimization to 10 Mexican market assets, builds the efficient frontier, and calculates the tangency portfolio, which achieved 110% annualized return over the test period.',
    },
    url: 'https://drive.google.com/drive/folders/1Dz54zcTpa9quMFCkgddBN5GWQfy6CIXv',
    platform: 'Drive',
    category: 'quant-finance',
    tags: {
      es: ['Excel', 'VaR', 'Finanzas'],
      en: ['Excel', 'VaR', 'Finance'],
    },
    variant: 'standard',
    screenshot: '/screenshots/markowitz.png',
    relatedTo: ['derivatives'],
    tier: 3,
    creation_date: '2025-06-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: INEGI Census 2020, Michoacán state demographic data
  {
    slug: 'michoacan',
    title: {
      es: 'Análisis Demográfico - Michoacán',
      en: 'Demographic Analysis - Michoacan',
    },
    description: {
      es: 'Las tablas nacionales de mortalidad promedian regiones con realidades muy diferentes. Este análisis toma Michoacán como caso de estudio y construye indicadores demográficos propios con datos del censo INEGI 2020: tasas de mortalidad por edad, índices de fecundidad y estructura poblacional. Un ejercicio que muestra cuánto cambian los supuestos actuariales cuando se usan datos regionales en lugar de promedios nacionales.',
      en: 'National mortality tables average regions with very different realities. This analysis takes Michoacan as a case study and builds its own demographic indicators from INEGI 2020 census data: age-specific mortality rates, fertility indices, and population structure. An exercise showing how much actuarial assumptions change when using regional data instead of national averages.',
    },
    url: 'https://drive.google.com/drive/folders/1U_KrCv0g6o-JWNv0l6RHoPCWZBr0-exu',
    platform: 'Drive',
    category: 'applied-math',
    tags: {
      es: ['Excel', 'INEGI', 'Demografía'],
      en: ['Excel', 'INEGI', 'Demographics'],
    },
    variant: 'standard',
    screenshot: '/screenshots/demografia-michoacan.png',
    relatedTo: ['sima', 'life-insurance'],
    tier: 3,
    creation_date: '2023-12-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: Mexico City Government open data — public debt registry with TIIE rate series
  {
    slug: 'data-cleaning',
    title: {
      es: 'Limpieza de Datos - Deuda Pública CDMX',
      en: 'Data Cleaning - CDMX Public Debt',
    },
    description: {
      es: 'Los registros de deuda pública de la Ciudad de México llegaron con inconsistencias de formato, fechas duplicadas y tasas TIIE vacías. El proyecto reconstruye la serie completa y deja la base lista para análisis, documentando cada decisión de limpieza con fórmulas avanzadas de Excel.',
      en: 'Mexico City\'s public debt records arrived with format inconsistencies, duplicate dates, and missing TIIE rates. The project reconstructs the complete rate series and leaves the database analysis-ready, documenting every cleaning decision with advanced Excel formulas.',
    },
    url: 'https://drive.google.com/drive/folders/1qOYJXgcIiZUyhf2OQTCRu_bgskaZ06AE',
    platform: 'Drive',
    category: 'data-science',
    tags: {
      es: ['Excel', 'Datos', 'TIIE'],
      en: ['Excel', 'Data', 'TIIE'],
    },
    variant: 'standard',
    screenshot: '/screenshots/deuda-cdmx.png',
    relatedTo: ['credit-risk'],
    tier: 3,
    creation_date: '2025-06-01',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: TexasPokerCaseStudy)
  // source: original simulation, no external dataset
  {
    slug: 'monte-carlo-poker',
    title: {
      es: 'Simulación Montecarlo - Poker',
      en: 'Monte Carlo Simulation - Poker',
    },
    description: {
      es: 'Cuando la solución analítica es intratable, simular miles de escenarios es la única opción práctica. Este proyecto aplica Monte Carlo a Texas Hold\'em para estimar probabilidades de mano, muestra la convergencia de las estimaciones conforme crece el número de simulaciones y traza el puente metodológico hacia pricing de derivados y análisis de riesgo actuarial.',
      en: 'When the analytical solution is intractable, simulating thousands of scenarios is the only practical option. This project applies Monte Carlo to Texas Hold\'em to estimate hand probabilities, shows how estimates converge as simulation count grows, and draws the methodological bridge toward derivatives pricing and actuarial risk analysis.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/TexasPokerCaseStudy',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'Simulación', 'Probabilidad'],
      en: ['Python', 'Simulation', 'Probability'],
    },
    variant: 'standard',
    screenshot: '/screenshots/monte-carlo-poker.png',
    relatedTo: ['ab-testing'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original Excel model (UNAM coursework)
  {
    slug: 'amortization',
    title: {
      es: 'Tabla de Amortizaciones Dinámica',
      en: 'Dynamic Amortization Table',
    },
    description: {
      es: 'Los primeros pagos de un crédito casi no reducen el saldo; casi todo va a intereses. Entender por qué exige ver la tabla completa de amortización. Esta herramienta dinámica en Excel construye y compara esquemas de pago fijo, decreciente y francés: ajusta monto, tasa y plazo para ver cómo cambia la distribución entre capital e intereses.',
      en: 'Early loan payments barely reduce the principal balance; almost everything goes to interest. Understanding why requires seeing the full amortization schedule. This dynamic Excel tool builds and compares fixed, decreasing, and French payment schemes: adjust principal, rate, and term to see how the split between capital and interest shifts over time.',
    },
    url: 'https://drive.google.com/drive/folders/15Zyl2XKcXKnmrrFLtlctQwYeVz_C9EdW',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Excel', 'Amortización'],
      en: ['Excel', 'Amortization'],
    },
    variant: 'standard',
    screenshot: '/screenshots/amortizacion.png',
    relatedTo: ['derivatives'],
    tier: 3,
    creation_date: '2024-06-01',
  },

  // repo: https://github.com/GonorAndres/Analisis_Seguros_Mexico
  // local: /home/andtega349/seguridad_social (different path — note the repo is Analisis_Seguros_Mexico)
  // source: EMSSA-09 Mexican mortality tables, original actuarial calculations, no external dataset required
  {
    slug: 'actuarial-suite',
    title: {
      es: 'Suite Actuarial Mexicana - Python',
      en: 'Mexican Actuarial Suite - Python',
    },
    description: {
      es: 'El ciclo operativo de una aseguradora mexicana se fragmenta entre hojas de cálculo que no se comunican. Esta librería unifica tarificación, reservas, reaseguro y cumplimiento regulatorio para cuatro ramos (vida, daños, salud, pensiones) con validación Pydantic y precisión Decimal. Expuesta como API REST y con ejemplos interactivos, sirve como base modular para construir sistemas actuariales más complejos.',
      en: 'A Mexican insurer\'s operating cycle is fragmented across spreadsheets that don\'t talk to each other. This library unifies pricing, reserves, reinsurance, and regulatory compliance for four lines (life, property, health, pensions) with Pydantic validation and Decimal precision. Exposed as a REST API with interactive examples, it serves as a modular base for building more complex actuarial systems.',
    },
    url: 'https://suite-actuarial-d3qj5vwxtq-uc.a.run.app',
    repo: 'https://github.com/GonorAndres/Analisis_Seguros_Mexico',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Python', 'Pydantic', 'Streamlit', 'LISF', 'RCS', 'CNSF', 'Reaseguro', 'EMSSA-09'],
      en: ['Python', 'Pydantic', 'Streamlit', 'LISF', 'RCS', 'CNSF', 'Reinsurance', 'EMSSA-09'],
    },
    variant: 'wide',
    screenshot: '/screenshots/actuarial-suite.png',
    blogSlug: 'suite-actuarial',
    tier: 1,
    relatedTo: ['sima', 'life-insurance', 'property-insurance'],
    creation_date: '2025-11-18',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/CarteraSeguroAutos
  // live: https://cartera-autos-d3qj5vwxtq-uc.a.run.app
  // local: /home/andtega349/carteras-autos-R
  // source: synthetic data generated with R, calibrated to AMIS and CONDUSEF market parameters
  {
    slug: 'cartera-autos',
    title: {
      es: 'Plataforma de Siniestralidad Auto',
      en: 'Auto Insurance Claims Platform',
    },
    description: {
      es: 'Gestionar una cartera de autos con datos dispersos entre áreas genera decisiones lentas y riesgo de inconsistencia. Esta plataforma reúne tarificación, reservas, pruebas de estrés y detección de fraude en un solo dashboard sobre 140K pólizas calibradas al mercado mexicano. Cuando cualquier equipo consulta el mismo sistema, la gestión de la cartera se vuelve más rápida y confiable. Construido con 17 módulos R.',
      en: 'Managing an auto portfolio with data scattered across departments leads to slow decisions and inconsistency risk. This platform brings pricing, reserves, stress testing, and fraud detection into a single dashboard over 140K policies calibrated to the Mexican market. When every team queries the same system, portfolio management becomes faster and more reliable. Built with 17 R modules.',
    },
    url: 'https://cartera-autos-451451662791.us-central1.run.app',
    repo: 'https://github.com/GonorAndres/CarteraSeguroAutos',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib', 'CONDUSEF', 'AMIS', 'Fraude', 'Autos'],
      en: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib', 'CONDUSEF', 'AMIS', 'Fraud', 'Auto'],
    },
    variant: 'wide',
    screenshot: '/screenshots/cartera-autos.png',
    blogSlug: 'cartera-autos',
    tier: 1,
    relatedTo: ['pension-simulator', 'sima', 'property-insurance'],
    creation_date: '2025-08-30',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/proust-attention
  // local: /home/andtega349/proust-attention
  // source: Project Gutenberg — full text of "À la recherche du temps perdu" (7 volumes)
  {
    slug: 'proust-attention',
    title: {
      es: 'La Máquina de Atención de Proust',
      en: 'The Proust Attention Machine',
    },
    description: {
      es: 'Los modelos de lenguaje se usan a diario pero pocos saben lo que ocurre dentro. Este transformer character-level, entrenado con los 7 volúmenes de En busca del tiempo perdido y construido desde cero en PyTorch, hace visible ese mecanismo: cómo se aprenden embeddings, cómo opera la atención multi-cabeza y por qué todo se reduce a multiplicación de matrices.',
      en: 'Language models are used daily but few people understand what happens inside. This character-level transformer, trained on all 7 volumes of In Search of Lost Time and built from scratch in PyTorch, makes that mechanism visible: how embeddings are learned, how multi-head attention operates, and why everything reduces to matrix multiplication.',
    },
    url: 'https://huggingface.co/spaces/GonorAndres/proust-attention',
    repo: 'https://github.com/GonorAndres/proust-attention',
    platform: 'HuggingFace',
    category: 'data-science',
    tags: {
      es: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
      en: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
    },
    variant: 'standard',
    relatedTo: ['lisf-agent'],
    blogSlug: 'proust-attention-machine',
    tier: 1,
    creation_date: '2026-02-07',
    last_modification_date: '2026-03-14',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: Bayesian_vs_Frequentist)
  // source: synthetic conversion rate experiment data
  {
    slug: 'ab-testing',
    title: {
      es: 'Inferencia Bayesiana vs Frecuentista - Test A/B',
      en: 'Bayesian vs Frequentist - A/B Test',
    },
    description: {
      es: 'Cuando una prueba A/B termina, la pregunta real es si la diferencia observada justifica cambiar el producto. Este proyecto corre los dos marcos sobre el mismo experimento de conversión: frecuentista con chi-cuadrado y potencia estadística, bayesiano con distribución Beta posterior en PyMC. El resultado muestra cuándo cada enfoque cambia la decisión.',
      en: 'When an A/B test ends, the real question is whether the observed difference justifies changing the product. This project runs both frameworks on the same conversion experiment: frequentist with chi-square and statistical power, Bayesian with Beta posterior in PyMC. The result shows when each approach actually changes the decision.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Bayesian_vs_Frequentist',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'Bayes', 'PyMC'],
      en: ['Python', 'Bayes', 'PyMC'],
    },
    variant: 'tall',
    screenshot: '/screenshots/ab-testing.png',
    relatedTo: ['credit-risk'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: https://github.com/GonorAndres/data-science-path (subfolder: projects/insurance-pricing)
  // local: /home/andtega349/data-science-path/projects/insurance-pricing
  // source: synthetic insurance data generated with actuarial assumptions (Poisson/Gamma frequency-severity)
  {
    slug: 'insurance-pricing-ml',
    title: {
      es: 'Tarificación de Seguros con ML',
      en: 'Insurance Pricing with ML',
    },
    description: {
      es: 'El modelo actuarial clásico ofrece interpretabilidad; machine learning ofrece capacidad predictiva. La pregunta es cuándo la ganancia en precisión justifica la complejidad adicional. Este proyecto corre ambos enfoques sobre los mismos datos de seguros, compara sus resultados y analiza si las primas que genera cada modelo son equitativas entre género y grupos de edad. Resultados explorables en un dashboard interactivo.',
      en: 'The classic actuarial model offers interpretability; machine learning offers predictive power. The question is when the gain in accuracy justifies the added complexity. This project runs both approaches on the same insurance data, compares their outputs, and analyzes whether each model\'s premiums are equitable across gender and age groups. Results explorable in an interactive dashboard.',
    },
    url: '/blog/actuarial-ml-pricing/',
    repo: 'https://github.com/GonorAndres/data-science-path',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'GLM', 'XGBoost', 'SHAP', 'Fairness', 'FastAPI'],
      en: ['Python', 'GLM', 'XGBoost', 'SHAP', 'Fairness', 'FastAPI'],
    },
    variant: 'wide',
    relatedTo: ['sima', 'data-analyst-portfolio', 'credit-risk'],
    blogSlug: 'actuarial-ml-pricing',
    tier: 2,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-15',
  },

  // repo: https://github.com/GonorAndres/b-trees
  // local: /home/andtega349/b-trees
  // source: original Rust implementation, no external dataset — motivated by PostgreSQL index internals study
  {
    slug: 'b-tree-explorer',
    title: {
      es: 'B-Tree Explorer - Visualización en Rust + WASM',
      en: 'B-Tree Explorer - Rust + WASM Visualization',
    },
    description: {
      es: 'Los índices de PostgreSQL operan sobre árboles B, pero la documentación no muestra cómo funcionan por dentro. Este explorador, implementado en Rust y compilado a WebAssembly, anima inserciones, búsquedas y divisiones de nodos paso a paso, haciendo visible por qué los árboles B garantizan búsqueda O(log n) sobre almacenamiento en disco.',
      en: 'PostgreSQL indexes operate on B-trees, but the documentation does not show how they work internally. This explorer, implemented in Rust and compiled to WebAssembly, animates insertions, searches, and node splits step by step, making visible why B-trees guarantee O(log n) search on disk-based storage.',
    },
    url: 'https://github.com/GonorAndres/b-trees',
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['Rust', 'WASM', 'Estructuras de Datos', 'PostgreSQL'],
      en: ['Rust', 'WASM', 'Data Structures', 'PostgreSQL'],
    },
    variant: 'standard',
    relatedTo: ['data-analyst-portfolio'],
    blogSlug: 'b-trees-optimization',
    tier: 4,
    creation_date: '2026-02-07',
  },

  // repo: https://github.com/GonorAndres/forecasting
  // local: /home/andtega349/forecasting
  // source: historical global volcanic eruption catalog (Smithsonian GVP or equivalent public dataset)
  // advisor: Dr. Hugo Delgado (UNAM)
  {
    slug: 'eruption-forecasting',
    title: {
      es: 'Pronóstico de Erupciones Volcánicas',
      en: 'Volcanic Eruption Forecasting',
    },
    description: {
      es: 'Pronosticar erupciones volcánicas es un problema de eventos raros con alta varianza y datos escasos. Este análisis ajusta modelos ARIMA y suavizamiento exponencial al catálogo histórico del Smithsonian GVP, evalúa los intervalos de predicción y documenta los límites inherentes de aplicar series de tiempo a fenómenos geofísicos extremos.',
      en: 'Forecasting volcanic eruptions is a rare-event problem with high variance and scarce data. This analysis fits ARIMA and exponential smoothing models to the Smithsonian GVP historical catalog, evaluates prediction intervals, and documents the inherent limits of applying time series methods to extreme geophysical events.',
    },
    url: '#', // repo is private; update when blog post is published or repo is made public
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['Python', 'Series de Tiempo', 'ARIMA', 'Pronóstico'],
      en: ['Python', 'Time Series', 'ARIMA', 'Forecasting'],
    },
    variant: 'standard',
    relatedTo: ['michoacan', 'ab-testing'],
    tier: 4,
    creation_date: '2026-02-07',
  },

  // repo: Google Colab notebook (url IS the source)
  // source: original Python implementation (UNAM coursework, Numerical Analysis)
  {
    slug: 'euler-method',
    title: {
      es: 'Método de Euler - EDOs',
      en: 'Euler Method - ODEs',
    },
    description: {
      es: 'Las ecuaciones diferenciales describen el mundo continuo; las computadoras operan en tiempo discreto. El método de Euler es el puente más simple entre ambos. Esta implementación en Python parte de la demostración del teorema de Picard-Lindelöf, construye el método paso a paso y cuantifica el error de discretización en función del tamaño de paso.',
      en: 'Differential equations describe the continuous world; computers operate in discrete time. Euler\'s method is the simplest bridge between both. This Python implementation starts from the Picard-Lindelöf existence proof, builds the method step by step, and quantifies the discretization error as a function of step size.',
    },
    url: 'https://colab.research.google.com/drive/1g6uDqBaJoHbx2MyNeh2tgP5nwKOgqPkA',
    platform: 'Colab',
    category: 'applied-math',
    tags: {
      es: ['Python', 'EDOs', 'Euler'],
      en: ['Python', 'ODEs', 'Euler'],
    },
    variant: 'standard',
    screenshot: '/screenshots/euler-method.png',
    relatedTo: ['michoacan'],
    tier: 3,
    creation_date: '2024-04-01',
  },

  // repo: https://github.com/GonorAndres/learning-posgre
  // local: /home/andtega349/learning_posgre
  // source: PostgresPro Airlines demo database — 5.74M rows of real Russian airline data
  {
    slug: 'flight-analytics-pg-bq',
    title: {
      es: 'Flight Analytics - PostgreSQL a BigQuery',
      en: 'Flight Analytics - PostgreSQL to BigQuery',
    },
    description: {
      es: 'PostgreSQL y BigQuery resuelven problemas diferentes; saber cuándo usar cada uno requiere haberlos comparado con datos reales. Este proyecto migra 5.74M filas de datos reales de aerolíneas de PostgreSQL 16 a BigQuery con un pipeline ETL en Python, documenta aceleraciones de 13x a 1,300x en consultas clave e incluye un dashboard interactivo desplegado en Firebase con mapa WebGL de rutas, heatmaps de retrasos y visualización de internals de PostgreSQL.',
      en: 'PostgreSQL and BigQuery solve different problems; knowing when to use each requires comparing them on real data. This project migrates 5.74M rows of real airline data from PostgreSQL 16 to BigQuery via a Python ETL pipeline, documents 13x to 1,300x query speedups, and includes an interactive dashboard deployed on Firebase with a WebGL route map, delay heatmaps, and PostgreSQL internals visualization.',
    },
    url: 'https://project-ad7a5be2-a1c7-4510-82d.firebaseapp.com/',
    repo: 'https://github.com/GonorAndres/learning-posgre',
    platform: 'Firebase',
    category: 'data-engineering',
    tags: {
      es: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Next.js', 'deck.gl', 'Firebase', 'recharts'],
      en: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Next.js', 'deck.gl', 'Firebase', 'recharts'],
    },
    variant: 'wide',
    screenshot: '/screenshots/flight-analytics-pg-bq.png',
    relatedTo: ['data-engineering-platform', 'data-analyst-portfolio'],
    blogSlug: 'flight-analytics-pg-bq',
    tier: 2,
    creation_date: '2026-02-07',
    last_modification_date: '2026-03-30',
  },

  // repo: https://github.com/GonorAndres/risk-analyst
  // local: /home/andtega349/risk-analyst
  // source: 13 progressive quant risk projects — yfinance, FRED, synthetic data with actuarial assumptions
  {
    slug: 'risk-analyst',
    title: {
      es: 'Risk Analyst - Análisis Cuantitativo de Riesgos',
      en: 'Risk Analyst - Quantitative Risk Analysis',
    },
    description: {
      es: 'El riesgo financiero cuantitativo no se aprende de un solo modelo: requiere construir progresivamente desde los fundamentos. Esta serie recorre 13 proyectos que van desde calcular cuánto puede perder un portafolio en un día (VaR) hasta modelar cómo la quiebra de una institución contagia al sistema financiero completo. Cubre acciones, bonos, opciones y riesgo sistémico con datos reales de mercado.',
      en: 'Quantitative financial risk is not learned from a single model; it requires building progressively from the foundations. This series spans 13 projects ranging from calculating how much a portfolio can lose in a day (VaR) to modeling how one institution\'s failure spreads across the entire financial system. Covers equities, bonds, options, and systemic risk with real market data.',
    },
    url: '/blog/risk-analyst/',
    repo: 'https://github.com/GonorAndres/risk-analyst',
    platform: 'GitHub',
    category: 'quant-finance',
    tags: {
      es: ['Python', 'VaR', 'CVaR', 'Monte Carlo', 'Deep Learning', 'Copulas', '+7'],
      en: ['Python', 'VaR', 'CVaR', 'Monte Carlo', 'Deep Learning', 'Copulas', '+7'],
    },
    variant: 'standard',
    screenshot: '/screenshots/risk-analyst.png',
    relatedTo: ['credit-risk', 'derivatives', 'markowitz'],
    blogSlug: 'risk-analyst',
    tier: 2,
    creation_date: '2026-03-18',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: Credit_Risk_Model)
  // source: Kaggle credit default dataset (~32,000 records)
  {
    slug: 'credit-risk',
    title: {
      es: 'Modelo Predictivo de Incumplimiento Crediticio',
      en: 'Credit Default Prediction Model',
    },
    description: {
      es: 'Aprobar un crédito riesgoso no cuesta lo mismo que rechazar uno solvente. Este modelo GLM entrenado con 32,000 registros discrimina riesgo de incumplimiento con variables financieras y demográficas, alcanzando 85.19% de AUC. El análisis incluye calibración del umbral de decisión según el costo asimétrico de cada tipo de error.',
      en: 'Approving a risky loan does not carry the same cost as rejecting a solvent one. This GLM model trained on 32,000 records discriminates default risk using financial and demographic variables, achieving 85.19% AUC. The analysis includes decision threshold calibration based on the asymmetric cost of each error type.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['ML', 'GLM', 'Riesgo'],
      en: ['ML', 'GLM', 'Risk'],
    },
    variant: 'wide',
    screenshot: '/screenshots/credit-risk.png',
    relatedTo: ['ab-testing', 'data-cleaning'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // local: /home/andtega349/micro-insurance
  // source: original research — INEGI mortality, Banxico remittances, CONEVAL marginalization, EMSSA-2009
  // status: in-development (Phase 1 not started)
  {
    slug: 'micro-insurance',
    title: {
      es: 'MicroInsurance.jl - Tarificacion para Economia Informal',
      en: 'MicroInsurance.jl - Pricing Engine for the Informal Economy',
    },
    description: {
      es: '~35M de trabajadores informales en Mexico no tienen acceso a seguros de vida porque el underwriting tradicional exige empleo formal, historial crediticio y examen medico. Este motor reemplaza esos requisitos con senales proxy (mortalidad geografica, remesas, pagos de servicios) ponderadas por credibilidad Buhlmann-Straub sobre una superficie de mortalidad Lee-Carter. Julia.',
      en: '~35M informal workers in Mexico lack access to life insurance because traditional underwriting requires formal employment, credit history, and medical exams. This engine replaces those requirements with proxy signals (geographic mortality, remittances, utility payments) weighted through Buhlmann-Straub credibility over a Lee-Carter mortality surface. Julia.',
    },
    url: '#',
    platform: 'GitHub',
    category: 'actuarial',
    tags: {
      es: ['Julia', 'Lee-Carter', 'Buhlmann-Straub', 'LISF', 'Microfinanzas', 'INEGI'],
      en: ['Julia', 'Lee-Carter', 'Buhlmann-Straub', 'LISF', 'Microfinance', 'INEGI'],
    },
    variant: 'standard',
    relatedTo: ['sima', 'pension-simulator', 'lisf-agent', 'actuarial-suite', 'michoacan'],
    tier: 2,
    status: 'in-development',
    creation_date: '2026-03-26',
  },
];

export function getProjects(lang: Lang) {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    description: p.description[lang],
    url: p.url.startsWith('/') && lang === 'en' ? `/en${p.url}` : p.url,
    repo: p.repo,
    platform: p.platform,
    category: p.category,
    tags: p.tags[lang],
    variant: p.variant,
    screenshot: p.screenshot,
    relatedTo: p.relatedTo,
    blogSlug: p.blogSlug,
    tier: p.tier,
    status: p.status,
    creation_date: p.creation_date,
    last_modification_date: p.last_modification_date,
  }));
}

export function getRelatedProjectNames(slugs: string[], lang: Lang): string[] {
  return slugs
    .map((slug) => {
      const project = projects.find((p) => p.slug === slug);
      return project ? project.title[lang] : null;
    })
    .filter((name): name is string => name !== null);
}
