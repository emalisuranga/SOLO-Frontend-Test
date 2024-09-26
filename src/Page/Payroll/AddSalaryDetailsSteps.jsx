import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Stack, Button, Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import RegisterForm from "../../component/RegisterForm";
import useFormStore from "../../store/formStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  salaryValidation,
  transformFormDataForSalary,
  initializeUpdateSalaryFormData,
  initializeAddSalaryFormData,
  handleFormChangeUtil,
  transformFormDataForIncomeTax,
} from "../../utils/formUtils";
import useSalaryStore from "../../store/salaryStore";
import useEmployeeStore from "../../store/employeeStore";
import Loading from "../../component/Common/Loading";
import { useSnackbarStore } from "../../store/snackbarStore";

function CustomStepperForSalary({ sections, initialData }) {
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
  const { saveSalary, updateSalary, calculateSalaryDetails, generateIncomeTax, loading } = useSalaryStore();
  const { fetchEmployeeDetails } = useEmployeeStore();

  const [activeStep, setActiveStep] = useState(0);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const setSnackbar = useSnackbarStore((state) => state.setSnackbar);
  

  useEffect(() => {
    const fetchData = async () => {
      let initialFormData = {};
      if (!initialData?.employeeId) {
        const employeeData = await fetchEmployeeDetails(initialData.id);
        initialFormData = initializeAddSalaryFormData(sections, employeeData);
      } else {
        initialFormData = initializeUpdateSalaryFormData(sections, initialData);
      }
      setFormData(initialFormData);
    };

    fetchData();
    setErrors({});
  }, [sections, initialData, setFormData, fetchEmployeeDetails, setErrors]);

  const handleNext = async () => {
    const validationErrors = await salaryValidation(formData, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
  
      if (validationErrors.daysOffCheck) {
        setSnackbar(t("validation.daysOffMismatch"), "error");
      } else {
        setSnackbar(t("actions.validationError"), "error");
      }

      return;
    }
    setErrors({});

    if (activeStep === sections.length - 2) {
        let initialFormData = {};
        const transformedData = transformFormDataForSalary(formData, initialData);
        initialData = await calculateSalaryDetails(transformedData);
        initialFormData = initializeUpdateSalaryFormData(sections, initialData);
        setFormData(initialFormData);
    }  
    
    if (activeStep === sections.length - 1) {

      const transformedData = transformFormDataForSalary(formData, initialData);

      try {
        let savedSalaryId = initialData?.id;
        let employeeId = initialData?.employeeId;
        let response;
        if (initialData?.employeeId) {
          response = await updateSalary(initialData.id, transformedData);
          if (response && !response.error) {
            employeeId = initialData?.employeeId;
          }
        } else {
          response = await saveSalary(transformedData);
          if (response && !response.error) {
            employeeId = response.data.employeeId;
            savedSalaryId = response.data.id;
          }
        }

        if (response.error) {
          throw new Error(response.error);
        }
        setSnackbar(initialData?.employeeId ? t("actions.salaryDataUpdated") : t("actions.salaryDataSaved"), "success");
        setTimeout(
          () => navigate(`/salary-slip/${employeeId}/${savedSalaryId}`),
          2000
        );
      } catch (error) {
        console.error("Failed to save data", error);
        setSnackbar(error.message.includes("already exist") ? t("actions.salaryDetailsExist") : t("actions.salaryDataSaveFailed"), "error");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClear = () => {
    clearFormData();
  };

  const updateFormDataWithResponse = useCallback((currentFormData, responseData) => {
    const { incomeTax, socialInsuranceAmount } = responseData;
  
    if (
      currentFormData.incomeTax !== incomeTax ||
      currentFormData.socialInsurance !== socialInsuranceAmount ||
      currentFormData.refundAmount !== incomeTax
    ) {
      return {
        ...currentFormData,
        incomeTax,
        socialInsurance: socialInsuranceAmount,
        refundAmount: incomeTax,
      };
    }
  
    return currentFormData;
  }, []);

  const handleGenerateIncomeTax = useCallback(async () => {
    const transformedData = transformFormDataForIncomeTax(formData, initialData);
  
    try {
      const response = await generateIncomeTax(transformedData);
  
      if (!response || response.error) {
        throw new Error(response?.error || "Failed to generate income tax");
      }
  
      const newFormData = updateFormDataWithResponse(formData, response.data);
  
      if (newFormData !== formData) {
        setFormData(newFormData);
      }
  
      setShowGenerateButton(false);
  
    } catch (error) {
      console.error("Error generating income tax:", error);
    }
  }, [formData, setFormData, initialData, generateIncomeTax, updateFormDataWithResponse]);

  const handleFormChange = handleFormChangeUtil(formData, setFormData, setShowGenerateButton);

  if (loading) {
    return (
        <Loading />
    );
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {sections.map((section, index) => (
            <Step key={index}>
              <StepLabel>{section.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {sections.map((section, index) => (
          <div key={index} hidden={activeStep !== index}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="h6">{section.label}</Typography>
              <RegisterForm
                fields={section.fields}
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
              />
            </Box>
          </div>
        ))}
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === sections.length || showGenerateButton}
          >
            {activeStep === sections.length - 1 ? t("button.finish") : t("button.next")}
          </Button>
          {activeStep > 0 && (
            <Button variant="outlined" color="primary" onClick={handleBack}>
              {t("button.back")}
            </Button>
          )}
          {activeStep === sections.length - 1 && (
            <Button variant="outlined" color="primary" onClick={handleClear}>
              {t("button.clear")}
            </Button>
          )}
          {showGenerateButton && (
            <Button variant="contained" color="secondary" onClick={handleGenerateIncomeTax} >
              {t("button.generateIncomeTax")}
            </Button>
          )}
        </Stack>
      </Box>
    </form>
  );
}

CustomStepperForSalary.propTypes = {
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

CustomStepperForSalary.defaultProps = {
  initialData: {},
};

export default CustomStepperForSalary;
