import type { Lang } from '../i18n';

export interface SkillGroup {
  title: Record<Lang, string>;
  skills: Record<Lang, string[]>;
}

export const skillGroups: SkillGroup[] = [
  {
    title: {
      es: 'Lenguajes y Herramientas',
      en: 'Languages & Tools',
    },
    skills: {
      es: ['Python', 'TypeScript', 'R', 'SQL', 'Bash', 'Excel Avanzado', 'Git', 'LaTeX'],
      en: ['Python', 'TypeScript', 'R', 'SQL', 'Bash', 'Advanced Excel', 'Git', 'LaTeX'],
    },
  },
  {
    title: {
      es: 'Cloud & DevOps',
      en: 'Cloud & DevOps',
    },
    skills: {
      es: ['GCP Cloud Run', 'Cloud SQL', 'BigQuery', 'Docker', 'GitHub Actions', 'Secret Manager', 'PostgreSQL'],
      en: ['GCP Cloud Run', 'Cloud SQL', 'BigQuery', 'Docker', 'GitHub Actions', 'Secret Manager', 'PostgreSQL'],
    },
  },
  {
    title: {
      es: 'Ciencia Actuarial',
      en: 'Actuarial Science',
    },
    skills: {
      es: ['Seguros de Vida', 'Seguros de Daños', 'Lee-Carter', 'Reservas (BEL)', 'RCS/SCR', 'Regulación (LISF/CUSF)', 'Tablas de Mortalidad', 'Pensiones IMSS'],
      en: ['Life Insurance', 'Property Insurance', 'Lee-Carter', 'Reserves (BEL)', 'SCR', 'Regulation (LISF/CUSF)', 'Mortality Tables', 'IMSS Pensions'],
    },
  },
  {
    title: {
      es: 'Ciencia de Datos & ML',
      en: 'Data Science & ML',
    },
    skills: {
      es: ['scikit-learn', 'PyTorch', 'XGBoost', 'GLM', 'Simulación Montecarlo', 'Inferencia Bayesiana', 'Pandas', 'Streamlit'],
      en: ['scikit-learn', 'PyTorch', 'XGBoost', 'GLM', 'Monte Carlo Simulation', 'Bayesian Inference', 'Pandas', 'Streamlit'],
    },
  },
  {
    title: {
      es: 'Desarrollo Web & IA',
      en: 'Web Development & AI',
    },
    skills: {
      es: ['FastAPI', 'React', 'Astro', 'Tailwind CSS', 'Claude Code', 'Anthropic API', 'Plotly'],
      en: ['FastAPI', 'React', 'Astro', 'Tailwind CSS', 'Claude Code', 'Anthropic API', 'Plotly'],
    },
  },
  {
    title: {
      es: 'Finanzas Cuantitativas',
      en: 'Quantitative Finance',
    },
    skills: {
      es: ['Derivados', 'Black-Scholes', 'Portafolios (Markowitz)', 'VaR', 'Curvas Forward', 'Matemáticas Financieras'],
      en: ['Derivatives', 'Black-Scholes', 'Portfolios (Markowitz)', 'VaR', 'Forward Curves', 'Financial Mathematics'],
    },
  },
];

export function getSkillGroups(lang: Lang) {
  return skillGroups.map((g) => ({
    title: g.title[lang],
    skills: g.skills[lang],
  }));
}
