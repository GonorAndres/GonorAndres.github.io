import type { Lang } from '../i18n';

export type ProjectCategory = 'actuarial' | 'data-science' | 'data-engineering' | 'quant-finance' | 'applied-math';

export interface Project {
  slug: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  url: string;           // primary link: live app, Drive folder, Colab, or GitHub if no live version
  repo?: string;         // GitHub repo URL — only set when url points to a live deployment
  platform: 'GitHub' | 'Drive' | 'Vercel' | 'Colab' | 'GCP';
  category: ProjectCategory;
  tags: Record<Lang, string[]>;
  variant: 'standard' | 'tall' | 'wide';
  screenshot?: string;
  relatedTo?: string[];
  blogSlug?: string;     // English slug of the blog post for this project (e.g. 'sima', 'actuarial-ml-pricing')
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
      es: 'Plataforma de modelación actuarial de punta a punta para seguros de vida: proyección de mortalidad Lee-Carter con datos demográficos, tablas de conmutación, valuación de reservas para tres productos (temporal, vitalicio, dotal) y cálculo de requerimientos de capital por solvencia (RCS) con pruebas de estrés bajo regulación mexicana (LISF, CUSF). Motor de cálculo en Python con API REST desplegada en Google Cloud.',
      en: 'End-to-end actuarial modeling platform for life insurance: Lee-Carter mortality projection from demographic data, commutation tables, reserve valuation for three products (term, whole life, endowment), and solvency capital requirement (SCR) calculations with stress testing under Mexican regulation (LISF, CUSF). Python calculation engine with REST API deployed on Google Cloud.',
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
      es: 'Sistema interactivo de clasificación y tarificación de siniestros de seguros de Gastos Médicos Mayores. Análisis de 5.1M siniestros y 95.9M asegurados-año (2020-2024). Proyecto académico UNAM.',
      en: 'Interactive system for classifying and pricing Major Medical Expenses insurance claims. Analysis of 5.1M claims and 95.9M insured-years (2020-2024). UNAM academic project.',
    },
    url: 'https://gmm-explorer.vercel.app/contexto',
    repo: 'https://github.com/GonorAndres/gmm-explorer',
    platform: 'Vercel',
    category: 'actuarial',
    tags: {
      es: ['Next.js', 'Actuaría', 'GMM', 'Tarificación', 'CNSF'],
      en: ['Next.js', 'Actuarial', 'GMM', 'Pricing', 'CNSF'],
    },
    variant: 'wide',
    screenshot: '/screenshots/gmm-explorer.png',
    relatedTo: ['sima', 'life-insurance', 'property-insurance', 'data-analyst-portfolio'],
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
      es: '7 proyectos end-to-end de análisis de datos: cohortes de e-commerce, reservas actuariales, pruebas A/B, KPIs ejecutivos, portafolio financiero y eficiencia operacional. SQL, Python, Streamlit, Next.js y Power BI.',
      en: '7 end-to-end data analysis projects: e-commerce cohorts, actuarial reserves, A/B testing, executive KPIs, financial portfolio, and operational efficiency. SQL, Python, Streamlit, Next.js, and Power BI.',
    },
    url: '/blog/data-analyst-portfolio/',
    repo: 'https://github.com/GonorAndres/data-analyst-path',
    platform: 'GCP',
    category: 'data-science',
    tags: {
      es: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
      en: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
    },
    variant: 'wide',
    screenshot: '/screenshots/data-analyst-portafolio.png',
    relatedTo: ['sima', 'gmm-explorer', 'ab-testing', 'credit-risk'],
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
      es: 'Machine learning con 85.19% de precisión (AUC) para predecir incumplimiento en préstamos. GLM en Python con 32,000+ registros.',
      en: 'Machine learning with 85.19% AUC to predict loan defaults. GLM in Python with 32,000+ records.',
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
      es: 'Evaluación de tasa de conversión con métodos frecuentistas y bayesianos, incluyendo PyMC y distribución Beta.',
      en: 'Conversion rate evaluation using frequentist and Bayesian methods, including PyMC and Beta distribution.',
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
      es: 'Aplicación R Shiny que estima la pensión de retiro bajo Ley 73, Ley 97 y el Fondo de Pensiones para el Bienestar (2024). Incluye proyección de saldo AFORE, elegibilidad al complemento del Fondo Bienestar y análisis de sensibilidad bajo escenarios conservador, base y optimista.',
      en: 'R Shiny app that estimates Mexican retirement pension under Ley 73, Ley 97, and the Fondo de Pensiones para el Bienestar (2024). Includes AFORE balance projection, Fondo Bienestar eligibility check, and sensitivity analysis under conservative, base, and optimistic scenarios.',
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
      es: 'Documento técnico sobre seguro de vida individual ajustado a regulación mexicana (Circular Única y LISF).',
      en: 'Technical document on individual life insurance adjusted to Mexican regulation (Circular Única and LISF).',
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
      es: 'Seguro de daños para autos con datos de la CNSF. Nota técnica comparativa con ramo vida y cotizador en Excel.',
      en: 'Auto property insurance with CNSF data. Comparative technical note with life insurance and Excel quoter.',
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
      es: 'Análisis del mercado de divisas: curva forward, precios forwards, spread bid/offer y superficie de volatilidad.',
      en: 'Currency market analysis: forward curve, forward prices, bid/offer spread and volatility surface.',
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
      es: 'Teoría moderna de portafolios con 10 activos del mercado mexicano, logrando 110% de rendimiento anualizado en prueba.',
      en: 'Modern portfolio theory with 10 Mexican market assets, achieving 110% annualized return in test period.',
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
      es: 'Estudio de la población de Michoacán usando datos del censo 2020 de INEGI: mortalidad, fecundidad y estructura por edades.',
      en: 'Population study of Michoacan using INEGI 2020 census data: mortality, fertility and age structure.',
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
      es: 'Limpieza de base de deuda pública del Gobierno CDMX. Reconstrucción de tasa TIIE con funciones avanzadas de Excel.',
      en: 'Public debt database cleaning for Mexico City Government. TIIE rate reconstruction with advanced Excel functions.',
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
      es: 'Simulación Montecarlo aplicada a Texas Hold\'em para estimar probabilidades de mano por fuerza bruta computacional. Demuestra convergencia de la simulación, intervalos de confianza sobre las estimaciones y cómo la metodología se extiende a pricing y análisis de riesgo.',
      en: 'Monte Carlo simulation applied to Texas Hold\'em to estimate hand probabilities through computational brute force. Demonstrates simulation convergence, confidence intervals on estimates, and how the methodology extends to derivatives pricing and risk analysis.',
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
      es: 'Herramienta dinámica en Excel para construir y comparar tablas de amortización bajo distintos esquemas de pago. Permite ajustar monto, tasa y plazo para analizar cómo cambia la distribución entre capital e intereses a lo largo del crédito.',
      en: 'Dynamic Excel tool for building and comparing amortization schedules under different payment schemes. Adjust principal, rate, and term to analyze how the split between capital and interest evolves over the life of a loan.',
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
      es: 'Librería actuarial en Python con 6 fases completas: tablas de mortalidad EMSSA-09, primas de seguros de vida (temporal, vitalicio, dotal), reservas técnicas, reaseguro (Chain Ladder, Bornhuetter-Ferguson, Bootstrap), cálculo de RCS bajo LISF y reportes trimestrales CNSF automatizados. Cobertura de tests superior al 90%.',
      en: 'Python actuarial library with 6 complete phases: EMSSA-09 mortality tables, life insurance premiums (term, whole, endowment), technical reserves, reinsurance (Chain Ladder, Bornhuetter-Ferguson, Bootstrap), RCS capital requirements under LISF, and automated CNSF quarterly reports. Over 90% test coverage.',
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
    relatedTo: ['sima', 'life-insurance', 'property-insurance'],
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
      es: 'Dashboard actuarial completo para análisis de cartera de seguro de autos: 140K pólizas sintéticas calibradas al mercado mexicano (AMIS/CONDUSEF), motor de tarificación GLM de dos partes (Poisson frecuencia + Gamma severidad), reservas IBNR (Chain Ladder y Bornhuetter-Ferguson), pruebas de estrés Monte Carlo con VaR/TVaR, y detección de fraude por distancia de Mahalanobis. 17 módulos R con arquitectura bslib.',
      en: 'Full actuarial dashboard for auto insurance portfolio analysis: 140K synthetic policies calibrated to the Mexican market (AMIS/CONDUSEF), two-part GLM pricing engine (Poisson frequency + Gamma severity), IBNR reserves (Chain Ladder and Bornhuetter-Ferguson), Monte Carlo stress testing with VaR/TVaR, and Mahalanobis-based fraud detection. 17 R modules with bslib architecture.',
    },
    url: 'https://cartera-autos-451451662791.us-central1.run.app',
    repo: 'https://github.com/GonorAndres/CarteraSeguroAutos',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib'],
      en: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib'],
    },
    variant: 'wide',
    screenshot: '/screenshots/cartera-autos.png',
    blogSlug: 'cartera-autos',
    relatedTo: ['pension-simulator', 'sima', 'property-insurance'],
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
      es: 'Transformer character-level entrenado con los 7 volúmenes de En busca del tiempo perdido, construido desde cero en PyTorch. El proyecto no es sobre literatura, es sobre entender qué pasa realmente dentro de un modelo de lenguaje: embeddings, atención multi-cabeza y por qué todo es multiplicación de matrices.',
      en: 'Character-level transformer trained on all 7 volumes of In Search of Lost Time, built from scratch in PyTorch. The project is not about literature but about understanding what actually happens inside a language model: embeddings, multi-head attention, and why everything is matrix multiplication.',
    },
    url: 'https://github.com/GonorAndres/proust-attention',
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
      en: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
    },
    variant: 'standard',
    relatedTo: ['lisf-agent'],
    blogSlug: 'proust-attention-machine',
  },

  // repo: no GitHub repo — code lives only on the GCP VM
  // local: /home/andtega349/lisf-agent
  // live: TODO — currently accessible only via SSH tunnel to GCP VM (port 8000), not publicly exposed yet
  // source: LISF PDF from https://www.diputados.gob.mx/LeyesBiblio/pdf/LISF.pdf
  {
    slug: 'lisf-agent',
    title: {
      es: 'Agente LISF - Consultor Regulatorio',
      en: 'LISF Agent - Regulatory Consultant',
    },
    description: {
      es: 'Chatbot regulatorio construido con el Claude Agent SDK que responde preguntas sobre la Ley de Instituciones de Seguros y Fianzas (LISF). Indexa el texto completo de la ley y genera respuestas contextualizadas con referencias al artículo correspondiente. Backend FastAPI desplegado en GCP.',
      en: 'Regulatory chatbot built with the Claude Agent SDK that answers questions about the Mexican Insurance and Surety Law (LISF). Indexes the full law text and generates contextualized responses with article references. FastAPI backend deployed on GCP.',
    },
    url: 'https://lisf-agent-451451662791.us-central1.run.app',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Claude SDK', 'FastAPI', 'LISF', 'Python', 'GCP'],
      en: ['Claude SDK', 'FastAPI', 'LISF', 'Python', 'GCP'],
    },
    variant: 'standard',
    screenshot: '/screenshots/lisf-agent.png',
    relatedTo: ['sima'],
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
      es: '6 proyectos que construyen una plataforma de datos completa sobre GCP: warehouse dimensional en BigQuery, orquestación con Dagster y Cloud Run ($0.10/mes vs $400/mes de Composer), streaming con Pub/Sub y Apache Beam, infraestructura como código con Terraform (24 recursos, 6 módulos), y pricing actuarial con GLM Tweedie. Toda la plataforma opera por menos de $10 al mes.',
      en: '6 projects building a complete data platform on GCP: dimensional warehouse in BigQuery, orchestration with Dagster and Cloud Run ($0.10/mo vs $400/mo Composer), streaming with Pub/Sub and Apache Beam, infrastructure as code with Terraform (24 resources, 6 modules), and actuarial pricing with Tweedie GLM. The entire platform runs for under $10/month.',
    },
    url: '/blog/data-engineering-platform/',
    repo: 'https://github.com/GonorAndres/data-engineer-path',
    platform: 'GCP',
    category: 'data-engineering',
    tags: {
      es: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'GLM Tweedie'],
      en: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'Tweedie GLM'],
    },
    variant: 'wide',
    screenshot: '/screenshots/data-engineering-platform.png',
    relatedTo: ['sima', 'insurance-pricing-ml', 'data-analyst-portfolio'],
    blogSlug: 'data-engineering-platform',
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
      es: 'Pipeline completo de tarificación actuarial: GLMs Poisson/Gamma para frecuencia-severidad, XGBoost y LightGBM con tuning Optuna, interpretabilidad SHAP, auditoría de fairness por género/edad, tracking MLflow. Backend FastAPI y dashboard interactivo Next.js.',
      en: 'Complete actuarial pricing pipeline: Poisson/Gamma GLMs for frequency-severity, XGBoost and LightGBM with Optuna tuning, SHAP interpretability, gender/age fairness audit, MLflow tracking. FastAPI backend and interactive Next.js dashboard.',
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
      es: 'Visualización interactiva de árboles B implementada en Rust y compilada a WebAssembly. Surge del estudio de índices en PostgreSQL: anima inserciones, búsquedas y divisiones de nodos para demostrar visualmente por qué los árboles B garantizan búsqueda O(log n) en almacenamiento en disco.',
      en: 'Interactive B-tree visualization implemented in Rust and compiled to WebAssembly. Born from studying PostgreSQL indexes: animates insertions, searches, and node splits to visually demonstrate why B-trees guarantee O(log n) search on disk-based storage.',
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
  },

  // repo: https://github.com/GonorAndres/learning-posgre
  // local: /home/andtega349/learning_posgre
  // source: Russian Airlines open dataset (~2.5GB, 8 relational tables) — available on Kaggle
  {
    slug: 'flight-analytics',
    title: {
      es: 'Análisis de Vuelos - SQL a Escala',
      en: 'Flight Analytics - SQL at Scale',
    },
    description: {
      es: 'Análisis de 2.5GB de datos reales de vuelos de aerolíneas rusas en PostgreSQL: 8 tablas relacionales, millones de registros. Identifica rutas con mayor tasa de retraso, patrones por franja horaria y oportunidades de optimización de flota con consultas SQL avanzadas.',
      en: 'Analysis of 2.5GB of real Russian airline flight data in PostgreSQL: 8 relational tables, millions of records. Identifies routes with the highest delay rates, time-of-day patterns, and fleet optimization opportunities using advanced SQL queries.',
    },
    url: 'https://github.com/GonorAndres/learning-posgre',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['PostgreSQL', 'SQL', 'Análisis Operacional'],
      en: ['PostgreSQL', 'SQL', 'Operational Analytics'],
    },
    variant: 'standard',
    relatedTo: ['data-analyst-portfolio', 'credit-risk'],
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
      es: 'Análisis de series de tiempo aplicado a datos históricos de erupciones volcánicas. Ajusta modelos de pronóstico (ARIMA, suavizamiento exponencial) para estimar frecuencia de eventos, evalúa intervalos de predicción y discute los límites inherentes de pronosticar fenómenos geofísicos extremos.',
      en: 'Time series analysis applied to historical volcanic eruption data. Fits forecasting models (ARIMA, exponential smoothing) to estimate event frequency, evaluates prediction intervals, and discusses the inherent limits of forecasting extreme geophysical events.',
    },
    url: 'https://github.com/GonorAndres/forecasting',
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['Python', 'Series de Tiempo', 'ARIMA', 'Pronóstico'],
      en: ['Python', 'Time Series', 'ARIMA', 'Forecasting'],
    },
    variant: 'standard',
    relatedTo: ['michoacan', 'ab-testing'],
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
      es: 'Método numérico para resolver ecuaciones diferenciales ordinarias de primer orden, implementado en Python. Incluye demostración del teorema de existencia y unicidad (Picard-Lindelöf) y análisis del error de discretización.',
      en: 'Numerical method for solving first-order ordinary differential equations, implemented in Python. Includes existence and uniqueness theorem proof (Picard-Lindelöf) and discretization error analysis.',
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
      es: '5.74M filas de datos reales de aerolíneas analizados en PostgreSQL 16, migrados a BigQuery con pipeline ETL en Python, y comparación documentada de rendimiento entre ambos sistemas. Incluye optimización de consultas (13x-1,300x más rápido), 6 scripts de internals avanzados (EXPLAIN, particionamiento, VACUUM, WAL), análisis geoespacial con haversine/ST_DISTANCE, y notebook interactivo con mapas de rutas.',
      en: '5.74M rows of real airline data analyzed in PostgreSQL 16, migrated to BigQuery via Python ETL pipeline, with documented performance comparison between both systems. Includes query optimization (13x-1,300x speedups), 6 advanced internals scripts (EXPLAIN, partitioning, VACUUM, WAL), geospatial analysis with haversine/ST_DISTANCE, and interactive notebook with route maps.',
    },
    url: 'https://github.com/GonorAndres/learning-posgre',
    platform: 'GitHub',
    category: 'data-engineering',
    tags: {
      es: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Plotly', 'Folium', 'GIS'],
      en: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Plotly', 'Folium', 'GIS'],
    },
    variant: 'wide',
    screenshot: '/screenshots/flight-analytics-pg-bq.png',
    relatedTo: ['data-engineering-platform', 'data-analyst-portfolio'],
    blogSlug: 'flight-analytics-pg-bq',
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
      es: '13 proyectos progresivos de análisis de riesgos financieros: desde VaR y Monte Carlo hasta deep hedging, GNN para contagio sistémico y RL para gestión de portafolios. 192 pruebas, 25,000+ líneas de Python tipado con documentación LaTeX completa.',
      en: '13 progressive financial risk analysis projects: from VaR and Monte Carlo to deep hedging, GNN for systemic contagion, and RL for portfolio management. 192 tests, 25,000+ lines of typed Python with full LaTeX documentation.',
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
