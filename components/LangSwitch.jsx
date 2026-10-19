import { useTranslation } from "react-i18next";

const LANGS = ["de", "tr"];

const LangSwitch = () => {
  const { i18n } = useTranslation();

  const change = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("krc_language", lang);
  };

  return (
    <div role="group" aria-label="Sprache / Dil" style={{ display: "flex", gap: 2 }}>
      {LANGS.map((lang) => {
        const active = i18n.language === lang;
        return (
          <button
            key={lang}
            type="button"
            aria-pressed={active}
            onClick={() => change(lang)}
            style={{
              minWidth: 36,
              height: 28,
              border: 0,
              borderRadius: 6,
              font: "inherit",
              fontSize: 13,
              fontWeight: active ? 500 : 400,
              cursor: "pointer",
              background: active ? "var(--active)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
            }}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default LangSwitch;
