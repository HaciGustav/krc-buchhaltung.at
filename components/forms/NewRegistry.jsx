import css from "@/styles/forms.module.css";
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
import DateInput from "@/components/form-components/DateInput";
import useFormCalls from "@/hooks/useFormCalls";
import { useState } from "react";
import FileInput from "../form-components/FileInput";
import ValidationWarningModal from "../form-components/ValidationWarningModal";
import useFormUtilities from "@/hooks/useFormUtilities";
import SectionTitle, { FormHeader } from "../form-components/SectionTitle";
import { useTranslation } from "react-i18next";
import useFormPrefill from "@/hooks/useFormPrefill";

const requiredFields = [
  { fieldName: "employer", fieldCaption: "forms.employer" },
  { fieldName: "workAddress", fieldCaption: "forms.workAddress" },
  { fieldName: "email", fieldCaption: "forms.email" },
  { fieldName: "firstnameDN", fieldCaption: "forms.firstNameEmployee" },
  { fieldName: "lastnameDN", fieldCaption: "forms.lastNameEmployee" },
  { fieldName: "insuranceNumberDN", fieldCaption: "forms.insuranceNumber" },
  { fieldName: "address", fieldCaption: "forms.address" },
  { fieldName: "zip", fieldCaption: "forms.zip" },
  { fieldName: "city", fieldCaption: "forms.city" },
  { fieldName: "citizenship", fieldCaption: "forms.citizenship" },
  { fieldName: "firstWorkDay", fieldCaption: "forms.registrationDate" },
  { fieldName: "jobDescription", fieldCaption: "forms.jobDescription" },
  { fieldName: "workingHours", fieldCaption: "forms.workingHours" },
  { fieldName: "gruppe", fieldCaption: "forms.group" },
  { fieldName: "insuranceType", fieldCaption: "forms.insuranceType" },
  { fieldName: "confirmation", fieldCaption: "forms.dsgvo" },
];

const NewRegistry = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ minWage: true });
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  //preFill
  useFormPrefill(setFormData);

  const {
    warningModalProps,
    setWarningModalProps,
    handleCloseModal,
    validateForm,
    screenSmall,
    textfieldSize,
    typographyFontSize,
  } = useFormUtilities();

  const { sendAnmeldung } = useFormCalls();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let inputValue = value;

    if (type === "checkbox") {
      inputValue = checked;
    } else if (type === "file") {
      inputValue = event.target.files[0];
    }
    const additionalInfo = {};
    if (name === "salaryForm" && value === "kv") {
      additionalInfo.salary = "";
      additionalInfo.minWage = true;
    } else if (name === "salaryForm" && value !== "kv") {
      additionalInfo.minWage = false;
    }

    setFormData({
      ...formData,
      ...additionalInfo,
      [name]: inputValue,
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
      sendAnmeldung(formData).then(() => setSubmitButtonDisabled(false));
    }
  };
  const isManualInputSelected = formData?.salaryForm === "manualInput";

  return (
    <>
      <ValidationWarningModal
        modalProps={warningModalProps}
        handleClose={handleCloseModal}
      />
      <form className={css.container} onSubmit={handleSubmit}>
        <FormHeader kind="registration" />
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
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="group">
                  {t("forms.maritalStatus")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="group"
                  id="demo-select-small"
                  size={textfieldSize}
                  name="maritalStatus"
                  value={formData?.maritalStatus || ""}
                  label={t("forms.maritalStatus")}
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
                  <MenuItem value={"Ledig"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.maritalSingle")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Verheiratet"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.maritalMarried")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Sonstiges"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.maritalOther")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="gender-group">
                  {t("forms.gender")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="gender-group"
                  id="gender-select-small"
                  size={textfieldSize}
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  label={t("forms.gender")}
                >
                  <MenuItem value={""}>
                    <Typography
                      component="em"
                      sx={{ fontSize: typographyFontSize }}
                    >
                      {t("forms.none")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Weiblich"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.genderFemale")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Männlich"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.genderMale")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"Andere"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.genderOther")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
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
            </div>
            <div className={css.flex}>
              <TextField
                name="zip"
                size={textfieldSize}
                label={t("forms.zip")}
                fullWidth
                value={formData.zip || ""}
                onChange={handleChange}
              />
              <TextField
                name="city"
                size={textfieldSize}
                label={t("forms.city")}
                fullWidth
                value={formData.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className={css.flex}>
              <TextField
                name="citizenship"
                size={textfieldSize}
                label={t("forms.citizenship")}
                fullWidth
                value={formData.citizenship || ""}
                onChange={handleChange}
              />
              <TextField
                name="iban"
                size={textfieldSize}
                label={t("forms.iban")}
                fullWidth
                value={formData.iban || ""}
                onChange={handleChange}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </div>

            <div className={css.flex}>
              <DateInput
                filterValue={formData}
                size={textfieldSize}
                setFilterValue={setFormData}
                label={t("forms.registrationDate")}
                name="firstWorkDay"
              />
              <TextField
                name="jobDescription"
                label={t("forms.jobDescription")}
                size={textfieldSize}
                placeholder={t("forms.placeholder")}
                fullWidth
                value={formData.jobDescription || ""}
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
                  size={textfieldSize}
                  labelId="insuranceType"
                  id="demo-select-small"
                  name="insuranceType"
                  value={formData?.insuranceType || ""}
                  label={t("forms.insuranceType")}
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
              <div className={css.placeholder_div} />
            </div>
            <div className={css.flex}>
              <FormControl sx={{ minWidth: 120, width: "calc(100% - 5px)" }}>
                <InputLabel size={textfieldSize} id="gehalt-select-label">
                  {t("forms.salary")}
                </InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  size={textfieldSize}
                  labelId="gehalt-select-label"
                  id="gehalt-select-small"
                  name="salaryForm"
                  value={formData?.salaryForm || (formData?.minWage && "kv")}
                  label={t("forms.salary")}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value={"kv"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.minWage")}
                    </Typography>
                  </MenuItem>
                  <MenuItem value={"manualInput"}>
                    <Typography sx={{ fontSize: typographyFontSize }}>
                      {t("forms.manualInput")}
                    </Typography>
                  </MenuItem>
                </Select>
              </FormControl>
              {isManualInputSelected ? (
                <TextField
                  name="salary"
                  size={textfieldSize}
                  label={t("forms.salaryManual")}
                  fullWidth
                  value={formData.salary || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className={css.flex} />
              )}
            </div>
            <div className={css.flex}>
              <TextField
                name="note"
                label={t("forms.notes")}
                size={textfieldSize}
                fullWidth
                multiline
                rows={4}
                value={formData.note || ""}
                onChange={handleChange}
              />
            </div>
            <div
              className={css.flex}
              style={{
                flexWrap: screenSmall ? "wrap" : "nowrap",
                rowGap: "5px",
              }}
            >
              <FileInput
                id="eCard"
                name="eCard"
                label={t("forms.eCard")}
                handleChange={handleChange}
                value={formData.eCard}
              />
              <FileInput
                id="meldezettel"
                name="meldezettel"
                label={t("forms.meldezettel")}
                handleChange={handleChange}
                value={formData.meldezettel}
              />
              <FileInput
                id="reisepass"
                name="reisepass"
                label={t("forms.passport")}
                handleChange={handleChange}
                value={formData.reisepass}
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

export default NewRegistry;
