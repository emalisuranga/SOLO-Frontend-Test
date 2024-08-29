import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Stack,Button,Box,Tab,Tabs } from "@mui/material";
import CustomTabPanel from "./CustomTabPanel";
import RegisterForm from "./RegisterForm";
import useFormStore from "../store/formStore";
import useEmployeeStore from '../store/employeeStore';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomSnackbar from "./Common/CustomSnackbar";
import { validateForm,initializeFormData, handleFormChange as handleChangeUtil } from "../utils/formUtils";
import { handleSuccess, handleError } from "../utils/responseHandlers";
import Loading from "../component/Common/Loading";

function CustomTabs({ sections, mode = 'add', initialData = {} }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formData, setFormData, clearFormData, setErrors, errors } = useFormStore((state) => ({
    formData: state.formData,
    setFormData: state.setFormData,
    clearFormData: state.clearFormData,
    setErrors: state.setErrors,
    errors: state.errors,
  }));

  const [value, setValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { saveData, updateData,loading } = useEmployeeStore();
  const initialDataRef = useRef(initialData);
  const modeRef = useRef(mode);

  useEffect(() => {
    const initialFormData = initializeFormData(sections, initialData);
    setFormData(initialFormData);
    setErrors({});
  }, [sections, initialData, setFormData, setErrors]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormChange = handleChangeUtil(formData, setFormData);

  const validateAndSetErrors = useCallback(async () => {
    const validationErrors = await validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbarSeverity('error');
      setSnackbarMessage(t("actions.validationError"));
      setSnackbarOpen(true);
      return false;
    }
    setErrors({});
    return true;
  }, [formData, t, setErrors, setSnackbarSeverity, setSnackbarMessage, setSnackbarOpen]);

  const handleDataSave = useCallback(async () => {
    try {
      if (modeRef.current === 'edit') {
        await updateData({
          ...formData,
          id: initialDataRef.current.id,
          bankDetails: [{ id: initialDataRef.current.bankDetails.id }],
          salaryDetails: [{ id: initialDataRef.current.salaryDetails.id }]
        });
        handleSuccess(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, t("actions.update_success"));
      } else {
        await saveData(formData);
        handleSuccess(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, t("actions.add_success"));
      }
      setTimeout(() => navigate("/employee"), 2000);
    } catch (error) {
      handleError(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, error, t("actions.add_error"));
      console.error("Failed to save data", error);
    }
  }, [formData, t, updateData, saveData, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, navigate]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const isValid = await validateAndSetErrors();
    if (isValid) {
      await handleDataSave();
    }
  }, [handleDataSave, validateAndSetErrors]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClear = () => {
    clearFormData();
  };
  if (loading) {
    return (
        <Loading />
    );
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
            {t(mode === 'edit' ? "Update" : "Submit")}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClear}>
          {t("button.clear")}
          </Button>
        </Stack>
      </Box>
      <CustomSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
    </form>
  );
}

CustomTabs.propTypes = {
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
  mode: PropTypes.oneOf(['add', 'edit']),
  initialData: PropTypes.object,
};

CustomTabs.defaultProps = {
  mode: 'add',
  initialData: {},
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default CustomTabs;