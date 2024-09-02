import getSocialInsuranceValidationSchema from "./validationSchema/getSocialInsuranceValidationSchema";
import getSocialInsuranceFields from "../utils/sections/insurancePensionSections";

export const initializeFormData = (sectionsData, initialData = {}) => {
  const formData = {};

  sectionsData.forEach((section) => {
    section.fields.forEach((field) => {
      formData[field.name] = getFieldValue(initialData, field);
    });
  });

  return formData;
};

const getFieldValue = (initialData, field) => {
  const fieldName = field.name;
  if (initialData && initialData.hasOwnProperty(fieldName)) {
    return initialData[fieldName];
  }
  return field.defaultValue || "";
};

export const cleanInitializeFormData = () => {
  const sections = getSocialInsuranceFields({});
  const formData = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      formData[field.name] = "";
    });
  });

  return formData;
};

export const handleChangeUtil = (formData, setFormData) => (event) => {
  console.log("Field changed:", event.target.name, "Value:", event.target.value);
  const { name, value } = event.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

export const validateForm = async (formData, t) => {
  const validationSchema = getSocialInsuranceValidationSchema(t);

  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return {};
  } catch (validationError) {
    const validationErrors = {};
    if (validationError.inner) {
      validationError.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
    }
    return validationErrors;
  }
};
