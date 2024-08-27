import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Stack, Button, Tab, Tabs, Box } from "@mui/material";
import CustomTabPanel from "../../component/CustomTabPanel";
import RegisterForm from "../../component/RegisterForm";
import CustomSnackbar from "../../component/Common/CustomSnackbar";
import useFormStore from "../../store/formStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  salaryValidation,
  transformFormDataForSalary,
  initializeUpdateSalaryFormData,
  initializeAddSalaryFormData,
  handleFormChangeUtil
} from "../../utils/formUtils";
import useSalaryStore from "../../store/salaryStore";
import useEmployeeStore from "../../store/employeeStore";

function CustomTabsForSalary({ sections, initialData }) {
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
  const { saveSalary, updateSalary } = useSalaryStore();
  const { fetchEmployeeDetails } = useEmployeeStore();

  const [value, setValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleFormChange = handleChangeUtil(formData, setFormData);
  const handleFormChange = handleFormChangeUtil(formData, setFormData);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await salaryValidation(formData, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbarSeverity('error');
      setSnackbarMessage(t("actions.validationError"));
      setSnackbarOpen(true);
      return false;
    }
    setErrors({});

    const transformedData = transformFormDataForSalary(formData, initialData);

    try {
      let savedSalaryId = initialData?.id;
      let employeeId = initialData?.id;
      let response;
      if (initialData?.employeeId) {
        response = await updateSalary(initialData.id, transformedData);
        if (response && !response.error) {
          employeeId = initialData?.employeeId;
        }
      } else {
        response = await saveSalary(transformedData);
        if (response && !response.error) {
          savedSalaryId = response.data.id;
        }
      }

      if (response.error) {
        throw new Error(response.error);
      }
      setSnackbarSeverity("success");
      setSnackbarMessage(
        initialData?.employeeId
          ? t("actions.salaryDataUpdated")
          : t("actions.salaryDataSaved")
      );
      setSnackbarOpen(true);
      setTimeout(
        () => navigate(`/salary-slip/${employeeId}/${savedSalaryId}`),
        2000
      );
    } catch (error) {
      console.error("Failed to save data", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(
        error.message.includes("already exist")
          ? t("actions.salaryDetailsExist")
          : t("actions.salaryDataSaveFailed")
      );
      setSnackbarOpen(true);
    }
  };

  // const handleCloseSnackbar = () => {
  //   setSnackbarOpen(false);
  // };

  const handleClear = () => {
    clearFormData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {sections.map((section, index) => (
            <Tab key={index} label={section.label} {...a11yProps(index)} />
          ))}
        </Tabs>
        {sections.map((section, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            <RegisterForm
              fields={section.fields}
              formData={formData}
              onChange={handleFormChange}
              errors={errors}
            />
          </CustomTabPanel>
        ))}
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginTop: 2, justifyContent: "flex-end" }}
        >
          <Button variant="contained" color="primary" type="submit">
            {t("Submit")}
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
}

CustomTabsForSalary.propTypes = {
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

CustomTabsForSalary.defaultProps = {
  initialData: {},
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default CustomTabsForSalary;
