import * as Yup from "yup";

const getSocialInsuranceValidationSchema = (t) => {
  return Yup.object().shape({
    healthInsurancePercentage: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.healthInsurancePercentage") }))
      .required(t("validation.required", { field: t("fields.healthInsurancePercentage") })),
    longTermInsurancePercentage: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.longTermInsurancePercentage") }))
      .required(t("validation.required", { field: t("fields.longTermInsurancePercentage") })),
    employeePensionPercentage: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.employeePensionPercentage") }))
      .required(t("validation.required", { field: t("fields.employeePensionPercentage") })),
    regularEmployeeInsurancePercentage: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.regularEmployeeInsurancePercentage") }))
      .required(t("validation.required", { field: t("fields.regularEmployeeInsurancePercentage") })),
    specialEmployeeInsurancePercentage: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.specialEmployeeInsurancePercentage") }))
      .required(t("validation.required", { field: t("fields.specialEmployeeInsurancePercentage") })),
    pensionStartMonthlySalary: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.pensionStartMonthlySalary") }))
      .min(0, t("validation.minValue", { field: t("fields.pensionStartMonthlySalary"), min: 0 }))
      .required(t("validation.required", { field: t("fields.pensionStartMonthlySalary") })),
    pensionEndMonthlySalary: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.pensionEndMonthlySalary") }))
      .min(0, t("validation.minValue", { field: t("fields.pensionEndMonthlySalary"), min: 0 }))
      .required(t("validation.required", { field: t("fields.pensionEndMonthlySalary") })),
    pensionStartSalary: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.pensionStartSalary") }))
      .min(0, t("validation.minValue", { field: t("fields.pensionStartSalary"), min: 0 }))
      .required(t("validation.required", { field: t("fields.pensionStartSalary") })),
    pensionEndSalary: Yup.number()
      .matches(/^\d*\.?\d+$/, t("validation.numbersOnly", { field: t("fields.pensionEndSalary") }))
      .min(0, t("validation.minValue", { field: t("fields.pensionEndSalary"), min: 0 }))
      .required(t("validation.required", { field: t("fields.pensionEndSalary") })),
  });
};

export default getSocialInsuranceValidationSchema;