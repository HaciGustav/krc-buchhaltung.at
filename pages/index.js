import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { NAV } from "@/components/Layout/Layout";
import css from "@/styles/start.module.css";

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("home.title")} – KRC Buchhaltung`}</title>
        <meta name="description" content={t("home.lead")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={css.page}>
        <header className={css.title_row}>
          <h1>{t("home.title")}</h1>
          <p>{t("home.lead")}</p>
        </header>

        <div className={css.grid}>
          <section className={css.panel} aria-labelledby="tasks">
            <h2 id="tasks" className={css.panel_title}>
              {t("home.question")}
            </h2>
            <ul className={css.tasks}>
              {NAV.map(({ href, key, Icon }) => (
                <li key={key}>
                  <Link href={href} className={css.task}>
                    <Icon className={css.task_icon} sx={{ fontSize: 20 }} />
                    <span className={css.task_main}>
                      <span className={css.task_title}>{t(`home.${key}.title`)}</span>
                      <span className={css.task_text}>{t(`home.${key}.text`)}</span>
                    </span>
                    <dl className={css.task_meta}>
                      <div>
                        <dt>{t("home.deadline")}</dt>
                        <dd>{t(`home.${key}.deadline`)}</dd>
                      </div>
                      <div>
                        <dt>{t("home.needs")}</dt>
                        <dd>{t(`home.${key}.needs`)}</dd>
                      </div>
                    </dl>
                    <span className={css.task_go}>
                      <span>{t("home.open")}</span>
                      <ChevronRight sx={{ fontSize: 18 }} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={css.panel} aria-labelledby="contact">
            <h2 id="contact" className={css.panel_title}>
              {t("navigation.contact")}
            </h2>
            <div className={css.contact}>
              <p className={css.muted}>{t("home.contactLead")}</p>
              <p>
                <a href="tel:+436601743900">{t("footer.phone")}</a>
                <br />
                <a href="mailto:office@krc-buchhaltung.at">{t("footer.email")}</a>
              </p>
              <p>
                {t("footer.companyFull")}
                <br />
                {t("footer.address")}, {t("footer.city")}
              </p>
              <div>
                <h3>{t("footer.hours")}</h3>
                <p>
                  {t("footer.hoursMonThu")}
                  <br />
                  {t("footer.hoursFri")}
                  <br />
                  <span className={css.muted}>{t("footer.hoursByAppointment")}</span>
                </p>
              </div>
            </div>
            <div className={css.map}>
              <MapWithNoSSR height="100%" />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
