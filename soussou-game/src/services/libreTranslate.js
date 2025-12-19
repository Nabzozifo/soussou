import axios from 'axios';

const DEFAULT_URL = 'https://libretranslate.com/translate';
const LIBRE_TRANSLATE_URL = import.meta?.env?.VITE_LIBRETRANSLATE_URL || DEFAULT_URL;
const CACHE_PREFIX = 'lt-cache-v1:';
const BUNDLE_PREFIX = 'i18n-bundle-v1:';
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

export async function translateText(text, targetLang, sourceLang = 'fr') {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (trimmed.length === 0) return text;

  const cacheKey = `${CACHE_PREFIX}${sourceLang}:${targetLang}:${hashKey(trimmed)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.post(
      LIBRE_TRANSLATE_URL,
      {
        q: trimmed,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      },
      { headers: { Accept: 'application/json' } }
    );
    const translated = res?.data?.translatedText || trimmed;
    setCache(cacheKey, translated);
    return translated;
  } catch (err) {
    console.warn('LibreTranslate error:', err?.message || err);
    return text; // fallback: original
  }
}

// Batch translate an entire bundle using LibreTranslate array support
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

  // Translate all strings in one call where possible
  let translatedArr = null;
  try {
    const res = await axios.post(
      LIBRE_TRANSLATE_URL,
      { q: values.map((v) => (typeof v === 'string' ? v : String(v))), source: sourceLang, target: targetLang, format: 'text' },
      { headers: { Accept: 'application/json' } }
    );
    const data = res?.data;
    if (Array.isArray(data)) {
      translatedArr = data;
    } else if (Array.isArray(data?.translatedText)) {
      translatedArr = data.translatedText;
    } else if (typeof data?.translatedText === 'string') {
      translatedArr = [data.translatedText];
    }
  } catch (err) {
    console.warn('LibreTranslate bundle error, falling back item-by-item:', err?.message || err);
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
  setCachedBundle
};