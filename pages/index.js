import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowForward from "@mui/icons-material/ArrowForward";
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

const DeadlineSlip = () => {
  const { t, i18n } = useTranslation();
  const [kind, setKind] = useState("registration");
  const [day, setDay] = useState("");

  // Today's date only on the client, so server and browser render the same markup.
  useEffect(() => setDay(new Date().toISOString().slice(0, 10)), []);

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
      <label className={css.slip_row}>
        <span>{t(`landing.calcDate.${kind}`)}</span>
        <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      </label>
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
  const { t } = useTranslation();
  const services = t("landing.services", { returnObjects: true });
  const about = t("landing.about", { returnObjects: true });
  const side = t("landing.rowsSide", { returnObjects: true });

  // Entrances: elements marked data-reveal rise in once as they enter the screen.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const els = document.querySelectorAll("[data-reveal]");
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
  }, []);

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
          <h2 id="services-title" className={css.services_title} data-reveal>
            {t("landing.servicesTitle")}
          </h2>
          <ul>
            {services.map(([name, text], i) => (
              <li key={name} data-reveal style={{ "--i": i }}>
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
          <ul className={css.rows}>
            <li data-reveal>
              <a href={MAPS} target="_blank" rel="noreferrer">
                {t("footer.address")}
              </a>
              <a href={MAPS} target="_blank" rel="noreferrer" className={css.side}>
                {side[0]}
              </a>
            </li>
            <li data-reveal>
              {t("footer.city")}
              <span className={css.side}>{side[1]}</span>
            </li>
            <li data-reveal>
              {t("landing.hoursRow")}
              <span className={css.side}>{side[2]}</span>
            </li>
            <li data-reveal>
              <a href={TEL}>{PHONE}</a>
              <a href={TEL} className={css.side}>
                {side[3]}
              </a>
            </li>
            <li data-reveal>
              <a href={"mailto:" + MAIL} className={css.write}>
                {t("landing.write")}
                <span className={css.round}>
                  <ArrowForward />
                </span>
              </a>
              <a href={"mailto:" + MAIL} className={css.side}>
                {MAIL}
              </a>
            </li>
          </ul>
          <div className={css.place}>
            <figure data-reveal>
              <img
                src="/assets/found/kurpark-oberlaa-wien.jpg"
                alt={t("landing.parkCaption")}
                width={1920}
                height={1078}
                loading="lazy"
              />
              <figcaption>{t("landing.parkCaption")}</figcaption>
            </figure>
            <figure data-reveal style={{ "--i": 1 }}>
              <img
                src="/assets/found/u-bahn-station-oberlaa-03.jpg"
                alt={t("landing.ubahnCaption")}
                width={1920}
                height={1280}
                loading="lazy"
              />
              <figcaption>{t("landing.ubahnCaption")}</figcaption>
            </figure>
            <figure className={css.map} data-reveal style={{ "--i": 2 }}>
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
          <span>
            {t("landing.credits")}: Kurpark Oberlaa –{" "}
            <a href="https://commons.wikimedia.org/w/index.php?curid=86569675">Anna Saini</a>, U1 Oberlaa –{" "}
            <a href="https://commons.wikimedia.org/w/index.php?curid=63026410">Plani</a>,{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
          </span>
          <span>{t("footer.copyright")}</span>
        </div>
      </footer>
    </>
  );
}
