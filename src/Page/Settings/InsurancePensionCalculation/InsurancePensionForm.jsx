import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import RegisterForm from "../../../component/RegisterForm";
import CustomSnackbar from "../../../component/Common/CustomSnackbar";
import useFormStore from "../../../store/formStore";
import useSocialInsuranceCalculationStore from "../../../store/useSocialInsuranceCalculationStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cleanInitializeFormData, validateForm,initializeFormData, handleFormChange as handleChangeUtil } from "../../../utils/socialInsuranceFormUtils";

const InsurancePensionForm = (sections) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formData, setFormData, clearFormData, setErrors, errors } =
    useFormStore((state) => ({
      formData: state.formData,
      setFormData: state.setFormData,
      clearFormData: state.clearFormData,
      setErrors: state.setErrors,
      errors: state.errors,
    }));
  const { socialInsuranceCalculation, saveSocialInsuranceCalculation, updateSocialInsuranceCalculation } =
    useSocialInsuranceCalculationStore();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialData, setInitialData] = useState(null);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const initialFormData = initializeFormData(sections, socialInsuranceCalculation);
    setFormData(initialFormData);
    setErrors({});
  }, [sections, initialData, setFormData, setErrors]);

  const handleSave = async () => {
  };

  const handleClear = () => {
    cleanInitializeFormData();
  };

  const handleFormChange = handleChangeUtil(formData, setFormData);

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6">{t("sections.socialInsuranceCalculation")}</Typography>
        {sections.map((fields, index) => ( 
              <RegisterForm
              fields={fields}
              formData={formData}
              onChange={handleFormChange}
              errors={errors}
            />
        ))}
      
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {t("button.save")}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClear}>
            {t("button.clear")}
          </Button>
        </Stack>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </form>
  );
};

export default InsurancePensionForm;