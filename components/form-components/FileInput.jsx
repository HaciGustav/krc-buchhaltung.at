import { Typography } from "@mui/material";
import { useState } from "react";
import css from "@/styles/forms.module.css";

const FileInput = ({ id, label, name, value, handleChange }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      if (handleChange) handleChange(event);
    }
  };

  return (
    <>
      <input
        id={"file-upload" + name}
        type="file"
        accept="image/*, application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
        name={name}
      />
      <label
        htmlFor={"file-upload" + name}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "6px",
          width: "100%",
          padding: "18px 10px",
          border: fileName ? "1.5px solid #5a1835" : "1.5px dashed #d6c9bc",
          borderRadius: "10px",
          backgroundColor: fileName ? "rgba(90,24,53,0.03)" : "#faf8f6",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
            stroke={fileName ? "#5a1835" : "#b3a394"}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: fileName ? "#5a1835" : "#7a6f64" }}>
          {label}
        </Typography>
        {fileName && (
          <Typography sx={{ fontSize: "0.72rem", color: "#9c8f83" }}>
            {fileName}
          </Typography>
        )}
      </label>
    </>
  );
};

export default FileInput;