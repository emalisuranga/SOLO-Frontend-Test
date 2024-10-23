import { t } from 'i18next';
import { generatePaymentText } from './dateUtils';
import { DEFAULT_SCHEDULED_WORKING_DAYS } from "../constants/constants";


const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};

const createField = (name, type, required, defaultValue, label) => ({
  name,
  type,
  label: t(`fields.${label || name}`),
  required,
  defaultValue,
});

const createFields = (data, fieldsConfig) =>
  fieldsConfig.map(field =>
    createField(
      field.name,
      field.type,
      field.required,
      field.type === 'date' ? formatDate(data?.[field.name]) : data?.[field.name] || field.defaultValue || '',
      field.label 
    )
  );

const getSalarySections = (data, employeeCategory) => {
  const isBasicType = employeeCategory === 'DAILY_BASIC' || employeeCategory === 'HOURLY_BASIC';
  
  const attendanceFields = [
    {
      name: "scheduledWorkingDays",
      type: "text",
      required: true,
      defaultValue: employeeCategory === "MONTHLY_BASIC" ? DEFAULT_SCHEDULED_WORKING_DAYS : 0,
    },
    {
      name: "numberOfWorkingDays",
      label: isBasicType && employeeCategory === 'HOURLY_BASIC' ? "numberOfHours" : "numberOfWorkingDays",
      type: "text",
      required: true,
      defaultValue: 0,
    },
    { name: "overtime", type: "text", required: true, defaultValue: 0 },
    { name: "timeLate", type: "text", required: true, defaultValue: 0 },
    { name: "timeLeavingEarly", type: "text", required: true, defaultValue: 0 },
    { name: "slipName", type: "text", required: true, defaultValue: generatePaymentText() },
  ];

  // Add leave-related fields only if not in DAILY_BASIC or HOURLY_BASIC category
  if (!isBasicType) {
    attendanceFields.push(
      { name: "numberOfNonPaidLeave", type: "text", required: true, defaultValue: 0 },
      { name: "numberOfPaidHolidays", type: "text", required: true, defaultValue: 0 },
      { name: "remainingPaidVacationDays", type: "text", required: true, defaultValue: 0 }
    );
  }

  return [
    {
      label: t("sections.attendanceWorkDetails"),
      fields: createFields(data, attendanceFields),
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
};

export default getSalarySections;