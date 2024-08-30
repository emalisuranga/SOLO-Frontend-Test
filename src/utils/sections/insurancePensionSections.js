import { t } from 'i18next';

const createField = (name, type, required, defaultValue) => ({
    name,
    type,
    label: t(`fields.${name}`), // Use translation for labels
    required,
    defaultValue,
});

export const getSocialInsuranceFields = (data) => [
    createField("healthInsurancePercentage", "text", true, data?.healthInsurancePercentage || 0.0998),
    createField("longTermInsurancePercentage", "text", true, data?.longTermInsurancePercentage || 0.1158),
    createField("employeePensionPercentage", "text", true, data?.employeePensionPercentage || 0.183),
    createField("regularEmployeeInsurancePercentage", "text", true, data?.regularEmployeeInsurancePercentage || 0.006),
    createField("specialEmployeeInsurancePercentage", "text", true, data?.specialEmployeeInsurancePercentage || 0.007),
    createField("pensionStartMonthlySalary", "text", true, data?.pensionStartMonthlySalary || 88000),
    createField("pensionEndMonthlySalary", "text", true, data?.pensionEndMonthlySalary || 650000),
    createField("pensionStartSalary", "text", true, data?.pensionStartSalary || 93000),
    createField("pensionEndSalary", "text", true, data?.pensionEndSalary || 665000),
];

export default getSocialInsuranceFields;