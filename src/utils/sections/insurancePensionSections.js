import { t } from 'i18next';

const createField = (name, type, required, defaultValue) => ({
  name,
  type,
  label: t(`fields.${name}`),
  required,
  defaultValue,
});

const createFields = (data, fieldsConfig) =>
  fieldsConfig.map(field =>
    createField(
      field.name,
      field.type,
      field.required,
      data?.[field.name] || field.defaultValue
    )
  );

  const getSocialInsuranceFields = (socialInsurance) => [
    {
      label: t("sections.insuranceInfo"),
      fields: createFields(socialInsurance, [
        { name: "healthInsurancePercentage", type: "text", required: true, defaultValue: 0 },
        { name: "longTermInsurancePercentage", type: "text", required: true, defaultValue: 0 },
        { name: "regularEmployeeInsurancePercentage", type: "text", required: true, defaultValue: 0 },
        { name: "specialEmployeeInsurancePercentage", type: "text", required: true, defaultValue: 0 },
      ]),
    },
    {
      label: t("sections.pensionInfo"),
      fields: createFields(socialInsurance, [
        { name: "employeePensionPercentage", type: "text", required: true, defaultValue: 0 },
        { name: "pensionStartMonthlySalary", type: "text", required: true, defaultValue: 0 },
        { name: "pensionEndMonthlySalary", type: "text", required: true, defaultValue: 0 },
        { name: "pensionStartSalary", type: "text", required: true, defaultValue: 0 },
        { name: "pensionEndSalary", type: "text", required: true, defaultValue: 0 },
      ]),
    },
  ];
  
  export default getSocialInsuranceFields;