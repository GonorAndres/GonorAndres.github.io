import type { Lang } from '../i18n';

export type NoteCategory = 'actuarial' | 'quant' | 'stats';

export interface NoteLink {
  label: Record<Lang, string>;
  url: string;
}

export interface Note {
  category: NoteCategory;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  urls: NoteLink[];
  tags: Record<Lang, string[]>;
}

export const categoryOrder: NoteCategory[] = ['actuarial', 'quant', 'stats'];

export const notes: Note[] = [
  // ── Actuarial Science & Insurance ────────────────────────────────
  {
    category: 'actuarial',
    title: {
      es: 'SOA Exam P -- Referencia Completa de Estudio (v2)',
      en: 'SOA Exam P -- Complete Study Reference (v2)',
    },
    description: {
      es: 'Más de 8,500 líneas cubriendo los tres temas del Examen P: probabilidad general, variables aleatorias univariadas y distribuciones multivariadas. Explicaciones técnicas, intuiciones actuariales y problemas resueltos con análisis de distractores. La referencia con la que preparé mi examen.',
      en: 'Over 8,500 lines covering all three Exam P topics: general probability, univariate random variables, and multivariate distributions. Technical explanations, actuarial intuitions, and solved problems with distractor analysis. The reference I built to prepare for my exam.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view' },
    ],
    tags: {
      es: ['SOA', 'Examen P', 'Probabilidad', 'Actuaría'],
      en: ['SOA', 'Exam P', 'Probability', 'Actuarial'],
    },
  },
  {
    category: 'actuarial',
    title: {
      es: 'GLM para Modelos Actuariales',
      en: 'GLM for Actuarial Models',
    },
    description: {
      es: 'De la teoría a la producción: cómo las aseguradoras realmente estiman frecuencia de siniestros, severidad y caída de pólizas. Este apunte recorre desde la familia exponencial y funciones liga hasta validación con curvas ROC, coeficiente de Gini y tablas de relatividad. Tres casos de estudio completos: autos, vida y riesgos de trabajo. Apunte personal de síntesis actuarial.',
      en: 'From theory to production: how insurers actually estimate claim frequency, severity, and policy lapse. This note walks from exponential families and link functions through validation with ROC curves, Gini coefficients, and relativity tables. Three full case studies: auto, life, and workers\' comp. Personal actuarial synthesis note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1jJ2eJ9ceVogmDLPf6nAtY4JAo-XEiAOE/view?usp=sharing' },
    ],
    tags: {
      es: ['GLM', 'Actuaría', 'Seguros'],
      en: ['GLM', 'Actuarial', 'Insurance'],
    },
  },
  {
    category: 'actuarial',
    title: {
      es: 'Ley de Eve y Varianza Total',
      en: 'Eve\'s Law and Total Variance',
    },
    description: {
      es: 'Documento puente que conecta la Ley de Adam, la Ley de Eve, distribuciones mixtas (Poisson-Gamma, exponencial mixta) y distribuciones compuestas. Incluye problemas resueltos estilo SOA con análisis de por qué cada distractor está mal. La pieza que une la varianza condicional con la teoría de credibilidad.',
      en: 'Bridge document connecting Adam\'s Law, Eve\'s Law, mixed distributions (Poisson-Gamma, mixed exponential), and compound distributions. Includes SOA-style solved problems with analysis of why each distractor fails. The piece that links conditional variance to credibility theory.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I3buEoYKAmP_CyMkUgCUfgOI4oBfNFuZ/view' },
    ],
    tags: {
      es: ['Varianza Total', 'Credibilidad', 'SOA'],
      en: ['Total Variance', 'Credibility', 'SOA'],
    },
  },
  {
    category: 'actuarial',
    title: {
      es: 'Reestimación de Mortalidad Lee-Carter',
      en: 'Lee-Carter Mortality Reestimation',
    },
    description: {
      es: 'Reestimación del modelo Lee-Carter con datos de mortalidad mexicanos. Descomposición SVD de la matriz de tasas, proyección temporal del índice kappa, y su implicación directa para tablas de vida y reservas de seguros de personas. Conecta la demografía con la práctica actuarial.',
      en: 'Lee-Carter model reestimation using Mexican mortality data. SVD decomposition of the rate matrix, time projection of the kappa index, and its direct implication for life tables and life insurance reserves. Connects demography to actuarial practice.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I7F_-OYYXLS1H0hYMJJPBdNGxGKUr6x0/view' },
    ],
    tags: {
      es: ['Mortalidad', 'Lee-Carter', 'SVD', 'Tablas de Vida'],
      en: ['Mortality', 'Lee-Carter', 'SVD', 'Life Tables'],
    },
  },
  // ── Quantitative Finance ─────────────────────────────────────────
  {
    category: 'quant',
    title: {
      es: 'Black-Scholes, FRA & IRS',
      en: 'Black-Scholes, FRA & IRS',
    },
    description: {
      es: 'Un solo documento que conecta cuatro mundos: cómo ponerle precio a lo que nadie sabe cuánto vale (derivados exóticos), cómo leer el futuro en las curvas de tasas del Tesoro, cómo dos empresas pueden intercambiar riesgo con un swap, y cómo armar un portafolio que no dependa de la suerte. Todo resuelto con Python y atado por la misma lógica de no-arbitraje. Examen integrador de Métodos Cuantitativos en Finanzas, UNAM.',
      en: 'One document tying four worlds together: how to price what nobody knows the value of (exotic derivatives), how to read the future in Treasury yield curves, how two firms can swap risk through an IRS, and how to build a portfolio that doesn\'t rely on luck. All solved in Python and bound by the same no-arbitrage logic. Integrative exam for Quantitative Methods in Finance, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1trkP2RDp5ZIEynS8-rV4rkADdzfdhPuW/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
      en: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
    },
  },
  {
    category: 'quant',
    title: {
      es: 'Black-Scholes y la Log-Normal',
      en: 'Black-Scholes and the Log-Normal',
    },
    description: {
      es: 'Por qué la volatilidad no es solo ruido sino una fuerza que separa la mediana del promedio, y cómo eso hace que las opciones valgan más de lo que la intuición sugiere. Un recorrido por el movimiento browniano geométrico, la distribución del precio terminal y el efecto del "volatility drag". Apunte personal de finanzas cuantitativas.',
      en: 'Why volatility isn\'t just noise but a force that pulls the median away from the mean, and how that makes options worth more than intuition suggests. A walkthrough of geometric Brownian motion, the terminal price distribution, and the "volatility drag" effect. Personal quantitative finance note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/10jLATDsw39CHDKb7T04gqy3GUezJRx6D/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'Log-Normal', 'Volatilidad'],
      en: ['Black-Scholes', 'Log-Normal', 'Volatility'],
    },
  },
  {
    category: 'quant',
    title: {
      es: 'Ajuste Paramétrico de Rendimientos Financieros',
      en: 'Parametric Fitting of Financial Returns',
    },
    description: {
      es: 'El camino completo para modelar rendimientos: desde elegir entre normal y log-normal, pasando por momentos y máxima verosimilitud, hasta llegar al VaR paramétrico. Con pruebas de bondad de ajuste, Q-Q plots y criterios de información para no quedarse solo con la primera distribución que parezca funcionar. Apunte del curso de Mercados Financieros, UNAM.',
      en: 'The full path to modeling returns: from choosing between normal and log-normal, through moments and maximum likelihood, all the way to parametric VaR. With goodness-of-fit tests, Q-Q plots, and information criteria so you don\'t settle for the first distribution that looks right. Financial Markets course note, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1229dImQ9xEY2tZdh4Wr5KIyNUIRgv3Vz/view?usp=sharing' },
    ],
    tags: {
      es: ['VaR', 'MLE', 'Finanzas'],
      en: ['VaR', 'MLE', 'Finance'],
    },
  },
  // ── Statistics & Probability ─────────────────────────────────────
  {
    category: 'stats',
    title: {
      es: 'A/B Testing: Bayesiano vs Frecuentista',
      en: 'A/B Testing: Bayesian vs Frequentist',
    },
    description: {
      es: 'La misma pregunta, dos formas de pensar: el enfoque clásico dice que no hay evidencia suficiente, el bayesiano dice que casi seguro B es mejor. Este resumen explora qué pasa cuando dejas de depender solo del p-valor y empiezas a pensar en utilidad esperada para decidir. Proyecto personal de exploración estadística. Disponible en ambos idiomas.',
      en: 'Same question, two ways of thinking: the classical approach says there\'s not enough evidence, the Bayesian one says B is almost certainly better. This summary explores what happens when you stop relying solely on the p-value and start thinking in terms of expected utility to decide. Personal statistical exploration project. Available in both languages.',
    },
    urls: [
      { label: { es: 'Resumen ES', en: 'Resumen ES' }, url: 'https://drive.google.com/file/d/1i-9ZWjJieLJnb3CnEEdb4FKQd_cIKFff/view?usp=drive_link' },
      { label: { es: 'Summary EN', en: 'Summary EN' }, url: 'https://drive.google.com/file/d/1kguG7XKBYd6OLJ3nI1z-Syt7Ozcq0mUB/view?usp=drive_link' },
    ],
    tags: {
      es: ['Estadística', 'Bayes', 'Python'],
      en: ['Statistics', 'Bayes', 'Python'],
    },
  },
  {
    category: 'stats',
    title: {
      es: 'Series de Tiempo: Temperatura en Delhi',
      en: 'Time Series: Delhi Temperature',
    },
    description: {
      es: 'Cinco años de temperatura en Delhi contados por los datos: encontrar el patrón estacional escondido en el ruido, separar lo que es tendencia real de lo que es variación aleatoria, y construir un modelo en R que pueda anticipar lo que viene. El tipo de ejercicio donde la estadística deja de ser abstracta y se vuelve clima. Proyecto del curso de Análisis de Supervivencia y Series de Tiempo, UNAM.',
      en: 'Five years of Delhi temperature told through data: finding the seasonal pattern hidden in the noise, separating real trend from random variation, and building a model in R that can anticipate what comes next. The kind of exercise where statistics stops being abstract and becomes weather. Course project for Survival Analysis and Time Series, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1-t7sihOVxHWceLPPOFnZBDrdhkBsXKmP/view?usp=drive_link' },
    ],
    tags: {
      es: ['R', 'Series de Tiempo', 'ARIMA'],
      en: ['R', 'Time Series', 'ARIMA'],
    },
  },
  {
    category: 'stats',
    title: {
      es: 'Predicción Probabilística de Erupciones Volcánicas',
      en: 'Probabilistic Forecasting of Volcanic Eruptions',
    },
    description: {
      es: '¿Qué tienen en común un actuario y un vulcanólogo? Que ambos intentan predecir eventos raros con consecuencias enormes. Este apunte revisa cómo se modelan los intervalos entre erupciones del Popocatépetl y el Galeras con distribuciones log-normal, modelos de Markov y procesos de renovación. Las preguntas abiertas al final son genuinamente fascinantes. Apunte personal de probabilidad aplicada.',
      en: 'What do an actuary and a volcanologist have in common? Both try to predict rare events with enormous consequences. This note reviews how eruption intervals for Popocatepetl and Galeras are modeled with log-normal distributions, Markov models, and renewal processes. The open questions at the end are genuinely fascinating. Personal applied probability note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1eaQmrc0HuQ5fXli6E5HQ54N5vRNkFT9o/view?usp=sharing' },
    ],
    tags: {
      es: ['Probabilidad', 'Volcanes', 'Modelos'],
      en: ['Probability', 'Volcanoes', 'Models'],
    },
  },
];

export interface LocalizedNote {
  category: NoteCategory;
  title: string;
  description: string;
  urls: { label: string; url: string }[];
  tags: string[];
}

export function getNotes(lang: Lang): LocalizedNote[] {
  return notes.map((n) => ({
    category: n.category,
    title: n.title[lang],
    description: n.description[lang],
    urls: n.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: n.tags[lang],
  }));
}

export function getNotesByCategory(lang: Lang): { category: NoteCategory; label: string; notes: Omit<LocalizedNote, 'category'>[] }[] {
  const localized = getNotes(lang);
  const labelKey: Record<NoteCategory, Record<Lang, string>> = {
    actuarial: { es: 'Ciencia Actuarial y Seguros', en: 'Actuarial Science & Insurance' },
    quant: { es: 'Finanzas Cuantitativas', en: 'Quantitative Finance' },
    stats: { es: 'Estadística y Probabilidad', en: 'Statistics & Probability' },
  };

  return categoryOrder.map((cat) => ({
    category: cat,
    label: labelKey[cat][lang],
    notes: localized
      .filter((n) => n.category === cat)
      .map(({ category: _cat, ...rest }) => rest),
  })).filter((g) => g.notes.length > 0);
}
