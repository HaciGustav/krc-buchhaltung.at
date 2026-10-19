import css from "@/styles/forms.module.css";
import { useTranslation } from "react-i18next";

const SectionTitle = ({ title }) => {
  return <h2 className={css.section_title}>{title}</h2>;
};

// With `kind` (registration, deregistration, change, cancellation) it also
// renders the side rail with deadline, documents and contact.
export const FormHeader = ({ kind, title, text }) => {
  const { t } = useTranslation();

  return (
    <>
      <header className={css.form_header}>
        <h1>{kind ? t(`forms.${kind}`) : title}</h1>
        {(kind || text) && <p>{kind ? t(`forms.${kind}Intro`) : text}</p>}
      </header>
      {kind && (
        <aside className={css.form_aside}>
          <dl>
            <div>
              <dt>{t("home.deadline")}</dt>
              <dd>{t(`home.${kind}.deadline`)}</dd>
            </div>
            <div>
              <dt>{t("home.needs")}</dt>
              <dd>{t(`home.${kind}.needs`)}</dd>
            </div>
            <div>
              <dt>{t("navigation.contact")}</dt>
              <dd>
                <a href="tel:+436601743900">{t("footer.phone")}</a>
                <br />
                <a href="mailto:office@krc-buchhaltung.at">{t("footer.email")}</a>
              </dd>
            </div>
          </dl>
        </aside>
      )}
    </>
  );
};

export default SectionTitle;
