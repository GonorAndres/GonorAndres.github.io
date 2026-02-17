import type { Lang } from '../i18n';

export interface NoteLink {
  label: Record<Lang, string>;
  url: string;
}

export interface Note {
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  urls: NoteLink[];
  tags: Record<Lang, string[]>;
}

export const notes: Note[] = [
  {
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
  },
  {
    title: {
      es: 'Series de Tiempo: Temperatura en Delhi',
      en: 'Time Series: Delhi Temperature',
    },
    description: {
      es: 'Cinco anios de temperatura en Delhi contados por los datos: encontrar el patron estacional escondido en el ruido, separar lo que es tendencia real de lo que es variacion aleatoria, y construir un modelo en R que pueda anticipar lo que viene. El tipo de ejercicio donde la estadistica deja de ser abstracta y se vuelve clima. Proyecto del curso de Analisis de Supervivencia y Series de Tiempo, UNAM.',
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    title: {
      es: 'Prediccion Probabilistica de Erupciones Volcanicas',
      en: 'Probabilistic Forecasting of Volcanic Eruptions',
    },
    description: {
      es: 'Que tienen en comun un actuario y un volcanolog? Que ambos intentan predecir eventos raros con consecuencias enormes. Este apunte revisa como se modelan los intervalos entre erupciones del Popocatepetl y el Galeras con distribuciones log-normal, modelos de Markov y procesos de renovacion. Las preguntas abiertas al final son genuinamente fascinantes. Apunte personal de probabilidad aplicada.',
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

export function getNotes(lang: Lang) {
  return notes.map((n) => ({
    title: n.title[lang],
    description: n.description[lang],
    urls: n.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: n.tags[lang],
  }));
}
