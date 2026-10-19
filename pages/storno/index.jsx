import {
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Grid,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  useMediaQuery,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import css from "@/styles/forms.module.css";
import DateInput from "@/components/form-components/DateInput";
import useFormCalls from "@/hooks/useFormCalls";
import useFormUtilities from "@/hooks/useFormUtilities";
import ValidationWarningModal from "@/components/form-components/ValidationWarningModal";
import SectionTitle, {
  FormHeader,
} from "@/components/form-components/SectionTitle";

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
  { fieldName: "cancellationType", fieldCaption: "forms.cancellationType" },
  { fieldName: "mailSentAt", fieldCaption: "forms.messageSentDate" },
  { fieldName: "confirmation", fieldCaption: "forms.dsgvo" },
];

const Storno = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const { sendStorno } = useFormCalls();

  const {
    warningModalProps,
    validateForm,
    handleCloseModal,
    textfieldSize,
    typographyFontSize,
  } = useFormUtilities();

  //preFill
  useFormPrefill(setFormData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Übersetze die requiredFields für die Warnmeldung dynamisch
    const localizedRequiredFields = requiredFields.map((f) => ({
      ...f,
      fieldCaption: t(f.fieldCaption),
    }));

    const isValidationOk = validateForm(localizedRequiredFields, formData);
    if (isValidationOk) {
      setSubmitButtonDisabled(true);
      sendStorno(formData).then(() => setSubmitButtonDisabled(false));
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
        <FormHeader kind="cancellation" />
        <div className={css.flex_column}>
          <div className={css.form_section}>
            <SectionTitle title={t("forms.companyData")} />
            <div className={css.flex}>
              <TextField
                name="employer"
                label={t("forms.employer")}
                size={textfieldSize}
                fullWidth
                value={formData.employer || ""}
                onChange={handleChange}
              />
              <TextField
                name="workAddress"
                label={t("forms.workAddress")}
                size={textfieldSize}
                fullWidth
                value={formData.workAddress || ""}
                onChange={handleChange}
              />
            </div>
            {/* <div className={css.flex}>
              <TextField
                name="email"
                label={t("forms.email")}
                size={textfieldSize}
                inputProps={{
                  type: "email",
                }}
                fullWidth
                value={formData.email || ""}
                onChange={handleChange}
              />
              <div className={css.placeholder_div} />
            </div> */}
          </div>
          <div className={css.form_section}>
            <SectionTitle title={t("forms.employeeData")} />

            <div className={css.flex}>
              <TextField
                name="firstnameDN"
                label={t("forms.firstNameEmployee")}
                size={textfieldSize}
                fullWidth
                value={formData.firstnameDN || ""}
                onChange={handleChange}
              />
              <TextField
                name="lastnameDN"
                label={t("forms.lastNameEmployee")}
                size={textfieldSize}
                fullWidth
                value={formData.lastnameDN || ""}
                onChange={handleChange}
              />
            </div>

            <div className={css.flex}>
              <TextField
                name="insuranceNumberDN"
                label={t("forms.insuranceNumber")}
                size={textfieldSize}
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
              />{" "}
            </div>
            <div className={css.flex}>
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="cancellationType-group">
                  {t("forms.cancellationType")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="cancellationType-group"
                  id="cancellationType-select-small"
                  size={textfieldSize}
                  name="cancellationType"
                  value={formData.cancellationType || ""}
                  onChange={handleChange}
                  label={t("forms.cancellationType")}
                >
                  <MenuItem value={""}>
                    <Typography
                      component="em"
                      sx={{ fontSize: typographyFontSize }}
                    >
                      {t("forms.none")}
                    </Typography>
                  </MenuItem>

                  <MenuItem value={"Anmeldung"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.cancellationRegistration")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Abmeldung"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.cancellationDeregistration")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>

              <DateInput
                filterValue={formData}
                setFilterValue={setFormData}
                label={t("forms.messageSentDate")}
                name="mailSentAt"
                size={textfieldSize}
              />
            </div>
            <div className={css.flex}>
              <TextField
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.confirmation || false}
                    size={textfieldSize}
                    onChange={handleChange}
                    name="confirmation"
                  />
                }
                label={
                  <span style={{ fontSize: typographyFontSize }}>
                    {t("forms.confirmation")}{" "}
                    <a href="/dsgvo" target="_blank" rel="noopener noreferrer">
                      {" "}
                      {t("forms.dsgvo")}
                    </a>
                  </span>
                }
              />
            </div>
          </div>

          <Button
            disabled={submitButtonDisabled}
            type="submit"
            variant="contained"
            color="primary"
            sx={{ alignSelf: "flex-start" }}
          >
            {t("forms.send")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default function ProtectedStornieren() {
  return (
    <ProtectedRoute>
      <Storno />
    </ProtectedRoute>
  );
}
