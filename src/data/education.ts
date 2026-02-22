import type { Lang } from '../i18n';

export interface Education {
  degree: Record<Lang, string>;
  school: Record<Lang, string>;
  details: Record<Lang, string>;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: Record<Lang, string>;
  url: string;
}

export const education: Education[] = [
  {
    degree: {
      es: 'Licenciatura en Actuaria',
      en: 'B.S. in Actuarial Science',
    },
    school: {
      es: 'Universidad Nacional Autónoma de México (UNAM)',
      en: 'National Autonomous University of Mexico (UNAM)',
    },
    details: {
      es: 'Facultad de Ciencias',
      en: 'Faculty of Sciences',
    },
  },
];

export const certificates: Certificate[] = [
  {
    name: 'Associate Data Analyst (SQL)',
    issuer: 'DataCamp',
    date: { es: 'Ago 2024', en: 'Aug 2024' },
    url: 'https://drive.google.com/file/d/1EqzyjRkWOJBlU9zUTpkcUcj6QtuXRZfK/view?usp=drive_link',
  },
  {
    name: 'Associate Data Scientist R',
    issuer: 'DataCamp',
    date: { es: 'Sep 2024', en: 'Sep 2024' },
    url: 'https://drive.google.com/file/d/1xVLk15A1LBbyXH1fZnd4eBTaJ4d8FLLO/view?usp=drive_link',
  },
  {
    name: 'Data Scientist in R',
    issuer: 'DataCamp',
    date: { es: 'Oct 2024', en: 'Oct 2024' },
    url: 'https://drive.google.com/file/d/1Woe6xqxofloFZ9uM2f5VsdGxY-WQWCRI/view?usp=drive_link',
  },
];

export function getEducation(lang: Lang) {
  return education.map((e) => ({
    degree: e.degree[lang],
    school: e.school[lang],
    details: e.details[lang],
  }));
}

export function getCertificates(lang: Lang) {
  return certificates.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    date: c.date[lang],
    url: c.url,
  }));
}
