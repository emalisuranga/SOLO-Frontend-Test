import { t } from 'i18next';
import { generatePaymentText } from './dateUtils';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};

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
      field.type === 'date' ? formatDate(data?.[field.name]) : data?.[field.name] || field.defaultValue || ''
    )
  );

const getSalarySections = (data) => [
  {
    label: t("sections.attendanceWorkDetails"),
    fields: createFields(data, [
      { name: "scheduledWorkingDays", type: "text", required: true, defaultValue: 21 },
      { name: "numberOfWorkingDays", type: "text", required: true, defaultValue: 0 },
      { name: "numberOfNonPaidLeave", type: "text", required: true, defaultValue: 0 },
      { name: "numberOfPaidHolidays", type: "text", required: true, defaultValue: 0 },
      { name: "remainingPaidVacationDays", type: "text", required: true, defaultValue: 0 },
      { name: "overtime", type: "text", required: true, defaultValue: 0 },
      { name: "timeLate", type: "text", required: true, defaultValue: 0 },
      { name: "timeLeavingEarly", type: "text", required: true, defaultValue: 0 },
      { name: "slipName", type: "text", required: true, defaultValue: generatePaymentText() },
    ]),
  },
  {
    label: t("sections.earnings"),
    fields: createFields(data?.salaryDetails?.[0] || {}, [
      { name: "transportationCosts", type: "text", required: true },
      { name: "attendanceAllowance", type: "text", required: true },
      { name: "familyAllowance", type: "text", required: true },
      { name: "leaveAllowance", type: "text", required: true },
      { name: "specialAllowance", type: "text", required: true },
      { name: "holidayAllowance", type: "text", required: true },
      { name: "overtimePay", type: "text", required: true },
      { name: "nonEmploymentDeduction", type: "text", required: true },
    ]),
  },
  {
    label: t("sections.deductions"),
    fields: createFields(data, [
      { name: "healthInsurance", type: "text", required: true, defaultValue: 0 },
      { name: "employeePensionInsurance", type: "text", required: true, defaultValue: 0 },
      { name: "employmentInsurance", type: "text", required: true, defaultValue: 0 },
      { name: "longTermCareInsurance", type: "text", required: true, defaultValue: 0 },
      { name: "incomeTax", type: "text", required: true, defaultValue: 0 },
      { name: "residentTax", type: "text", required: true, defaultValue: 0 },
      { name: "advancePayment", type: "text", required: true, defaultValue: 0 },
      { name: "yearEndAdjustment", type: "text", required: true, defaultValue: 0 },
      { name: "refundAmount", type: "text", required: true, defaultValue: 0 },
    ]),
  },
];

export default getSalarySections;