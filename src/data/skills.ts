import type { Lang } from '../i18n';

export interface SkillGroup {
  title: Record<Lang, string>;
  skills: Record<Lang, string[]>;
}

export const skillGroups: SkillGroup[] = [
  {
    title: {
      es: 'Lenguajes & Herramientas',
      en: 'Languages & Tools',
    },
    skills: {
      es: ['Python', 'R', 'SQL', 'Excel Avanzado', 'VBA', 'Git'],
      en: ['Python', 'R', 'SQL', 'Advanced Excel', 'VBA', 'Git'],
    },
  },
  {
    title: {
      es: 'Ciencia Actuarial',
      en: 'Actuarial Science',
    },
    skills: {
      es: ['Seguros de Vida', 'Seguros de Danos', 'Reservas', 'Regulacion (LISF)', 'Tablas de Mortalidad'],
      en: ['Life Insurance', 'Property Insurance', 'Reserves', 'Regulation (LISF)', 'Mortality Tables'],
    },
  },
  {
    title: {
      es: 'Analisis de Datos',
      en: 'Data Analysis',
    },
    skills: {
      es: ['Machine Learning', 'Simulacion Montecarlo', 'Inferencia Bayesiana', 'GLM', 'Visualizacion'],
      en: ['Machine Learning', 'Monte Carlo Simulation', 'Bayesian Inference', 'GLM', 'Visualization'],
    },
  },
  {
    title: {
      es: 'Finanzas Cuantitativas',
      en: 'Quantitative Finance',
    },
    skills: {
      es: ['Derivados', 'Portafolios (Markowitz)', 'VaR', 'Curvas Forward', 'Matematicas Financieras'],
      en: ['Derivatives', 'Portfolios (Markowitz)', 'VaR', 'Forward Curves', 'Financial Mathematics'],
    },
  },
];

export function getSkillGroups(lang: Lang) {
  return skillGroups.map((g) => ({
    title: g.title[lang],
    skills: g.skills[lang],
  }));
}
