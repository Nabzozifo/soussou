import axios from 'axios';

// Generic cache (localStorage) for translated texts and bundles
const CACHE_PREFIX = 'mt-cache-v2:';
const BUNDLE_PREFIX = 'i18n-bundle-v2:';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const now = () => Date.now();

function hashKey(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h << 5) - h + text.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.ts || !obj.val) return null;
    if (now() - obj.ts > TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return obj.val;
  } catch {
    return null;
  }
}

function setCache(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: now(), val }));
  } catch {
    // ignore quota errors
  }
}

// Provider selection via env
const PROVIDER = import.meta?.env?.VITE_TRANSLATE_PROVIDER || 'mymemory';

// Azure Translator (recommended)
async function translateTextsAzure(texts, targetLang, sourceLang = 'fr') {
  const key = import.meta?.env?.VITE_AZURE_TRANSLATOR_KEY;
  const region = import.meta?.env?.VITE_AZURE_TRANSLATOR_REGION || 'global';
  if (!key) throw new Error('Azure Translator: API key missing');

  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${encodeURIComponent(sourceLang)}&to=${encodeURIComponent(targetLang)}`;
  const body = texts.map((t) => ({ text: String(t) }));
  const res = await axios.post(url, body, {
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Ocp-Apim-Subscription-Region': region,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  const data = res?.data || [];
  // data: [ { translations: [ { text } ] } ]
  return data.map((item, i) => item?.translations?.[0]?.text ?? String(texts[i]));
}

// MyMemory (free fallback, limited and less accurate)
async function translateTextsMyMemory(texts, targetLang, sourceLang = 'fr') {
  const results = [];
  for (const t of texts) {
    const q = encodeURIComponent(String(t));
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;
    try {
      const res = await axios.get(url, { headers: { Accept: 'application/json' } });
      const translated = res?.data?.responseData?.translatedText || String(t);
      results.push(translated);
    } catch (e) {
      results.push(String(t));
    }
  }
  return results;
}

// Single string translate with caching
export async function translateText(text, targetLang, sourceLang = 'fr') {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (trimmed.length === 0) return text;

  const cacheKey = `${CACHE_PREFIX}${sourceLang}:${targetLang}:${hashKey(trimmed)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let translated = trimmed;
  try {
    if (PROVIDER === 'azure') {
      translated = (await translateTextsAzure([trimmed], targetLang, sourceLang))[0];
    } else {
      translated = (await translateTextsMyMemory([trimmed], targetLang, sourceLang))[0];
    }
  } catch (_) {
    // keep original on error
  }
  setCache(cacheKey, translated);
  return translated;
}

// Translate entire object/array bundle in batch
export async function translateBundle(bundle, targetLang, sourceLang = 'fr') {
  const isArray = Array.isArray(bundle);
  const out = isArray ? [] : {};
  const paths = [];
  const values = [];

  const collect = (obj, path = []) => {
    if (typeof obj === 'string') {
      paths.push(path);
      values.push(obj);
      return;
    }
    if (obj && typeof obj === 'object') {
      const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v]) : Object.entries(obj);
      for (const [k, v] of entries) collect(v, path.concat(k));
      return;
    }
    // primitive non-string
    paths.push(path);
    values.push(obj);
  };

  collect(bundle);

  // Translate all strings in one/batched calls
  let translatedArr = null;
  try {
    if (PROVIDER === 'azure') {
      translatedArr = await translateTextsAzure(values.map((v) => (typeof v === 'string' ? v : String(v))), targetLang, sourceLang);
    } else {
      translatedArr = await translateTextsMyMemory(values.map((v) => (typeof v === 'string' ? v : String(v))), targetLang, sourceLang);
    }
  } catch (_) {
    translatedArr = null;
  }

  const assign = (target, path, val) => {
    let cur = target;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      const nextIsIndex = !isNaN(Number(path[i + 1]));
      if (cur[key] == null) cur[key] = nextIsIndex ? [] : {};
      cur = cur[key];
    }
    const lastKey = path[path.length - 1];
    cur[lastKey] = val;
  };

  for (let i = 0; i < paths.length; i++) {
    const original = values[i];
    let translated = translatedArr ? translatedArr[i] : null;
    if (!translated || typeof translated !== 'string') {
      translated = typeof original === 'string' ? await translateText(original, targetLang, sourceLang) : original;
    }
    assign(out, paths[i], translated);
  }

  return out;
}

export function getCachedBundle(targetLang) {
  const raw = localStorage.getItem(`${BUNDLE_PREFIX}${targetLang}`);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (obj && obj.ts && now() - obj.ts <= TTL_MS && obj.val) return obj.val;
    return null;
  } catch {
    return null;
  }
}

export function setCachedBundle(targetLang, bundle) {
  try {
    localStorage.setItem(`${BUNDLE_PREFIX}${targetLang}`, JSON.stringify({ ts: now(), val: bundle }));
  } catch {}
}

export default {
  translateText,
  translateBundle,
  getCachedBundle,
  setCachedBundle,
};