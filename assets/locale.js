/* assets/locale.js
   Shared locale + currency + i18n + contact helpers for ezion.uk
   Drop-in replacement (extends previous version)

   Usage:
     <script src="/assets/locale.js"></script>

     EzionLocale.init({
       onReady(ctx){ ... },
       onChange(ctx){ ... }
     });
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

      contact: {
        email: "contact@ezion.uk",
        phone: "+44 20 0000 0000",
        whatsapp: null
      },

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

      contact: {
        email: "ezionsg@gmail.com",
        phone: "+65 9000 0000",
        whatsapp: "+6590000000"
      },

      company: {
        legalName: "Ezion (Singapore)",
        jurisdiction: "Singapore",
        status: "Operating",
        registrationLabel: "UEN",
        registrationValue: "Pending"
      }
    },

    "sg-zh": {
      lang: "zh",
      country: "SG",
      currency: "SGD",
      numberLocale: "zh-SG",

      contact: {
        email: "ezionsg@gmail.com",
        phone: "+65 9000 0000",
        whatsapp: "+6590000000"
      },

      company: {
        legalName: "Ezion（新加坡）",
        jurisdiction: "新加坡",
        status: "运营中",
        registrationLabel: "UEN",
        registrationValue: "待定"
      }
    }
  };

  // -----------------------------
  // FX
  // -----------------------------
  const FX = {
    "GBP:SGD": 1.72,
    "SGD:GBP": 1 / 1.72
  };

  // -----------------------------
  // Lang pill
  // -----------------------------
  const PILL_MAP = {
    "uk-en": { flag: "🇬🇧", text: "English" },
    "sg-en": { flag: "🇸🇬", text: "English" },
    "sg-zh": { flag: "🇸🇬", text: "中文" }
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
    if (from === to) return amount;
    const rate = FX[`${from}:${to}`];
    return rate ? amount * rate : amount;
  }

  function formatPrice(price, ctxOverride) {
    const ctx = ctxOverride || getContext();
    if (!price || !price.type) return "";

    if (price.type === "free") return t("free");

    const converted = convertAmount(
      price.amount,
      price.currency || "GBP",
      ctx.currency
    );

    const val = money(converted, ctx.currency, ctx.numberLocale);

    return price.type === "from"
      ? ctx.lang === "zh" ? `${t("from")} ${val}` : `${t("from")} ${val}`
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
      el.href = `tel:${phone.replace(/\s+/g, "")}`;
    });

    document.querySelectorAll("[data-whatsapp]").forEach(el => {
      if (!wa) {
        el.style.display = "none";
      } else {
        el.style.display = "";
        el.href = `https://wa.me/${wa.replace(/\D/g, "")}`;
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
    const m = PILL_MAP[key];
    if ($("langFlag")) $("langFlag").textContent = m.flag;
    if ($("langText")) $("langText").textContent = m.text;
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
      setSavedLocaleKey(key);
      setLangPill(key);
      const ctx = getContext();
      document.documentElement.lang = ctx.lang === "zh" ? "zh-Hans" : "en";
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
      document.documentElement.lang = ctx.lang === "zh" ? "zh-Hans" : "en";
      wireLangMenu(opts.onChange);
      opts.onReady && opts.onReady(ctx);
      return ctx;
    }
  };
})();
