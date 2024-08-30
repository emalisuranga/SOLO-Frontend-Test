import { t } from 'i18next';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extract only the date part
};

const createField = (name, type, required, defaultValue) => ({
  name,
  type,
  label: t(`fields.${name}`), 
  required,
  defaultValue,
});

const createFields = (employee, fieldsConfig) => 
  fieldsConfig.map(field => 
    createField(
      field.name,
      field.type,
      field.label,
      field.required,
      field.type === 'date' ? formatDate(employee?.[field.name]) : employee?.[field.name] || ''
    )
  );

  const getSections = (employee) => [
    {
      label: t("sections.personalInfo"),
      fields: createFields(employee, [
        { name: "lastName", type: "text", required: true },
        { name: "firstName", type: "text", required: true },
        { name: "furiganaLastName", type: "text", required: true },
        { name: "furiganaFirstName", type: "text", required: true },
        { name: "phone", type: "text", required: true },
        { name: "address", type: "text", required: true },
        { name: "dateOfBirth", type: "date", required: true },
        { name: "joinDate", type: "date", required: true },
        { name: "department", type: "text", required: true },
        { name: "spouseDeduction", type: "text", required: true },
        { name: "dependentDeduction", type: "text", required: true },
      ]),
    },
    {
      label: t("sections.bankDetails"),
      fields: createFields(employee?.bankDetails?.[0] || {}, [
        { name: "bankAccountNumber", type: "text" },
        { name: "bankName", type: "text" },
        { name: "branchCode", type: "text" },
      ]),
    },
    {
      label: t("sections.salaryDetails"),
      fields: createFields(employee?.salaryDetails?.[0] || {}, [
        { name: "basicSalary", type: "text", required: true },
        // { name: "overtimePay", type: "text", required: true },
        { name: "transportationCosts", type: "text", required: true },
        { name: "familyAllowance", type: "text", required: true },
        { name: "attendanceAllowance", type: "text", required: true },
        { name: "leaveAllowance", type: "text", required: true },
        { name: "specialAllowance", type: "text", required: true },
      ]),
    },
  ];

export default getSections;