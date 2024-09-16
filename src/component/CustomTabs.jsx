import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Stack,Button,Box,Tab,Tabs } from "@mui/material";
import CustomTabPanel from "./CustomTabPanel";
import RegisterForm from "./RegisterForm";
import useFormStore from "../store/formStore";
import useEmployeeStore from '../store/employeeStore';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { validateForm,initializeFormData, handleFormChange as handleChangeUtil } from "../utils/formUtils";
import Loading from "../component/Common/Loading";
import { useSnackbarStore } from "../store/snackbarStore";

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
  const { saveData, updateData,loading } = useEmployeeStore();
  const initialDataRef = useRef(initialData);
  const modeRef = useRef(mode);
  const setSnackbar = useSnackbarStore((state) => state.setSnackbar);

  useEffect(() => {
    const initialFormData = initializeFormData(sections, initialData, mode);
    setFormData(initialFormData);
    setErrors({});
  }, [sections, initialData, setFormData, setErrors, mode]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormChange = handleChangeUtil(formData, setFormData);

  const validateAndSetErrors = useCallback(async () => {
    const validationErrors = await validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar(t("actions.validationError"), "error");
      return false;
    }
    setErrors({});
    return true;
  }, [formData, t, setErrors, setSnackbar]);

  const handleDataSave = useCallback(async () => {
    try {
      if (modeRef.current === 'edit') {
        await updateData({
          ...formData,
          id: initialDataRef.current.id,
          bankDetails: [{ id: initialDataRef.current.bankDetails.id }],
          salaryDetails: [{ id: initialDataRef.current.salaryDetails.id }]
        });
        setSnackbar(t("actions.update_success"), "success");
      } else {
        await saveData(formData);
        setSnackbar(t("actions.add_success"), "success");
      }
      setTimeout(() => navigate("/employee"), 100);
    } catch (error) {
      const errorMessage = error.response && error.response.status === 409 
      ? t("actions.duplicate_error") 
      : t("actions.add_error");
      setSnackbar(errorMessage, "error");
      console.error("Failed to save data", error);
    }
  }, [formData, t, updateData, saveData, navigate, setSnackbar]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const isValid = await validateAndSetErrors();
    if (isValid) {
      await handleDataSave();
    }
  }, [handleDataSave, validateAndSetErrors]);

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