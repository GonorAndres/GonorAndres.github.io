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
      es: 'Machine learning con 85.19% de precision (AUC) para predecir incumplimiento en prestamos. GLM en Python con 32,000+ registros.',
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
      es: 'Evaluacion de tasa de conversion con metodos frecuentistas y bayesianos, incluyendo PyMC y distribucion Beta.',
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
      es: 'Nota Tecnica - Seguro de Vida',
      en: 'Technical Note - Life Insurance',
    },
    description: {
      es: 'Documento tecnico sobre seguro de vida individual ajustado a regulacion mexicana (Circular Unica y LISF).',
      en: 'Technical document on individual life insurance adjusted to Mexican regulation (Circular Unica and LISF).',
    },
    url: 'https://drive.google.com/drive/folders/1PfotLUbidzwk8gdW4kbqQfLB4PbkuYBj',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaria', 'Seguros', 'Regulacion'],
      en: ['Actuarial', 'Insurance', 'Regulation'],
    },
    variant: 'standard',
    relatedTo: ['property-insurance', 'michoacan', 'gmm-explorer'],
  },
  {
    slug: 'property-insurance',
    title: {
      es: 'Nota Tecnica - Seguro de Danos',
      en: 'Technical Note - Property Insurance',
    },
    description: {
      es: 'Seguro de danos para autos con datos de la CNSF. Nota tecnica comparativa con ramo vida y cotizador en Excel.',
      en: 'Auto property insurance with CNSF data. Comparative technical note with life insurance and Excel quoter.',
    },
    url: 'https://drive.google.com/drive/folders/12tF-Ma_sWtDM5k6zYzNx8btUGS78b-0W',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaria', 'Autos', 'CNSF'],
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
      es: 'Analisis del mercado de divisas: curva forward, precios forwards, spread bid/offer y superficie de volatilidad.',
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
      es: 'Optimizacion de Portafolio - Markowitz',
      en: 'Portfolio Optimization - Markowitz',
    },
    description: {
      es: 'Teoria moderna de portafolios con 10 activos del mercado mexicano, logrando 110% de rendimiento anualizado en prueba.',
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
      es: 'Analisis Demografico - Michoacan',
      en: 'Demographic Analysis - Michoacan',
    },
    description: {
      es: 'Estudio de la poblacion de Michoacan usando datos del censo 2020 de INEGI: mortalidad, fecundidad y estructura por edades.',
      en: 'Population study of Michoacan using INEGI 2020 census data: mortality, fertility and age structure.',
    },
    url: 'https://drive.google.com/drive/folders/1U_KrCv0g6o-JWNv0l6RHoPCWZBr0-exu',
    platform: 'Drive',
    category: 'applied-math',
    tags: {
      es: ['Excel', 'INEGI', 'Demografia'],
      en: ['Excel', 'INEGI', 'Demographics'],
    },
    variant: 'standard',
    relatedTo: ['life-insurance'],
  },
  {
    slug: 'data-cleaning',
    title: {
      es: 'Limpieza de Datos - Deuda Publica CDMX',
      en: 'Data Cleaning - CDMX Public Debt',
    },
    description: {
      es: 'Limpieza de base de deuda publica del Gobierno CDMX. Reconstruccion de tasa TIIE con funciones avanzadas de Excel.',
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
      es: 'Estimacion de probabilidades en Texas Hold\'em usando simulacion Montecarlo para comprender el comportamiento del azar.',
      en: 'Probability estimation in Texas Hold\'em using Monte Carlo simulation to understand randomness behavior.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/TexasPokerCaseStudy',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'Simulacion', 'Probabilidad'],
      en: ['Python', 'Simulation', 'Probability'],
    },
    variant: 'standard',
  },
  {
    slug: 'amortization',
    title: {
      es: 'Tabla de Amortizaciones Dinamica',
      en: 'Dynamic Amortization Table',
    },
    description: {
      es: 'Amortizador en Excel basado en parametros del usuario: monto, tasa y tipo de pago. Proyecto de Matematicas Financieras.',
      en: 'Excel amortization tool based on user parameters: amount, rate and payment type. Financial Mathematics project.',
    },
    url: 'https://drive.google.com/drive/folders/15Zyl2XKcXKnmrrFLtlctQwYeVz_C9EdW',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Excel', 'Amortizacion'],
      en: ['Excel', 'Amortization'],
    },
    variant: 'standard',
  },
  {
    slug: 'euler-method',
    title: {
      es: 'Metodo de Euler - EDOs',
      en: 'Euler Method - ODEs',
    },
    description: {
      es: 'Implementacion del Metodo de Euler para EDOs de primer orden con demostracion de existencia y unicidad (Picard-Lindelof).',
      en: 'Euler Method implementation for first-order ODEs with existence and uniqueness proof (Picard-Lindelof).',
    },
    url: 'https://colab.research.google.com/drive/1g6uDqBaJoHbx2MyNeh2tgP5nwKOgqPkA',
    platform: 'Colab',
    category: 'applied-math',
    tags: {
      es: ['Python', 'EDOs', 'Euler'],
      en: ['Python', 'ODEs', 'Euler'],
    },
    variant: 'standard',
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
