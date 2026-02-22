import type { Lang } from '../i18n';

export type ProjectCategory = 'actuarial' | 'data-science' | 'quant-finance' | 'applied-math';

export interface Project {
  slug: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  url: string;
  platform: 'GitHub' | 'Drive' | 'Vercel' | 'Colab';
  category: ProjectCategory;
  tags: Record<Lang, string[]>;
  variant: 'standard' | 'tall' | 'wide';
  relatedTo?: string[];
}

export const projects: Project[] = [
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
    platform: 'Vercel',
    category: 'actuarial',
    tags: {
      es: ['Next.js', 'Actuaría', 'GMM', 'Tarificación', 'CNSF'],
      en: ['Next.js', 'Actuarial', 'GMM', 'Pricing', 'CNSF'],
    },
    variant: 'wide',
    relatedTo: ['life-insurance', 'property-insurance'],
  },
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
    relatedTo: ['ab-testing', 'data-cleaning'],
  },
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
    relatedTo: ['credit-risk'],
  },
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
    relatedTo: ['property-insurance', 'michoacan', 'gmm-explorer'],
  },
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
    relatedTo: ['life-insurance', 'gmm-explorer'],
  },
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
    relatedTo: ['markowitz'],
  },
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
    relatedTo: ['derivatives'],
  },
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
    relatedTo: ['life-insurance'],
  },
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
    relatedTo: ['credit-risk'],
  },
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
    relatedTo: ['ab-testing'],
  },
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
    relatedTo: ['derivatives'],
  },
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
    relatedTo: ['michoacan'],
  },
];

export function getProjects(lang: Lang) {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    description: p.description[lang],
    url: p.url,
    platform: p.platform,
    category: p.category,
    tags: p.tags[lang],
    variant: p.variant,
    relatedTo: p.relatedTo,
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
