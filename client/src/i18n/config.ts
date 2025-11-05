import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const fallbackLng = 'ro';
const supportedLngs = ['ro', 'en'];

const userLanguage =
  typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : fallbackLng;

i18n
  .use(resourcesToBackend((lng: string) => import(`./locales/${lng}.json`)))
  .use(initReactI18next)
  .init({
    lng: supportedLngs.includes(userLanguage) ? userLanguage : fallbackLng,
    fallbackLng,
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;