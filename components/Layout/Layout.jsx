import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import CssBaseline from "@mui/material/CssBaseline";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";
import PersonRemoveOutlined from "@mui/icons-material/PersonRemoveOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import UndoOutlined from "@mui/icons-material/UndoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import css from "@/styles/layout.module.css";
import LangSwitch from "../LangSwitch";

export const NAV = [
  { href: "/anmeldung", key: "registration", Icon: PersonAddAltOutlined },
  { href: "/abmeldung", key: "deregistration", Icon: PersonRemoveOutlined },
  { href: "/aenderung", key: "change", Icon: EditOutlined },
  { href: "/storno", key: "cancellation", Icon: UndoOutlined },
];

const Brand = ({ t }) => (
  <Link href="/" className={css.brand}>
    <img src="/assets/logo.svg" alt="" width={36} height={36} />
    <span>
      <strong>KRC</strong>
      <span className={css.brand_sub}>{t("header.kanzlei")}</span>
    </span>
  </Link>
);

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("krc_language");
    if (savedLang && i18n.language !== savedLang) i18n.changeLanguage(savedLang);
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Close the phone menu after navigating.
  useEffect(() => setMenuOpen(false), [router.asPath]);

  const item = (href, label, Icon) => (
    <Link
      key={href}
      href={href}
      className={css.nav_item}
      aria-current={router.pathname === href ? "page" : undefined}
    >
      <Icon sx={{ fontSize: 18 }} />
      {label}
    </Link>
  );

  // The public website brings its own layout; the portal pages share the shell.
  if (router.pathname === "/") {
    return (
      <>
        <CssBaseline />
        {children}
      </>
    );
  }

  return (
    <div className={css.shell}>
      <CssBaseline />

      <header className={css.topbar}>
        <Brand t={t} />
        <button
          type="button"
          className={css.menu_button}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          aria-label={t("navigation.menu")}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      <aside id="sidebar" className={css.sidebar} data-open={menuOpen}>
        <div className={css.sidebar_brand}>
          <Brand t={t} />
        </div>

        <nav className={css.nav} aria-label={t("navigation.group")}>
          {item("/portal", t("navigation.overview"), HomeOutlined)}
          <p className={css.nav_group}>{t("navigation.group")}</p>
          {NAV.map(({ href, key, Icon }) => item(href, t(`navigation.${key}`), Icon))}
        </nav>

        <div className={css.sidebar_foot}>
          <p className={css.nav_group}>{t("navigation.contact")}</p>
          <a href="tel:+436601743900">{t("footer.phone")}</a>
          <a href="mailto:office@krc-buchhaltung.at">{t("footer.email")}</a>
          <p className={css.muted}>
            {t("footer.hoursMonThu")}
            <br />
            {t("footer.hoursFri")}
          </p>
          <div className={css.foot_row}>
            <LangSwitch tone="dark" />
            <Link href="/dsvgo" className={css.muted}>
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </aside>

      <main className={css.main}>{children}</main>
    </div>
  );
};

export default Layout;
