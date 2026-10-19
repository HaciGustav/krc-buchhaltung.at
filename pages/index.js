import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import LangSwitch from "@/components/LangSwitch";
import css from "@/styles/landing.module.css";

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

const PHONE = "+43 660 174 39 00";
const TEL = "tel:+436601743900";
const MAIL = "office@krc-buchhaltung.at";
const MAPS =
  "https://www.google.com/maps/place/Oberlaaer+Str.+191%2F4,+1100+Wien/@48.1412547,16.3846706,17z";
const REPORTS = [
  { key: "registration", href: "/anmeldung" },
  { key: "deregistration", href: "/abmeldung" },
  { key: "change", href: "/aenderung" },
  { key: "cancellation", href: "/storno" },
];
// ÖGK: registration before work starts, deregistration and changes within 7 days.
const DEADLINE_DAYS = { registration: 0, deregistration: 7, change: 7 };

const fmt = (date, lang) =>
  date.toLocaleDateString(lang === "tr" ? "tr-TR" : "de-AT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// "2026-10-19" <-> "19.10.2026": the date field shows day first, as in the portal forms.
const isoToText = (iso) => (iso ? iso.split("-").reverse().join(".") : "");
const textToIso = (text) => {
  const m = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return "";
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getDate() === d && date.getMonth() === mo - 1 ? `${m[3]}-${m[2]}-${m[1]}` : "";
};
// Digits only, dots inserted while typing: "1910" -> "19.10".
const maskDate = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{2})(\d)/, "$1.$2");

const DeadlineSlip = () => {
  const { t, i18n } = useTranslation();
  const [kind, setKind] = useState("registration");
  const [day, setDay] = useState("");
  const [text, setText] = useState("");
  const pickerRef = useRef(null);

  const pick = (iso) => {
    setDay(iso);
    setText(isoToText(iso));
  };

  // Today's local date only on the client, so server and browser render the same markup.
  useEffect(() => {
    const now = new Date();
    pick(
      [now.getFullYear(), now.getMonth() + 1, now.getDate()]
        .map((n) => String(n).padStart(2, "0"))
        .join("-")
    );
  }, []);

  const [y, m, d] = day.split("-").map(Number);
  const event = day ? new Date(y, m - 1, d) : null;
  const deadline = event && new Date(y, m - 1, d + DEADLINE_DAYS[kind]);
  const href = REPORTS.find((r) => r.key === kind).href;

  return (
    <div className={css.slip} data-reveal>
      <h3>{t("landing.calcTitle")}</h3>
      <label className={css.slip_row}>
        <span>{t("landing.calcType")}</span>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {Object.keys(DEADLINE_DAYS).map((k) => (
            <option key={k} value={k}>
              {t(`navigation.${k}`)}
            </option>
          ))}
        </select>
      </label>
      <div className={css.slip_row}>
        <label htmlFor="deadline-date">{t(`landing.calcDate.${kind}`)}</label>
        <div className={css.date_field}>
          <input
            id="deadline-date"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("landing.calcFormat")}
            value={text}
            onChange={(e) => {
              const next = maskDate(e.target.value);
              setText(next);
              setDay(textToIso(next));
            }}
          />
          <button
            type="button"
            aria-label={t("landing.calcOpen")}
            onClick={() => pickerRef.current?.showPicker?.()}
          >
            <CalendarMonthOutlined sx={{ fontSize: 20 }} />
          </button>
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            className={css.date_picker}
            value={day}
            onChange={(e) => pick(e.target.value)}
          />
        </div>
      </div>
      <p className={css.slip_line}>
        <span>{t("landing.calcEvent")}</span>
        <i aria-hidden="true" />
        <span>{event ? fmt(event, i18n.language) : t("landing.calcPick")}</span>
      </p>
      <p className={css.slip_line}>
        <span>{t("landing.calcDeadline")}</span>
        <i aria-hidden="true" />
        <strong>
          {deadline
            ? `${t(kind === "registration" ? "landing.calcBefore" : "landing.calcUntil")} ${fmt(deadline, i18n.language)}`
            : "–"}
        </strong>
      </p>
      <p className={css.slip_note}>{t("landing.calcNote")}</p>
      <Link href={href} className={css.slip_total}>
        <span>{t(`forms.${kind}`)}</span>
        <span>
          {t("landing.calcTo")} <ArrowForward sx={{ fontSize: 18, verticalAlign: "-3px" }} />
        </span>
      </Link>
    </div>
  );
};

export default function Landing() {
  const { t, i18n } = useTranslation();
  const services = t("landing.services", { returnObjects: true });
  const about = t("landing.about", { returnObjects: true });

  // Entrances: elements marked data-reveal rise in once as they enter the screen.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const els = document.querySelectorAll("[data-reveal]:not(.in)");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // Re-run after a language switch: elements re-rendered then must be revealed too.
  }, [i18n.language]);

  return (
    <>
      <Head>
        <title>{`${t("landing.name")} – ${t("header.kanzlei")}, Wien`}</title>
        <meta name="description" content={t("landing.lead")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={css.hero}>
        <div className={css.hero_top}>
          <div className={css.hero_intro}>
            <img src="/assets/logo.svg" alt="" width={48} height={36} className={css.logo} />
            <p>{t("landing.lead")}</p>
            <a href="#meldungen" className={css.button_light}>
              {t("landing.cta")}
            </a>
          </div>
          <nav className={css.hero_nav} aria-label="Website">
            <a href="#leistungen">{t("landing.navServices")}</a>
            <a href="#meldungen">{t("landing.navReports")}</a>
            <a href="#kontakt">{t("landing.navContact")}</a>
            <Link href="/login">{t("landing.navLogin")}</Link>
            <LangSwitch tone="dark" />
          </nav>
        </div>

        <div className={css.hero_name}>
          <h1>{t("landing.name")}</h1>
          <p className={css.slogan}>{t("landing.slogan")}</p>
        </div>

        <img
          src="/assets/header.jpg"
          alt={t("landing.photoAlt")}
          width={1920}
          height={1281}
          className={css.hero_photo}
        />

        <div className={css.hero_bottom}>
          <a href={MAPS} target="_blank" rel="noreferrer">
            {t("footer.address")}, {t("footer.city")}
          </a>
          <span>
            <a href={TEL}>{PHONE}</a>
            <a href={`mailto:${MAIL}`}>{MAIL}</a>
          </span>
        </div>
      </header>

      <main>
        <section id="leistungen" className={css.services} aria-labelledby="services-title">
          <div className={css.services_intro}>
            <h2 id="services-title" data-reveal>
              {t("landing.servicesTitle")}
            </h2>
            <p data-reveal style={{ "--i": 1 }}>
              {t("landing.servicesLead")}
            </p>
          </div>
          <ul className={css.services_list}>
            {services.map(([name, text], i) => (
              <li key={i} data-reveal style={{ "--i": i % 2 }}>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <figure className={css.band}>
          <img
            src="/assets/header2.jpg"
            alt={t("landing.bandAlt")}
            width={1920}
            height={1280}
            loading="lazy"
          />
        </figure>

        <section id="meldungen" className={css.reports} aria-labelledby="reports-title">
          <div className={css.reports_text}>
            <h2 id="reports-title" data-reveal>
              {t("landing.reportsTitle")}
            </h2>
            <p data-reveal style={{ "--i": 1 }}>
              {t("landing.reportsText")}
            </p>
            <ul data-reveal style={{ "--i": 2 }}>
              {REPORTS.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href}>
                    <span>
                      <strong>{t(`navigation.${key}`)}</strong>
                      {t(`home.${key}.title`)}
                    </span>
                    <ArrowForward sx={{ fontSize: 20 }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <DeadlineSlip />
        </section>

        <section className={css.about} aria-labelledby="about-title">
          <h2 id="about-title" data-reveal>
            {t("header.kanzlei")}
          </h2>
          <p data-reveal style={{ "--i": 1 }}>
            {about.map((part, i) => {
              if (i === about.length - 1)
                return (
                  <a key={i} href="#kontakt" className={css.mark_strong}>
                    {part}
                  </a>
                );
              if (i === 0) return <strong key={i}>{part}</strong>;
              return i % 2 ? part : <mark key={i}>{part}</mark>;
            })}
          </p>
        </section>

        <section id="kontakt" className={css.contact} aria-labelledby="contact-title">
          <h2 id="contact-title" data-reveal>
            {t("landing.contactTitle")}
          </h2>
          <div className={css.contact_grid}>
            <ul className={css.rows}>
              <li data-reveal>
                <a href={MAPS} target="_blank" rel="noreferrer">
                  {t("footer.address")}
                </a>
              </li>
              <li data-reveal>{t("footer.city")}</li>
              <li data-reveal>{t("landing.hoursRow")}</li>
              <li data-reveal>
                <a href={TEL}>{PHONE}</a>
              </li>
              <li data-reveal>
                <a href={"mailto:" + MAIL} className={css.write}>
                  {t("landing.write")}
                  <span className={css.round}>
                    <ArrowForward />
                  </span>
                </a>
              </li>
            </ul>
            <figure className={css.map} data-reveal style={{ "--i": 1 }}>
              <MapWithNoSSR height="100%" />
              <figcaption>
                {t("footer.companyFull")}, {t("footer.address")}
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <footer className={css.footer}>
        <div className={css.footer_top}>
          <p>
            {t("footer.companyFull")}
            <br />
            {t("footer.address")}, {t("footer.city")}
          </p>
          <p>
            {t("footer.hoursMonThu")}
            <br />
            {t("footer.hoursFri")}, {t("footer.hoursByAppointment")}
          </p>
          <a href="#top" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: "smooth" }))}>
            {t("landing.top")}
          </a>
        </div>
        <div className={css.footer_main}>
          <p>{t("landing.footerInvite")}</p>
          <a href={`mailto:${MAIL}`} className={css.footer_mail}>
            office<wbr />@krc-buchhaltung.at
          </a>
        </div>
        <div className={css.footer_meta}>
          <span>
            <Link href="/dsvgo">{t("footer.privacy")}</Link>
            <Link href="/login">{t("landing.navLogin")}</Link>
          </span>
          <span>{t("footer.copyright")}</span>
        </div>
      </footer>
    </>
  );
}
