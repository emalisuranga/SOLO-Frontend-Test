import * as Yup from "yup";

// Reusable function for percentage fields
const percentageFieldValidation = (t, fieldName) => 
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }))
    .required(t("validation.required", { field: t(`fields.${fieldName}`) }))
    .test(
      'is-float',
      t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }),
      (value) => value === undefined || value.toString().match(/^\d*\.?\d+$/)
    );

// Reusable function for salary fields with a minimum value
const salaryFieldValidation = (t, fieldName, minValue = 0) =>
  Yup.number()
    .typeError(t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }))
    .min(minValue, t("validation.minValue", { field: t(`fields.${fieldName}`), min: minValue }))
    .required(t("validation.required", { field: t(`fields.${fieldName}`) }))
    .test(
      'is-float',
      t("validation.numbersOnly", { field: t(`fields.${fieldName}`) }),
      (value) => value === undefined || value.toString().match(/^\d*\.?\d+$/)
    );

const getSocialInsuranceValidationSchema = (t) => {
  return Yup.object().shape({
    healthInsurancePercentage: percentageFieldValidation(t, "healthInsurancePercentage"),
    longTermInsurancePercentage: percentageFieldValidation(t, "longTermInsurancePercentage"),
    employeePensionPercentage: percentageFieldValidation(t, "employeePensionPercentage"),
    regularEmployeeInsurancePercentage: percentageFieldValidation(t, "regularEmployeeInsurancePercentage"),
    specialEmployeeInsurancePercentage: percentageFieldValidation(t, "specialEmployeeInsurancePercentage"),
    pensionStartMonthlySalary: salaryFieldValidation(t, "pensionStartMonthlySalary"),
    pensionEndMonthlySalary: salaryFieldValidation(t, "pensionEndMonthlySalary"),
    pensionStartSalary: salaryFieldValidation(t, "pensionStartSalary"),
    pensionEndSalary: salaryFieldValidation(t, "pensionEndSalary"),
  });
};

export default getSocialInsuranceValidationSchema;