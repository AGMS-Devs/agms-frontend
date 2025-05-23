import tr from '../locales/tr.json';
import en from '../locales/en.json';

type Language = 'tr' | 'en';
type Translations = typeof tr;

let currentLanguage: Language = 'tr';

const translations: Record<Language, Translations> = {
  tr,
  en,
};

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => {
  return currentLanguage;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return value || key;
}; 