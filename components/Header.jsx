import Link from "next/link";
import styles from "@/styles/header.module.css";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.header_container}>
      <div
        className={styles.header_parallax}
        style={{ backgroundImage: `url(/assets/header.jpg)` }}
      >
        <div className={styles.header_opacity}>
          <span className={styles.eyebrow}>
            {t('header.company')} {t(' ')} {t('header.kanzlei')}
          </span>

          <h1 className={styles.header_title}>
            {t('header.title')}
          </h1>

          <div className={styles.slogan_wrapper}>
            <h2 className={styles.border_effect}>{t('header.slogan1')}</h2>
            <span className={styles.slogan_dot}>●</span>
            <h2 className={styles.border_effect}>{t('header.slogan2')}</h2>
            <span className={styles.slogan_dot}>●</span>
            <h2 className={styles.border_effect}>{t('header.slogan3')}</h2>
          </div>

          <Link href="/anmeldung" className={styles.cta_button}>
            {t('header.cta', 'Formular starten')}
          </Link>

          <svg
            className={styles.scroll_indicator}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;