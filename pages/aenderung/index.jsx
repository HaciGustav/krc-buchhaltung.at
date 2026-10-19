import {
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import css from "@/styles/forms.module.css";
import DateInput from "@/components/form-components/DateInput";
import useFormCalls from "@/hooks/useFormCalls";
import useFormUtilities from "@/hooks/useFormUtilities";
import ValidationWarningModal from "@/components/form-components/ValidationWarningModal";
import SectionTitle, { FormHeader } from "@/components/form-components/SectionTitle";

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
  { fieldName: "changingPurpose", fieldCaption: "forms.changePurpose" },
  { fieldName: "confirmation", fieldCaption: "forms.dsvgo" },
];

const Aenderung = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const { sendAenderung } = useFormCalls();

  const {
    warningModalProps,
    validateForm,
    handleCloseModal,
    textfieldSize,
    typographyFontSize,
  } = useFormUtilities();

  //preFill
  useFormPrefill(setFormData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const localizedRequiredFields = requiredFields.map((f) => ({
      ...f,
      fieldCaption: t(f.fieldCaption),
    }));

    const isValidationOk = validateForm(localizedRequiredFields, formData);
    if (isValidationOk) {
      setSubmitButtonDisabled(true);
      sendAenderung(formData).then(() => setSubmitButtonDisabled(false));
    }
  };

  return (
    <>
      <ValidationWarningModal
        modalProps={warningModalProps}
        handleClose={handleCloseModal}
      />
      <form className={css.container} onSubmit={handleSubmit}>
        <FormHeader kind="change" />

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
                size={textfieldSize}
                label={t("forms.workAddress")}
                fullWidth
                value={formData.workAddress || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="email"
                size={textfieldSize}
                label={t("forms.email")}
                inputProps={{ type: "email" }}
                fullWidth
                value={formData.email || ""}
                onChange={handleChange}
              />
              <div className={css.placeholder_div} />
            </div>
          </div>
          <div className={css.form_section}>
            <SectionTitle title={t("forms.employeeData")} />
            <div className={css.flex}>
              <TextField
                name="firstnameDN"
                size={textfieldSize}
                label={t("forms.firstNameEmployee")}
                fullWidth
                value={formData.firstnameDN || ""}
                onChange={handleChange}
              />
              <TextField
                name="lastnameDN"
                size={textfieldSize}
                label={t("forms.lastNameEmployee")}
                fullWidth
                value={formData.lastnameDN || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="insuranceNumberDN"
                size={textfieldSize}
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
              <TextField
                name="address"
                label={t("forms.address")}
                size={textfieldSize}
                fullWidth
                value={formData.address || ""}
                onChange={handleChange}
              />
              <TextField
                name="zip"
                label={t("forms.zip")}
                size={textfieldSize}
                fullWidth
                value={formData.zip || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="city"
                label={t("forms.city")}
                size={textfieldSize}
                fullWidth
                value={formData.city || ""}
                onChange={handleChange}
              />
              <TextField
                name="citizenship"
                label={t("forms.citizenship")}
                size={textfieldSize}
                fullWidth
                value={formData.citizenship || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="iban"
                label={t("forms.iban")}
                size={textfieldSize}
                fullWidth
                value={formData.iban || ""}
                onChange={handleChange}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
              <DateInput
                filterValue={formData}
                size={textfieldSize}
                setFilterValue={setFormData}
                label={t("forms.registrationDate")}
                name="firstWorkDay"
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="jobDescription"
                label={t("forms.jobDescription")}
                size={textfieldSize}
                placeholder={t("forms.placeholder")}
                fullWidth
                value={formData.jobDescription || ""}
                onChange={handleChange}
              />
              <TextField
                name="experience"
                label={t("forms.experience")}
                size={textfieldSize}
                fullWidth
                value={formData.experience || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="workingHours"
                label={t("forms.workingHours")}
                size={textfieldSize}
                fullWidth
                value={formData.workingHours || ""}
                onChange={handleChange}
              />
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="group">
                  {t("forms.group")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="group"
                  id="demo-select-small"
                  size={textfieldSize}
                  name="gruppe"
                  value={formData?.gruppe || ""}
                  label={t("forms.group")}
                  onChange={handleChange}
                >
                  <MenuItem value={""}>
                    <Typography
                      component="em"
                      sx={{ fontSize: typographyFontSize }}
                    >
                      {t("forms.none")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Angestellte/r"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.employee")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Arbeiter/in"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.worker")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Lehrling"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.apprentice")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={css.flex}>
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="insuranceType">
                  {t("forms.insuranceType")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="insuranceType"
                  id="demo-select-small"
                  size={textfieldSize}
                  name="insuranceType"
                  value={formData?.insuranceType || ""}
                  label={t("forms.insuranceType")}
                  onChange={handleChange}
                  slotProps={{
                    input: { sx: { fontSize: typographyFontSize } },
                  }}
                >
                  <MenuItem value={""}>
                    <Typography
                      component="em"
                      sx={{ fontSize: typographyFontSize }}
                    >
                      {t("forms.none")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Vollversichert"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.fullyInsured")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Geringfügig"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.marginallyEmployed")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="salary"
                label={t("forms.salary")}
                size={textfieldSize}
                fullWidth
                value={formData.salary || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="changingPurpose"
                label={t("forms.changePurpose")}
                size={textfieldSize}
                fullWidth
                multiline
                rows={3}
                value={formData.changingPurpose || ""}
                onChange={handleChange}
                placeholder={t("forms.changePurposePlaceholder")}
              />
              <TextField
                name="note"
                label={t("forms.notes")}
                size={textfieldSize}
                fullWidth
                multiline
                rows={3}
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
                    {t("forms.confirmation")}
                    <a href="/dsvgo"> {t("forms.dsvgo")}</a>
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

export default function ProtectedAenderung() {
  return (
    <ProtectedRoute>
      <Aenderung />
    </ProtectedRoute>
  );
}
