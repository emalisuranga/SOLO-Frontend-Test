import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import CustomTabPanel from "../../../component/CustomTabPanel";
import RegisterForm from "../../../component/RegisterForm";
import { useSnackbarStore } from "../../../store/snackbarStore";
import useFormStore from "../../../store/formStore";
import useSocialInsuranceCalculationStore from "../../../store/useSocialInsuranceCalculationStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cleanInitializeFormData, validateForm, initializeFormData, handleChangeUtil } from "../../../utils/socialInsuranceFormUtils";
import Loading from "../../../component/Common/Loading";

const InsurancePensionForm = ({ sections }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, setFormData, clearFormData, setErrors, errors } =
    useFormStore((state) => ({
      formData: state.formData,
      setFormData: state.setFormData,
      clearFormData: state.clearFormData,
      setErrors: state.setErrors,
      errors: state.errors,
    }));
  const { socialInsuranceCalculation, updateSocialInsuranceCalculation, loading } =
    useSocialInsuranceCalculationStore();

  const setSnackbar = useSnackbarStore((state) => state.setSnackbar);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const initialFormData = initializeFormData(sections, socialInsuranceCalculation);
    setFormData(initialFormData);
    setErrors({});
  }, [sections, socialInsuranceCalculation, setFormData, setErrors]);

  const handleFormChange = handleChangeUtil(formData, setFormData);

  const handleDataSave = useCallback(async () => {
    try {
      await updateSocialInsuranceCalculation(socialInsuranceCalculation.id, formData);
      setSnackbar(t("actions.update_success"), "success");
    } catch (error) {
      setSnackbar(t("actions.validationError"), "error");
      console.error("Failed to save data", error);
    }
  }, [formData, t, updateSocialInsuranceCalculation, socialInsuranceCalculation, setSnackbar]);

  const validateAndSetErrors = useCallback(async () => {
    const validationErrors = await validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar(t("actions.validationError"), "error");
      return false;
    }
    setErrors({});
    return true;
  }, [formData, t, setErrors, setSnackbar ]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const isValid = await validateAndSetErrors();
      if (isValid) {
        await handleDataSave();
        setSnackbar(t("actions.update_success"), "success");
      }
      setTimeout(() => navigate("/"), 100);
    },
    [ handleDataSave, validateAndSetErrors, navigate, t, setSnackbar ]
  );

  const handleClear = () => {
    cleanInitializeFormData();
    clearFormData();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {sections.map((section, index) => (
            <Tab key={index} label={section.label} {...a11yProps(index)} />
          ))}
        </Tabs>
        {sections.map((section, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            <RegisterForm fields={section.fields} formData={formData} onChange={handleFormChange} errors={errors} />
          </CustomTabPanel>
        ))}
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" type="submit">
            {t("button.submit")}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClear}>
            {t("button.clear")}
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

InsurancePensionForm.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          required: PropTypes.bool,
          defaultValue: PropTypes.any,
        })
      ).isRequired,
    })
  ).isRequired,
  initialData: PropTypes.object,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default InsurancePensionForm;