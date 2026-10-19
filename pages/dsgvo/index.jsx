import css from "@/styles/forms.module.css";
import { FormHeader } from "@/components/form-components/SectionTitle";
import { useTranslation } from "react-i18next";

const SECTIONS = [
  "contactForm",
  "registration",
  "itSecurity",
  "legalBasis",
  "yourRights",
];

const Dsgvo = () => {
  const { t } = useTranslation();

  return (
    <div className={css.container}>
      <FormHeader title={t("footer.privacy")} />
      <div className={css.prose}>
        {SECTIONS.map((key) => (
          <section key={key}>
            <h2>{t(`privacy.${key}`)}</h2>
            <p>{t(`privacy.${key}Text`)}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Dsgvo;
