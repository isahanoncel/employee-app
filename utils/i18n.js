let translations = {};
let lang = localStorage.getItem('lang') || document.documentElement.lang || 'tr';

const CACHE_KEY_PREFIX = 'translations_';
const CACHE_VERSION = '1.8';

function getCacheKey(lang) {
  return `${CACHE_KEY_PREFIX}${lang}_${CACHE_VERSION}`;
}

function getCachedTranslations(lang) {
  const cached = localStorage.getItem(getCacheKey(lang));
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached translations:', e);
      return null;
    }
  }
  return null;
}

function cacheTranslations(lang, translations) {
  try {
    localStorage.setItem(getCacheKey(lang), JSON.stringify(translations));
  } catch (e) {
    console.error('Failed to cache translations:', e);
  }
}

export async function loadTranslations() {
  try {
    const cachedTranslations = getCachedTranslations(lang);
    if (cachedTranslations) {
      translations = cachedTranslations;
      document.documentElement.lang = lang;
      return translations;
    }

    const res = await fetch(`/locales/${lang}.json`);
    translations = await res.json();
    document.documentElement.lang = lang;
    
    cacheTranslations(lang, translations);
    
    return translations;
  } catch (e) {
    console.error("Failed to load translations:", e);
    translations = {};
    return translations;
  }
}

export function t(key) {
  return translations[key] || key;
}

export async function setLanguage(newLang) {
  lang = newLang;
  localStorage.setItem('lang', lang);
  await loadTranslations();
  window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
  return translations;
}
