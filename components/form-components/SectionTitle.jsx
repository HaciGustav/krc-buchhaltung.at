import css from "@/styles/forms.module.css";

const SectionTitle = ({ title }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
      <span
        style={{
          width: "20px",
          height: "2px",
          backgroundColor: "#d9b877",
          display: "inline-block",
        }}
      />
      <p className={css.section_title}>{title}</p>
    </div>
  );
};

export default SectionTitle;