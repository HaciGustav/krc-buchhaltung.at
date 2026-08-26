import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import css from "@/styles/forms.module.css";
import DateInput from "@/components/form-components/DateInput";
import useFormCalls from "@/hooks/useFormCalls";
import useFormUtilities from "@/hooks/useFormUtilities";
import ValidationWarningModal from "@/components/form-components/ValidationWarningModal";
import SectionTitle from "@/components/form-components/SectionTitle";

// LOGIN AUTH
import ProtectedRoute from "@/components/ProtectedRoute";
import useFormPrefill from "@/hooks/useFormPrefill";

const requiredFields = [
  { fieldName: "employer", fieldCaption: "forms.employer" },
  { fieldName: "workAddress", fieldCaption: "forms.workAddress" },
  { fieldName: "email", fieldCaption: "forms.email" },
  { fieldName: "firstnameDN", fieldCaption: "forms.firstNameEmployee" },
  { fieldName: "lastnameDN", fieldCaption: "forms.lastNameEmployee" },
  { fieldName: "insuranceNumberDN", fieldCaption: "forms.insuranceNumber" },
  { fieldName: "lastWorkDay", fieldCaption: "forms.deregistrationDate" },
  { fieldName: "remainingHolidays", fieldCaption: "forms.remainingHolidays" },
  { fieldName: "terminationType", fieldCaption: "forms.terminationType" },
  { fieldName: "confirmation", fieldCaption: "forms.dsvgo" },
];

const Abmeldung = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const { sendAbmeldung } = useFormCalls();

  const {
    warningModalProps,
    validateForm,
    handleCloseModal,
    pageHeaderSize,
    textfieldSize,
    typographyFontSize,
    setWarningModalProps,
  } = useFormUtilities();

  //preFill
  useFormPrefill(setFormData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const localizedRequiredFields = requiredFields.map((f) => ({
      ...f,
      fieldCaption: t(f.fieldCaption),
    }));

    const isValidationOk = validateForm(localizedRequiredFields, formData);
    const isNotesError = formData.remainingHolidays === "Ja" && !formData.note;
    if (isValidationOk) {
      if (isNotesError) {
        setWarningModalProps({ open: true, fieldCaption: t("forms.notes") });
        return;
      }
      setSubmitButtonDisabled(true);
      sendAbmeldung(formData).then(() => setSubmitButtonDisabled(false));
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      <ValidationWarningModal
        modalProps={warningModalProps}
        handleClose={handleCloseModal}
      />
      <form className={css.container} onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ fontSize: pageHeaderSize }} gutterBottom>
          {t("forms.deregistration")}
        </Typography>
        <div className={css.flex_column}>
          <div className={css.form_section}>
            <SectionTitle title={t("forms.companyData")} />
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="employer"
                label={t("forms.employer")}
                fullWidth
                value={formData.employer || ""}
                onChange={handleChange}
              />
              <TextField
                size={textfieldSize}
                name="workAddress"
                label={t("forms.workAddress")}
                fullWidth
                value={formData.workAddress || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="email"
                label={t("forms.email")}
                inputProps={{ type: "email" }}
                fullWidth
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>{" "}
            <div className={css.placeholder_div} />
          </div>
          <div className={css.form_section}>
            <SectionTitle title={t("forms.employeeData")} />
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="firstnameDN"
                label={t("forms.firstNameEmployee")}
                fullWidth
                value={formData.firstnameDN || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="lastnameDN"
                label={t("forms.lastNameEmployee")}
                fullWidth
                value={formData.lastnameDN || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="insuranceNumberDN"
                label={t("forms.insuranceNumber")}
                fullWidth
                value={formData.insuranceNumberDN || ""}
                onChange={handleChange}
              />
              <DateInput
                filterValue={formData}
                size={textfieldSize}
                setFilterValue={setFormData}
                label={t("forms.birthDate")}
                name="dob"
              />
            </div>
            <div className={css.flex}>
              <DateInput
                filterValue={formData}
                setFilterValue={setFormData}
                size={textfieldSize}
                label={t("forms.deregistrationDate")}
                name="lastWorkDay"
              />
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="remainingHolidays-group">
                  {t("forms.remainingHolidays")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="remainingHolidays-group"
                  id="remainingHolidays-select-small"
                  size={textfieldSize}
                  name="remainingHolidays"
                  value={formData.remainingHolidays || ""}
                  onChange={handleChange}
                  label={t("forms.remainingHolidays")}
                >
                  <MenuItem value={"Nein"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.no")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Ja"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.yes")}{" "}
                      <span style={{ fontSize: "smaller", color: "#f00" }}>
                        <em>{t("forms.remainingHolidaysNote")}</em>
                      </span>
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="terminationType"
                label={t("forms.terminationType")}
                fullWidth
                value={formData.terminationType || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                size={textfieldSize}
                name="note"
                label={t("forms.notes")}
                fullWidth
                multiline
                rows={4}
                value={formData.note || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size={textfieldSize}
                      checked={formData.confirmation || false}
                      onChange={handleChange}
                      name="confirmation"
                    />
                  }
                  label={
                    <span style={{ fontSize: typographyFontSize }}>
                      {t("forms.confirmation")}
                      <a href="/dsvgo"> {t("forms.dsvgo")}</a>
                    </span>
                  }
                />
              </FormGroup>
            </div>
          </div>
          <div className={css.flex}>
            <Button
              disabled={submitButtonDisabled}
              type="submit"
              variant="contained"
              color="primary"
            >
              {t("forms.send")}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default function ProtectedAbmeldung() {
  return (
    <ProtectedRoute>
      <Abmeldung />
    </ProtectedRoute>
  );
}
