// pages/404.tsx
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

type LocaleItem = {
  key: string;
  flag: string;
  label: string;
  meta: string;
};

export default function Custom404() {
  const router = useRouter();

  const fullPath = useMemo(() => {
    // asPath includes query/hash (best approximation in Pages Router)
    return router.asPath || "/";
  }, [router.asPath]);

  const LOCALES: LocaleItem[] = [
    { key: "uk-en", flag: "🇬🇧", label: "English", meta: "GBP · UK" },
    { key: "us-en", flag: "🇺🇸", label: "English", meta: "USD · US" },
    { key: "sg-en", flag: "🇸🇬", label: "English", meta: "SGD · SG" },
    { key: "sg-zh", flag: "🇸🇬", label: "简中", meta: "SGD · SG" },
    { key: "hk-en", flag: "🇭🇰", label: "English", meta: "HKD · HK" },
    { key: "hk-zh", flag: "🇭🇰", label: "繁中", meta: "HKD · HK" },
    { key: "cn-zh", flag: "🇨🇳", label: "简中", meta: "CNY · CN" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLocale, setActiveLocale] = useState<LocaleItem>(LOCALES[0]);

  return (
    <>
      <Head>
        <title>Not found | Ezion</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="This page hasn't been published yet." />
      </Head>

      <div className="bg" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className={`lang ${menuOpen ? "open" : ""}`} id="lang">
        <div className="langRow">
          <button
            className="langBtn"
            id="langBtn"
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="flag" id="langFlag" aria-hidden="true">
              {activeLocale.flag}
            </span>
            <span className="langText" id="langText">
              {activeLocale.label}
            </span>
          </button>

          <Link className="langBtn homeBtn" href="/" id="topHomeBtn" aria-label="Home">
            <span className="iconSpacer" aria-hidden="true" />
            <span className="langText" id="topHomeText">
              Home
            </span>
          </Link>
        </div>

        <div className="langMenu" id="langMenu" role="menu" aria-label="Select language and currency">
          {LOCALES.map((l) => (
            <button
              key={l.key}
              className="langItem"
              role="menuitem"
              type="button"
              data-locale={l.key}
              onClick={() => {
                setActiveLocale(l);
                setMenuOpen(false);
              }}
            >
              <span className="flag">{l.flag}</span>
              <span>{l.label}</span>
              <span className="langMeta">{l.meta}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="wrap" onClick={() => menuOpen && setMenuOpen(false)}>
        <article className="card" aria-label="Not found" onClick={(e) => e.stopPropagation()}>
          <div className="domain">
            <img src="/Ezion_logo_invert.png" alt="Ezion" />
          </div>

          <h1>This product is still in development</h1>
          <p className="sub">
            We’re still building this page. If you want it prioritised, send us the URL you tried to open.
          </p>

          <div className="path" aria-label="Requested URL" title={fullPath}>
            {fullPath}
          </div>

          <div className="btnRow">
            <Link className="btn" href="/products">
              Back to Products
            </Link>
            <a className="btn secondary" href="mailto:contact@ezion.uk?subject=Ezion%20Page%20Request&body=URL%3A%20">
              Email us
            </a>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div>
          <a href="mailto:contact@ezion.uk">contact@ezion.uk</a>
        </div>
      </footer>

      <style jsx global>{`
        :root{
          --bg: #0b0f14;
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.70);
          --hair: rgba(255,255,255,.16);
          --shadow: 0 28px 70px rgba(0,0,0,.55);
          --radius: 22px;
          --max: 980px;
          --pillH: 44px;
          --pillPadX: 14px;
        }

        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body{
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
          overflow-x: hidden;
        }
        a{ color: inherit; }

        .bg{
          position: fixed;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.20) 45%, rgba(0,0,0,.45)),
            radial-gradient(1200px 820px at 70% 30%, rgba(0,0,0,.8), rgba(0,0,0,.45)),
            url("/hero.jpg") center/cover no-repeat;
          transform: scale(1.02);
          filter: saturate(1.05) contrast(1.02);
          z-index: -3;
        }
        .vignette{
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              700px 420px at 50% 48%,
              rgba(255,255,255,.14),
              rgba(255,255,255,.06) 35%,
              rgba(0,0,0,0) 65%
            );
          mix-blend-mode: screen;
          opacity: .55;
          z-index: -2;
        }
        .grain{
          position: fixed;
          inset: -40%;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.20'/%3E%3C/svg%3E");
          opacity: .10;
          transform: rotate(6deg);
          z-index: -1;
        }

        .wrap{
          min-height: 100%;
          display: grid;
          place-items: center;
          padding: 28px;
        }

        .lang{
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 6;
        }
        .langRow{
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .langBtn{
          display: inline-flex;
          align-items: center;
          gap: 10px;

          height: var(--pillH);
          padding: 0 var(--pillPadX);
          line-height: 1;

          border: 1px solid rgba(255,255,255,.16);
          background: rgba(0,0,0,.18);
          color: rgba(255,255,255,.92);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(12px) saturate(1.15);
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
          text-decoration: none;
          box-sizing: border-box;
          user-select: none;
        }
        .langBtn:hover{
          transform: translateY(-1px);
          background: rgba(0,0,0,.26);
          border-color: rgba(255,255,255,.22);
        }
        .langBtn .iconSpacer{
          width: 28px;
          height: 28px;
          display: inline-block;
          flex: 0 0 28px;
        }
        .flag{
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          background: rgba(255,255,255,.08);
          box-shadow: 0 0 0 1px rgba(255,255,255,.14);
          flex: 0 0 28px;
        }
        .langText{
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .homeBtn{
          padding: 0 14px;
          gap: 8px;
          min-width: unset;
          justify-content: center;
          letter-spacing: .06em;
        }
        .homeBtn .iconSpacer{ display: none; }

        .langMenu{
          position: absolute;
          top: calc(var(--pillH) + 10px);
          right: 0;
          min-width: 240px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.30);
          backdrop-filter: blur(14px) saturate(1.15);
          box-shadow: 0 22px 60px rgba(0,0,0,.55);
          padding: 8px;
          display: none;
        }
        .lang.open .langMenu{ display: block; }

        .langItem{
          width: 100%;
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 10px 10px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(255,255,255,.92);
          cursor: pointer;
          text-align: left;
        }
        .langItem:hover{
          background: rgba(255,255,255,.06);
          border-color: rgba(255,255,255,.10);
        }
        .langMeta{
          font-size: 12px;
          color: rgba(255,255,255,.60);
          letter-spacing: .02em;
        }

        .card{
          width: min(var(--max), 100%);
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.18);
          border-radius: 18px;
          padding: 18px;
          box-shadow: var(--shadow);
          user-select: text;
          text-align: center;
        }

        .domain img{
          margin: 0 auto;
          width: 43%;
          height: auto;
          display: block;
          opacity: .95;
          user-select: none;
        }

        h1{
          margin: 12px 0 10px;
          font-size: clamp(22px, 2.4vw, 30px);
          letter-spacing: .02em;
        }
        .sub{
          margin: 0 auto;
          color: rgba(255,255,255,.70);
          line-height: 1.6;
          font-size: 14px;
          max-width: 78ch;
        }

        .path{
          margin: 14px auto 0;
          max-width: 78ch;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          color: rgba(255,255,255,.70);
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.20);
          overflow-x: auto;
          white-space: nowrap;
        }

        .btnRow{
          margin-top: 14px;
          display: inline-flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .btn{
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(0,0,0,.18);
          color: rgba(255,255,255,.92);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          backdrop-filter: blur(12px) saturate(1.15);
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        }
        .btn:hover{
          transform: translateY(-1px);
          background: rgba(0,0,0,.26);
          border-color: rgba(255,255,255,.22);
        }
        .btn.secondary{ background: rgba(255,255,255,.06); }

        .footer{
          position: fixed;
          left: 0;
          right: 0;
          bottom: 18px;
          display: flex;
          justify-content: center;
          padding: 0 18px;
          text-align: center;
          font-size: 13px;
          letter-spacing: .02em;
          color: rgba(255,255,255,.70);
          z-index: 5;
        }
        .footer a{
          color: rgba(255,255,255,.92);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,.16);
          padding-bottom: 1px;
        }
        .footer a:hover{ border-bottom-color: rgba(255,255,255,.45); }
      `}</style>
    </>
  );
}
