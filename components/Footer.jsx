import css from "@/styles/footer.module.css";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.6 3.6 1 1 0 01-.25 1z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.flex}>
          <div className={css.flex_column} style={{ justifyContent: "space-between" }}>
            <div className={css.footer_section}>
              <h2>{t('footer.company')}</h2>
              <p>{t('footer.companyFull')}</p>
              <p>
                {t('footer.address')},
                <br />
                {t('footer.city')}
              </p>
              <p>
                <a href="tel:+436601743900"><IconPhone />{t('footer.phone')}</a>
                <br />
                <a href="mailto:office@krc-buchhaltung.at"><IconMail />{t('footer.email')}</a>
              </p>
            </div>
            <div className={css.footer_section}>
              <h2>{t('footer.hours')}</h2>
              <p>
                {t('footer.hoursMonThu')}
                <br />
                {t('footer.hoursFri')}
                <br />
                {t('footer.hoursByAppointment')}
              </p>
            </div>
          </div>
          <div className={css.footer_section} style={{ width: "100%" }}>
            <div className={css.footer_map_wrapper}>
              <MapWithNoSSR />
            </div>
          </div>
        </div>
      </div>
      <div className={css.footer_bottom}>
        <p>{t('footer.copyright')}</p>
        <p>
          <a href="/dsvgo">{t('footer.privacy')}</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;