/* assets/locale.js
   Shared locale + currency + i18n + contact helpers for ezion.uk
   Drop-in replacement (extends previous version)
*/

(function () {
  "use strict";

  // -----------------------------
  // Config
  // -----------------------------
  const LOCALES = {
    "uk-en": {
      lang: "en",
      country: "UK",
      currency: "GBP",
      numberLocale: "en-GB",
      contact: { email: "contact@ezion.uk", phone: "+44 7733 9344449", whatsapp: null },
      company: {
        legalName: "Ezion Ltd",
        jurisdiction: "United Kingdom",
        status: "Active",
        registrationLabel: "Company Number",
        registrationValue: "16929156"
      }
    },

    "sg-en": {
      lang: "en",
      country: "SG",
      currency: "SGD",
      numberLocale: "en-SG",
      contact: { email: "ezionsg@gmail.com", phone: "+65 9622 2887", whatsapp: "+6596222887" },
      company: {
        legalName: "Ezion Pte Ltd",
        jurisdiction: "Singapore",
        status: "Operating",
        registrationLabel: "UEN",
        registrationValue: "Pending"
      }
    },

    // Singapore - 中文 (Simplified)
    "sg-zh": {
      lang: "zh",
      country: "SG",
      currency: "SGD",
      numberLocale: "zh-SG",
      contact: { email: "ezionsg@gmail.com", phone: "+65 9622 2887", whatsapp: "+6596222887" },
      company: {
        legalName: "Ezion Pte Ltd",
        jurisdiction: "新加坡",
        status: "运营中",
        registrationLabel: "UEN",
        registrationValue: "待定"
      }
    },

    // Hong Kong (EN)
    "hk-en": {
      lang: "en",
      country: "HK",
      currency: "HKD",
      numberLocale: "en-HK",
      contact: { email: "contact@ezion.uk", phone: "+852 5704 4532/ +86 1717 0494 532", whatsapp: null },
      company: {
        legalName: "Ezion Pte Ltd",
        jurisdiction: "Singapore",
        status: "Operating",
        registrationLabel: null,
        registrationValue: null
      }
    },

    // Hong Kong - 中文 (Traditional)
    "hk-zh": {
      lang: "zh",
      country: "HK",
      currency: "HKD",
      numberLocale: "zh-HK",
      contact: { email: "contact@ezion.uk", phone: "+852 5704 4532/ +86 1717 0494 532", whatsapp: null },
      company: {
        legalName: "Ezion Ltd",
        jurisdiction: "香港",
        status: "營運中",
        registrationLabel: null,
        registrationValue: null
      }
    },

    // United States (EN)
    "us-en": {
      lang: "en",
      country: "US",
      currency: "USD",
      numberLocale: "en-US",
      contact: { email: "contact@ezion.uk", phone: "+1 (864) 468-9899", whatsapp: null },
      company: {
        legalName: "Ezion Ltd",
        jurisdiction: "United Kingdom",
        status: "Operating",
        registrationLabel: null,
        registrationValue: null
      }
    },

    // -----------------------------
    // NEW: China - 中文 (Simplified)
    // -----------------------------
    "cn-zh": {
      lang: "zh",
      country: "CN",
      currency: "CNY",
      numberLocale: "zh-CN",

      contact: {
        email: "contact@ezion.uk",
        phone: "+86 1717 0494 532",
        whatsapp: null
      },

      company: {
        legalName: "Ezion Ltd",
        jurisdiction: "英国",
        status: "运营中",
        registrationLabel: null,
        registrationValue: null
      }
    }
  };

  // -----------------------------
  // FX
  // -----------------------------
  const FX = {
    "GBP:SGD": 1.72,
    "SGD:GBP": 1 / 1.72,

    "GBP:HKD": 9.90,
    "HKD:GBP": 1 / 9.90,

    "GBP:USD": 1.27,
    "USD:GBP": 1 / 1.27,

    // NEW: CNY placeholders (edit to live rates)
    "GBP:CNY": 9.20,
    "CNY:GBP": 1 / 9.20,

    // Convenience routes (optional)
    "SGD:HKD": 9.90 / 1.72,
    "HKD:SGD": 1.72 / 9.90,
    "SGD:USD": 1.27 / 1.72,
    "USD:SGD": 1.72 / 1.27,
    "HKD:USD": 1.27 / 9.90,
    "USD:HKD": 9.90 / 1.27,

    // NEW convenience for CNY
    "SGD:CNY": 9.20 / 1.72,
    "CNY:SGD": 1.72 / 9.20,
    "HKD:CNY": 9.20 / 9.90,
    "CNY:HKD": 9.90 / 9.20,
    "USD:CNY": 9.20 / 1.27,
    "CNY:USD": 1.27 / 9.20
  };

  // -----------------------------
  // Lang pill
  // -----------------------------
  const PILL_MAP = {
    "uk-en": { flag: "🇬🇧", text: "English" },
    "us-en": { flag: "🇺🇸", text: "English" },
    "sg-en": { flag: "🇸🇬", text: "English" },
    "sg-zh": { flag: "🇸🇬", text: "中文" },
    "hk-en": { flag: "🇭🇰", text: "English" },
    "hk-zh": { flag: "🇭🇰", text: "中文" },
    "cn-zh": { flag: "🇨🇳", text: "中文" }
  };

  const STORAGE_KEY = "ezion_locale";
  const DEFAULT_LOCALE = "uk-en";

  const I18N = {
    en: { free: "FREE", from: "From" },
    zh: { free: "免费", from: "起" }
  };

  // -----------------------------
  // Utils
  // -----------------------------
  const $ = (id) => document.getElementById(id);

  function getSavedLocaleKey() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && LOCALES[saved] ? saved : DEFAULT_LOCALE;
  }

  function setSavedLocaleKey(key) {
    if (LOCALES[key]) localStorage.setItem(STORAGE_KEY, key);
  }

  function getContext() {
    const key = getSavedLocaleKey();
    return { key, ...LOCALES[key] };
  }

  function t(k) {
    const ctx = getContext();
    return (I18N[ctx.lang] || I18N.en)[k] || "";
  }

  function money(amount, currency, locale) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
      }).format(amount);
    } catch {
      return `${currency} ${Number(amount).toFixed(2)}`;
    }
  }

  function convertAmount(amount, from, to) {
    const f = String(from || "").toUpperCase();
    const tcur = String(to || "").toUpperCase();
    if (!f || !tcur || f === tcur) return amount;

    const direct = FX[`${f}:${tcur}`];
    if (typeof direct === "number" && isFinite(direct)) return amount * direct;

    // Fallback: try via GBP if available
    if (f !== "GBP" && tcur !== "GBP") {
      const toGBP = FX[`${f}:GBP`];
      const fromGBP = FX[`GBP:${tcur}`];
      if (typeof toGBP === "number" && typeof fromGBP === "number") {
        return amount * toGBP * fromGBP;
      }
    }
    return amount;
  }

  function formatPrice(price, ctxOverride) {
    const ctx = ctxOverride || getContext();
    if (!price || !price.type) return "";

    if (price.type === "free") return t("free");

    const converted = convertAmount(
      price.amount,
      (price.currency || "GBP").toUpperCase(),
      ctx.currency
    );

    const val = money(converted, ctx.currency, ctx.numberLocale);

    return price.type === "from"
      ? (ctx.lang === "zh" ? `${val} ${t("from")}` : `${t("from")} ${val}`)
      : val;
  }

  // -----------------------------
  // Contact helpers
  // -----------------------------
  function getContactEmail(serviceType) {
    const ctx = getContext();
    return ctx.contact.email;
  }

  function getPhone() {
    return getContext().contact.phone;
  }

  function getWhatsApp() {
    return getContext().contact.whatsapp;
  }

  function getCompanyInfo() {
    return getContext().company;
  }

  function applyContactTargets() {
    const email = getContactEmail();
    const phone = getPhone();
    const wa = getWhatsApp();

    document.querySelectorAll("[data-contact-email]").forEach(el => {
      el.textContent = email;
      el.href = `mailto:${email}`;
    });

    document.querySelectorAll("[data-copy-email]").forEach(el => {
      el.setAttribute("data-copy", email);
    });

    document.querySelectorAll("[data-phone]").forEach(el => {
      el.textContent = phone;
      el.href = `tel:${String(phone).replace(/\s+/g, "")}`;
    });

    document.querySelectorAll("[data-whatsapp]").forEach(el => {
      if (!wa) {
        el.style.display = "none";
      } else {
        el.style.display = "";
        el.href = `https://wa.me/${String(wa).replace(/\D/g, "")}`;
      }
    });
  }

  // -----------------------------
  // Company block helper
  // -----------------------------
  function applyCompanyInfo() {
    const c = getCompanyInfo();
    if (!c) return;

    if ($("companyLegal")) $("companyLegal").textContent = c.legalName;
    if ($("companyJurisdiction")) $("companyJurisdiction").textContent = c.jurisdiction;
    if ($("companyStatus")) $("companyStatus").textContent = c.status;
    if ($("companyRegLabel")) $("companyRegLabel").textContent = c.registrationLabel;
    if ($("companyRegValue")) $("companyRegValue").textContent = c.registrationValue;
  }

  // -----------------------------
  // Lang pill wiring
  // -----------------------------
  function setLangPill(key) {
    const m = PILL_MAP[key] || PILL_MAP[DEFAULT_LOCALE];
    if ($("langFlag")) $("langFlag").textContent = m.flag;
    if ($("langText")) $("langText").textContent = m.text;
  }

  function htmlLangFromCtx(ctx){
    // Traditional: Hong Kong 中文
    if (ctx.key === "hk-zh") return "zh-Hant";
    // Simplified: SG/CN 中文
    if (ctx.lang === "zh") return "zh-Hans";
    return "en";
  }

  function wireLangMenu(onChange) {
    const wrap = $("lang");
    const btn = $("langBtn");
    const menu = $("langMenu");
    if (!wrap || !btn || !menu) return;

    btn.onclick = (e) => {
      e.stopPropagation();
      wrap.classList.toggle("open");
    };

    menu.onclick = (e) => {
      const item = e.target.closest("[data-locale]");
      if (!item) return;
      const key = item.dataset.locale;
      if (!LOCALES[key]) return;

      setSavedLocaleKey(key);
      setLangPill(key);

      const ctx = getContext();
      document.documentElement.lang = htmlLangFromCtx(ctx);

      onChange && onChange(ctx);
      wrap.classList.remove("open");
    };

    document.addEventListener("click", () => wrap.classList.remove("open"));
    document.addEventListener("keydown", (e) => e.key === "Escape" && wrap.classList.remove("open"));
  }

  // -----------------------------
  // Public API
  // -----------------------------
  window.EzionLocale = {
    LOCALES,
    FX,

    getContext,
    formatPrice,
    money,
    convertAmount,

    getContactEmail,
    getPhone,
    getWhatsApp,
    getCompanyInfo,

    applyContactTargets,
    applyCompanyInfo,

    init(opts = {}) {
      const key = getSavedLocaleKey();
      setLangPill(key);
      const ctx = getContext();
      document.documentElement.lang = (ctx.key === "hk-zh") ? "zh-Hant" : (ctx.lang === "zh" ? "zh-Hans" : "en");
      wireLangMenu(opts.onChange);
      opts.onReady && opts.onReady(ctx);
      return ctx;
    }
  };
})();
