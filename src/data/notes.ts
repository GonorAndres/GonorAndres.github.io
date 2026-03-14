import type { Lang } from '../i18n';

export type NoteCategory = 'actuarial' | 'quant' | 'stats';

export const noteCategories = ['actuarial', 'quant', 'stats'] as const;

export const noteCategoryLabels: Record<Lang, Record<NoteCategory, string>> = {
  es: {
    actuarial: 'Ciencia Actuarial y Seguros',
    quant: 'Finanzas Cuantitativas',
    stats: 'Estadistica y Probabilidad',
  },
  en: {
    actuarial: 'Actuarial Science & Insurance',
    quant: 'Quantitative Finance',
    stats: 'Statistics & Probability',
  },
};

export interface NoteLink {
  label: Record<Lang, string>;
  url: string;
}

export interface Note {
  slug: string;
  category: NoteCategory;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  urls: NoteLink[];
  tags: Record<Lang, string[]>;
  keywords: Record<Lang, string[]>;
  createdDate: string;
  version: string;
  relatedNotes?: string[];
}

export const categoryOrder: NoteCategory[] = ['actuarial', 'quant', 'stats'];

export const notes: Note[] = [
  // ── Actuarial Science & Insurance ────────────────────────────────
  {
    slug: 'soa-exam-p-reference',
    category: 'actuarial',
    createdDate: '2026-02-18',
    version: '24',
    title: {
      es: 'SOA Exam P -- Referencia Completa de Estudio (v2)',
      en: 'SOA Exam P -- Complete Study Reference (v2)',
    },
    description: {
      es: 'La referencia que construi para prepararme al Examen P. Cubre probabilidad general, variables aleatorias y distribuciones multivariadas, cada tema con intuicion actuarial, no solo formulas. Incluye problemas resueltos con analisis de por que los distractores enganan.',
      en: 'The reference I built to prepare for Exam P. Covers general probability, random variables, and multivariate distributions, each topic with actuarial intuition, not just formulas. Includes solved problems with analysis of why the distractors mislead.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view' },
    ],
    tags: {
      es: ['SOA', 'Examen P', 'Probabilidad', 'Actuaria'],
      en: ['SOA', 'Exam P', 'Probability', 'Actuarial'],
    },
    keywords: {
      es: ['SOA Exam P', 'probabilidad actuarial', 'guia de estudio', 'variables aleatorias', 'distribuciones'],
      en: ['SOA Exam P', 'actuarial probability', 'study reference', 'random variables', 'distributions'],
    },
    relatedNotes: ['eves-law-total-variance', 'glm-actuarial-models'],
  },
  {
    slug: 'glm-actuarial-models',
    category: 'actuarial',
    createdDate: '2025-08-09',
    version: '13',
    title: {
      es: 'GLM para Modelos Actuariales',
      en: 'GLM for Actuarial Models',
    },
    description: {
      es: 'De la teoria a la produccion: como las aseguradoras realmente estiman frecuencia de siniestros, severidad y caida de polizas. Este apunte recorre desde la familia exponencial y funciones liga hasta validacion con curvas ROC, coeficiente de Gini y tablas de relatividad. Tres casos de estudio completos: autos, vida y riesgos de trabajo. Apunte personal de sintesis actuarial.',
      en: 'From theory to production: how insurers actually estimate claim frequency, severity, and policy lapse. This note walks from exponential families and link functions through validation with ROC curves, Gini coefficients, and relativity tables. Three full case studies: auto, life, and workers\' comp. Personal actuarial synthesis note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1jJ2eJ9ceVogmDLPf6nAtY4JAo-XEiAOE/view?usp=sharing' },
    ],
    tags: {
      es: ['GLM', 'Actuaria', 'Seguros'],
      en: ['GLM', 'Actuarial', 'Insurance'],
    },
    keywords: {
      es: ['modelos lineales generalizados', 'GLM actuarial', 'frecuencia siniestros', 'severidad', 'tarificacion seguros'],
      en: ['generalized linear models', 'actuarial GLM', 'claim frequency', 'severity', 'insurance pricing'],
    },
    relatedNotes: ['soa-exam-p-reference', 'lee-carter-mortality'],
  },
  {
    slug: 'eves-law-total-variance',
    category: 'actuarial',
    createdDate: '2026-02-11',
    version: '10',
    title: {
      es: 'Ley de Eve y Varianza Total',
      en: 'Eve\'s Law and Total Variance',
    },
    description: {
      es: 'Documento puente que conecta la Ley de Adam, la Ley de Eve, distribuciones mixtas (Poisson-Gamma, exponencial mixta) y distribuciones compuestas. Incluye problemas resueltos estilo SOA con analisis de por que cada distractor esta mal. La pieza que une la varianza condicional con la teoria de credibilidad.',
      en: 'Bridge document connecting Adam\'s Law, Eve\'s Law, mixed distributions (Poisson-Gamma, mixed exponential), and compound distributions. Includes SOA-style solved problems with analysis of why each distractor fails. The piece that links conditional variance to credibility theory.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I3buEoYKAmP_CyMkUgCUfgOI4oBfNFuZ/view' },
    ],
    tags: {
      es: ['Varianza Total', 'Credibilidad', 'SOA'],
      en: ['Total Variance', 'Credibility', 'SOA'],
    },
    keywords: {
      es: ['ley de Eve', 'varianza total', 'distribuciones mixtas', 'credibilidad actuarial', 'Poisson-Gamma'],
      en: ['Eve\'s Law', 'total variance', 'mixed distributions', 'actuarial credibility', 'Poisson-Gamma'],
    },
    relatedNotes: ['soa-exam-p-reference', 'glm-actuarial-models'],
  },
  {
    slug: 'lee-carter-mortality',
    category: 'actuarial',
    createdDate: '2026-02-15',
    version: '8',
    title: {
      es: 'Reestimacion de Mortalidad Lee-Carter',
      en: 'Lee-Carter Mortality Reestimation',
    },
    description: {
      es: 'Reestimacion del modelo Lee-Carter con datos de mortalidad mexicanos. Descomposicion SVD de la matriz de tasas, proyeccion temporal del indice kappa, y su implicacion directa para tablas de vida y reservas de seguros de personas. Conecta la demografia con la practica actuarial.',
      en: 'Lee-Carter model reestimation using Mexican mortality data. SVD decomposition of the rate matrix, time projection of the kappa index, and its direct implication for life tables and life insurance reserves. Connects demography to actuarial practice.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I7F_-OYYXLS1H0hYMJJPBdNGxGKUr6x0/view' },
    ],
    tags: {
      es: ['Mortalidad', 'Lee-Carter', 'SVD', 'Tablas de Vida'],
      en: ['Mortality', 'Lee-Carter', 'SVD', 'Life Tables'],
    },
    keywords: {
      es: ['Lee-Carter', 'mortalidad Mexico', 'SVD', 'tablas de vida', 'reservas seguros'],
      en: ['Lee-Carter', 'Mexican mortality', 'SVD', 'life tables', 'insurance reserves'],
    },
    relatedNotes: ['glm-actuarial-models'],
  },
  // ── Quantitative Finance ─────────────────────────────────────────
  {
    slug: 'black-scholes-fra-irs',
    category: 'quant',
    createdDate: '2025-06-15',
    version: '11',
    title: {
      es: 'Black-Scholes, FRA & IRS',
      en: 'Black-Scholes, FRA & IRS',
    },
    description: {
      es: 'Un solo documento que conecta cuatro mundos: como ponerle precio a lo que nadie sabe cuanto vale (derivados exoticos), como leer el futuro en las curvas de tasas del Tesoro, como dos empresas pueden intercambiar riesgo con un swap, y como armar un portafolio que no dependa de la suerte. Todo resuelto con Python y atado por la misma logica de no-arbitraje. Examen integrador de Metodos Cuantitativos en Finanzas, UNAM.',
      en: 'One document tying four worlds together: how to price what nobody knows the value of (exotic derivatives), how to read the future in Treasury yield curves, how two firms can swap risk through an IRS, and how to build a portfolio that doesn\'t rely on luck. All solved in Python and bound by the same no-arbitrage logic. Integrative exam for Quantitative Methods in Finance, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1trkP2RDp5ZIEynS8-rV4rkADdzfdhPuW/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
      en: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
    },
    keywords: {
      es: ['Black-Scholes', 'FRA', 'IRS', 'derivados financieros', 'no-arbitraje', 'Python finanzas'],
      en: ['Black-Scholes', 'FRA', 'IRS', 'financial derivatives', 'no-arbitrage', 'Python finance'],
    },
    relatedNotes: ['black-scholes-log-normal', 'parametric-returns-fitting'],
  },
  {
    slug: 'black-scholes-log-normal',
    category: 'quant',
    createdDate: '2025-06-27',
    version: '18',
    title: {
      es: 'Black-Scholes y la Log-Normal',
      en: 'Black-Scholes and the Log-Normal',
    },
    description: {
      es: 'Por que la volatilidad no es solo ruido sino una fuerza que separa la mediana del promedio, y como eso hace que las opciones valgan mas de lo que la intuicion sugiere. Un recorrido por el movimiento browniano geometrico, la distribucion del precio terminal y el efecto del "volatility drag". Apunte personal de finanzas cuantitativas.',
      en: 'Why volatility isn\'t just noise but a force that pulls the median away from the mean, and how that makes options worth more than intuition suggests. A walkthrough of geometric Brownian motion, the terminal price distribution, and the "volatility drag" effect. Personal quantitative finance note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/10jLATDsw39CHDKb7T04gqy3GUezJRx6D/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'Log-Normal', 'Volatilidad'],
      en: ['Black-Scholes', 'Log-Normal', 'Volatility'],
    },
    keywords: {
      es: ['Black-Scholes', 'log-normal', 'volatilidad', 'movimiento browniano', 'precio opciones'],
      en: ['Black-Scholes', 'log-normal', 'volatility', 'Brownian motion', 'option pricing'],
    },
    relatedNotes: ['black-scholes-fra-irs', 'parametric-returns-fitting'],
  },
  {
    slug: 'parametric-returns-fitting',
    category: 'quant',
    createdDate: '2025-06-16',
    version: '11',
    title: {
      es: 'Ajuste Parametrico de Rendimientos Financieros',
      en: 'Parametric Fitting of Financial Returns',
    },
    description: {
      es: 'El camino completo para modelar rendimientos: desde elegir entre normal y log-normal, pasando por momentos y maxima verosimilitud, hasta llegar al VaR parametrico. Con pruebas de bondad de ajuste, Q-Q plots y criterios de informacion para no quedarse solo con la primera distribucion que parezca funcionar. Apunte del curso de Mercados Financieros, UNAM.',
      en: 'The full path to modeling returns: from choosing between normal and log-normal, through moments and maximum likelihood, all the way to parametric VaR. With goodness-of-fit tests, Q-Q plots, and information criteria so you don\'t settle for the first distribution that looks right. Financial Markets course note, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1229dImQ9xEY2tZdh4Wr5KIyNUIRgv3Vz/view?usp=sharing' },
    ],
    tags: {
      es: ['VaR', 'MLE', 'Finanzas'],
      en: ['VaR', 'MLE', 'Finance'],
    },
    keywords: {
      es: ['VaR parametrico', 'maxima verosimilitud', 'rendimientos financieros', 'bondad de ajuste', 'Q-Q plot'],
      en: ['parametric VaR', 'maximum likelihood', 'financial returns', 'goodness of fit', 'Q-Q plot'],
    },
    relatedNotes: ['black-scholes-fra-irs', 'black-scholes-log-normal'],
  },
  // ── Statistics & Probability ─────────────────────────────────────
  {
    slug: 'ab-testing-bayesian-frequentist',
    category: 'stats',
    createdDate: '2025-06-15',
    version: '10',
    title: {
      es: 'A/B Testing: Bayesiano vs Frecuentista',
      en: 'A/B Testing: Bayesian vs Frequentist',
    },
    description: {
      es: 'La misma pregunta, dos formas de pensar: el enfoque clasico dice que no hay evidencia suficiente, el bayesiano dice que casi seguro B es mejor. Este resumen explora que pasa cuando dejas de depender solo del p-valor y empiezas a pensar en utilidad esperada para decidir. Proyecto personal de exploracion estadistica. Disponible en ambos idiomas.',
      en: 'Same question, two ways of thinking: the classical approach says there\'s not enough evidence, the Bayesian one says B is almost certainly better. This summary explores what happens when you stop relying solely on the p-value and start thinking in terms of expected utility to decide. Personal statistical exploration project. Available in both languages.',
    },
    urls: [
      { label: { es: 'Resumen ES', en: 'Resumen ES' }, url: 'https://drive.google.com/file/d/1i-9ZWjJieLJnb3CnEEdb4FKQd_cIKFff/view?usp=drive_link' },
      { label: { es: 'Summary EN', en: 'Summary EN' }, url: 'https://drive.google.com/file/d/1kguG7XKBYd6OLJ3nI1z-Syt7Ozcq0mUB/view?usp=drive_link' },
    ],
    tags: {
      es: ['Estadistica', 'Bayes', 'Python'],
      en: ['Statistics', 'Bayes', 'Python'],
    },
    keywords: {
      es: ['A/B testing', 'bayesiano vs frecuentista', 'p-valor', 'utilidad esperada', 'pruebas de hipotesis'],
      en: ['A/B testing', 'Bayesian vs frequentist', 'p-value', 'expected utility', 'hypothesis testing'],
    },
    relatedNotes: ['volcanic-eruption-forecasting'],
  },
  {
    slug: 'time-series-delhi',
    category: 'stats',
    createdDate: '2025-06-15',
    version: '16',
    title: {
      es: 'Series de Tiempo: Temperatura en Delhi',
      en: 'Time Series: Delhi Temperature',
    },
    description: {
      es: 'Cinco anos de temperatura en Delhi contados por los datos: encontrar el patron estacional escondido en el ruido, separar lo que es tendencia real de lo que es variacion aleatoria, y construir un modelo en R que pueda anticipar lo que viene. El tipo de ejercicio donde la estadistica deja de ser abstracta y se vuelve clima. Proyecto del curso de Analisis de Supervivencia y Series de Tiempo, UNAM.',
      en: 'Five years of Delhi temperature told through data: finding the seasonal pattern hidden in the noise, separating real trend from random variation, and building a model in R that can anticipate what comes next. The kind of exercise where statistics stops being abstract and becomes weather. Course project for Survival Analysis and Time Series, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1-t7sihOVxHWceLPPOFnZBDrdhkBsXKmP/view?usp=drive_link' },
    ],
    tags: {
      es: ['R', 'Series de Tiempo', 'ARIMA'],
      en: ['R', 'Time Series', 'ARIMA'],
    },
    keywords: {
      es: ['series de tiempo', 'ARIMA', 'estacionalidad', 'R', 'temperatura Delhi'],
      en: ['time series', 'ARIMA', 'seasonality', 'R', 'Delhi temperature'],
    },
    relatedNotes: ['volcanic-eruption-forecasting'],
  },
  {
    slug: 'volcanic-eruption-forecasting',
    category: 'stats',
    createdDate: '2025-07-30',
    version: '12',
    title: {
      es: 'Prediccion Probabilistica de Erupciones Volcanicas',
      en: 'Probabilistic Forecasting of Volcanic Eruptions',
    },
    description: {
      es: 'Que tienen en comun un actuario y un vulcanologo? Que ambos intentan predecir eventos raros con consecuencias enormes. Este apunte revisa como se modelan los intervalos entre erupciones del Popocatepetl y el Galeras con distribuciones log-normal, modelos de Markov y procesos de renovacion. Las preguntas abiertas al final son genuinamente fascinantes. Apunte personal de probabilidad aplicada.',
      en: 'What do an actuary and a volcanologist have in common? Both try to predict rare events with enormous consequences. This note reviews how eruption intervals for Popocatepetl and Galeras are modeled with log-normal distributions, Markov models, and renewal processes. The open questions at the end are genuinely fascinating. Personal applied probability note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1eaQmrc0HuQ5fXli6E5HQ54N5vRNkFT9o/view?usp=sharing' },
    ],
    tags: {
      es: ['Probabilidad', 'Volcanes', 'Modelos'],
      en: ['Probability', 'Volcanoes', 'Models'],
    },
    keywords: {
      es: ['erupciones volcanicas', 'prediccion probabilistica', 'Popocatepetl', 'procesos de renovacion', 'Markov'],
      en: ['volcanic eruptions', 'probabilistic forecasting', 'Popocatepetl', 'renewal processes', 'Markov'],
    },
    relatedNotes: ['time-series-delhi', 'ab-testing-bayesian-frequentist'],
  },
];

export interface LocalizedNote {
  slug: string;
  category: NoteCategory;
  title: string;
  description: string;
  urls: { label: string; url: string }[];
  tags: string[];
  keywords: string[];
  createdDate: string;
  version: string;
  relatedNotes?: string[];
}

export function getNotes(lang: Lang): LocalizedNote[] {
  return notes.map((n) => ({
    slug: n.slug,
    category: n.category,
    title: n.title[lang],
    description: n.description[lang],
    urls: n.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: n.tags[lang],
    keywords: n.keywords[lang],
    createdDate: n.createdDate,
    version: n.version,
    relatedNotes: n.relatedNotes,
  }));
}

export function getNotesByCategory(lang: Lang): { category: NoteCategory; label: string; notes: Omit<LocalizedNote, 'category'>[] }[] {
  const localized = getNotes(lang);

  return categoryOrder.map((cat) => ({
    category: cat,
    label: noteCategoryLabels[lang][cat],
    notes: localized
      .filter((n) => n.category === cat)
      .map(({ category: _cat, ...rest }) => rest),
  })).filter((g) => g.notes.length > 0);
}

export function getNoteBySlug(slug: string, lang: Lang): LocalizedNote | undefined {
  const note = notes.find((n) => n.slug === slug);
  if (!note) return undefined;
  return {
    slug: note.slug,
    category: note.category,
    title: note.title[lang],
    description: note.description[lang],
    urls: note.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: note.tags[lang],
    keywords: note.keywords[lang],
    createdDate: note.createdDate,
    version: note.version,
    relatedNotes: note.relatedNotes,
  };
}

export function getNoteSlugs(): string[] {
  return notes.map((n) => n.slug);
}
