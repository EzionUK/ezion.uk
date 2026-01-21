/* assets/locale.js
   Shared locale + currency + i18n helpers for ezion.uk
   Usage:
     - Include on every page: <script src="/assets/locale.js"></script>
       (or "../assets/locale.js" depending on folder depth)
     - Add the lang pill HTML (id="lang", "langBtn", "langMenu", "langFlag", "langText")
     - Call:
         EzionLocale.init({
           onChange: (ctx) => { ...re-render page... }
         });
     - Use:
         const ctx = EzionLocale.getContext();
         EzionLocale.formatPrice({type:"from", amount:499, currency:"GBP"})
*/

(function () {
  "use strict";

  // -----------------------------
  // Config
  // -----------------------------
  const LOCALES = {
    "uk-en": { lang: "en", country: "UK", currency: "GBP", numberLocale: "en-GB" },
    "sg-en": { lang: "en", country: "SG", currency: "SGD", numberLocale: "en-SG" },
    "sg-zh": { lang: "zh", country: "SG", currency: "SGD", numberLocale: "zh-SG" },
  };

  // Simple FX table (edit anytime)
  // Interpreted as: 1 FROM = rate TO
  const FX = {
    "GBP:SGD": 1.72,
    "SGD:GBP": 1 / 1.72,
  };

  const PILL_MAP = {
    "uk-en": { flag: "🇬🇧", text: "English" },
    "sg-en": { flag: "🇸🇬", text: "English" },
    "sg-zh": { flag: "🇸🇬", text: "中文" },
  };

  const STORAGE_KEY = "ezion_locale";
  const DEFAULT_LOCALE = "uk-en";

  // Optional global i18n dictionary (use if you want)
  const I18N = {
    en: {
      free: "FREE",
      from: "From",
      requestQuote: "Request a quote",
      view: "View",
      get: "Get",
    },
    zh: {
      free: "免费",
      from: "起",
      requestQuote: "索取报价",
      view: "查看",
      get: "获取",
    },
  };

  // -----------------------------
  // Utils
  // -----------------------------
  function $(id) {
    return document.getElementById(id);
  }

  function getSavedLocaleKey() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && LOCALES[saved] ? saved : DEFAULT_LOCALE;
  }

  function setSavedLocaleKey(key) {
    if (!LOCALES[key]) return;
    localStorage.setItem(STORAGE_KEY, key);
  }

  function getContext() {
    const key = getSavedLocaleKey();
    const info = LOCALES[key] || LOCALES[DEFAULT_LOCALE];
    return { key, ...info };
  }

  function t(key) {
    const ctx = getContext();
    const dict = I18N[ctx.lang] || I18N.en;
    return dict[key] != null ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : "");
  }

  function money(amount, currency, numberLocale) {
    const n = Number(amount);
    if (!isFinite(n)) return `${currency} 0.00`;
    try {
      return new Intl.NumberFormat(numberLocale, { style: "currency", currency }).format(n);
    } catch {
      return `${currency} ${n.toFixed(2)}`;
    }
  }

  function convertAmount(amount, fromCcy, toCcy) {
    const from = String(fromCcy || "").toUpperCase();
    const to = String(toCcy || "").toUpperCase();
    const n = Number(amount);

    if (!isFinite(n)) return 0;
    if (!from || !to || from === to) return n;

    const direct = FX[`${from}:${to}`];
    if (typeof direct === "number" && isFinite(direct)) return n * direct;

    // Fallback: try via GBP if available
    if (from !== "GBP" && to !== "GBP") {
      const toGBP = FX[`${from}:GBP`];
      const fromGBP = FX[`GBP:${to}`];
      if (typeof toGBP === "number" && typeof fromGBP === "number") {
        return n * toGBP * fromGBP;
      }
    }

    // No rate found, return original amount
    return n;
  }

  // price object forms:
  // { type:"free" }
  // { type:"fixed", amount:9.99, currency:"GBP" }
  // { type:"from", amount:499, currency:"GBP" }
  function formatPrice(price, ctxOverride) {
    const ctx = ctxOverride || getContext();
    if (!price || !price.type) return "";

    if (price.type === "free") return t("free");

    const targetCcy = ctx.currency;
    const baseCcy = (price.currency || "GBP").toUpperCase();
    const converted = convertAmount(price.amount, baseCcy, targetCcy);
    const formatted = money(converted, targetCcy, ctx.numberLocale);

    if (price.type === "from") {
      return ctx.lang === "zh" ? `${formatted} ${t("from")}` : `${t("from")} ${formatted}`;
    }
    return formatted;
  }

  // Convenience: set a textContent safely
  function setText(id, value) {
    const el = $(id);
    if (!el) return;
    el.textContent = value;
  }

  function setHtml(id, value) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = value;
  }

  function setHref(id, value) {
    const el = $(id);
    if (!el) return;
    el.href = value;
  }

  // -----------------------------
  // Pill wiring
  // -----------------------------
  function setLangPill(localeKey) {
    const map = PILL_MAP[localeKey] || PILL_MAP[DEFAULT_LOCALE];
    const flagEl = $("langFlag");
    const textEl = $("langText");
    if (flagEl) flagEl.textContent = map.flag;
    if (textEl) textEl.textContent = map.text;
  }

  function openLangMenu() {
    const wrap = $("lang");
    const btn = $("langBtn");
    if (wrap) wrap.classList.add("open");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  function closeLangMenu() {
    const wrap = $("lang");
    const btn = $("langBtn");
    if (wrap) wrap.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function wireLangMenu(onChange) {
    const wrap = $("lang");
    const btn = $("langBtn");
    const menu = $("langMenu");

    // If the page doesn't have the pill, just don't wire it.
    if (!wrap || !btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (wrap.classList.contains("open")) closeLangMenu();
      else openLangMenu();
    });

    menu.addEventListener("click", (e) => {
      const item = e.target.closest("[data-locale]");
      if (!item) return;

      const key = item.getAttribute("data-locale");
      if (!LOCALES[key]) return;

      setSavedLocaleKey(key);
      setLangPill(key);

      // Set html lang
      const ctx = getContext();
      document.documentElement.lang = ctx.lang === "zh" ? "zh-Hans" : "en";

      if (typeof onChange === "function") onChange(ctx);

      closeLangMenu();
    });

    // Close on outside click / Esc
    document.addEventListener("click", () => closeLangMenu());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLangMenu();
    });
  }

  // -----------------------------
  // Public API
  // -----------------------------
  const EzionLocale = {
    LOCALES,
    FX,
    I18N,

    getSavedLocaleKey,
    setSavedLocaleKey,
    getContext,

    t,
    money,
    convertAmount,
    formatPrice,

    setText,
    setHtml,
    setHref,

    // Init the locale system for the page
    // options:
    //   onChange(ctx) => called after user changes locale from pill
    //   onReady(ctx)  => called after init applies saved locale
    init: function init(options) {
      const opts = options || {};
      const key = getSavedLocaleKey();
      setLangPill(key);

      // Set html lang
      const ctx = getContext();
      document.documentElement.lang = ctx.lang === "zh" ? "zh-Hans" : "en";

      wireLangMenu(opts.onChange);

      if (typeof opts.onReady === "function") opts.onReady(ctx);
      return ctx;
    },
  };

  // Expose globally
  window.EzionLocale = EzionLocale;
})();
