let translations = {};
let lang = document.documentElement.lang || 'en';

export async function loadTranslations() {
  try {
    const res = await fetch(`/locales/${lang}.json`);
    translations = await res.json();
  } catch (e) {
    console.error("Failed to load translations:", e);
    translations = {};
  }
}

export function t(key) {
  return translations[key] || key;
}