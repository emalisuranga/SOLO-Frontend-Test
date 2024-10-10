import { t } from 'i18next';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extract only the date part
};

const createField = (name, type, required = false, defaultValue = '', options = [], readOnly = false, label = '') => ({
  name,
  type,
  label: label || t(`fields.${name}`),  
  required,
  defaultValue,
  options,  
  readOnly,
});

const createFields = ( employee, fieldsConfig, employeeCategory ) =>
  fieldsConfig.map((field) => {
    const fieldValue = field.type === 'date'
      ? formatDate(employee?.[field.name]) 
      : employee?.[field.name] || '';      

    return createField(
      field.name,
      field.type,
      field.required,
      fieldValue,
      field.options || [],  
      field.readOnly || field.name === 'employeeNumber' ,
      field.label 
    );
  });

  const employeeCategories = [
    { value: 'EXECUTIVE', label: t('fields.employeeCategories.executive') },
    { value: 'NON_EXECUTIVE', label: t('fields.employeeCategories.nonExecutive') },
  ];

  const getSections = (employee, employeeCategory) => {
    const isBasicType = employeeCategory === 'DAILY_BASIC' || employeeCategory === 'HOURLY_BASIC';
  
    return [
      {
        label: t("sections.personalInfo"),
        fields: createFields(employee, [
          { name: "lastName", type: "text", required: true },
          { name: "firstName", type: "text", required: true },
          { name: "furiganaLastName", type: "text", required: true },
          { name: "furiganaFirstName", type: "text", required: true },
          { name: "employeeNumber", type: "text", required: true, readOnly: true },
          { name: "phone", type: "text", required: true },
          { name: "address", type: "text", required: true },
          { name: "dateOfBirth", type: "date", required: true },
          { name: "joinDate", type: "date", required: true },
          { name: "department", type: "text", required: true },
          { name: "jobTitle", type: "text" },
          !isBasicType && {
            name: "category",
            type: "select",
            required: true,
            options: employeeCategories,
          },
          { name: "spouseDeduction", type: "text", required: true },
          { name: "dependentDeduction", type: "text", required: true },
        ].filter(Boolean),employeeCategory),
      },
      {
        label: t("sections.bankDetails"),
        fields: createFields(employee?.bankDetails?.[0] || {}, [
          { name: "bankAccountNumber", type: "text" },
          { name: "bankName", type: "text" },
          { name: "branchCode", type: "text" },
        ], employeeCategory),
      },
      {
        label: t("sections.salaryDetails"),
        fields: createFields(employee?.salaryDetails?.[0] || {}, [
          {
            name: "basicSalary",
            type: "text",
            required: true,
            label: employeeCategory === 'DAILY_BASIC' 
                      ? t("fields.dailyRate") 
                      : employeeCategory === 'HOURLY_BASIC' 
                        ? t("fields.hourlyRate") 
                        : t("fields.basicSalary"), 
          },
          { name: "transportationCosts", type: "text", required: true },
          { name: "familyAllowance", type: "text", required: true },
          !isBasicType && { name: "attendanceAllowance", type: "text", required: true },
          { name: "leaveAllowance", type: "text", required: true },
          { name: "specialAllowance", type: "text", required: true },
        ].filter(Boolean), employeeCategory),
      },
    ];
  };

export default getSections;