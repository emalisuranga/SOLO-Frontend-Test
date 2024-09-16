import getValidationSchema from "./validationSchemaForEmployee";
import { getSalaryValidationSchema } from "./validationSchemaForSalary";
import getSections from "./employeeSections";
import { generatePaymentText } from "./dateUtils";
import { parseInputValue, calculateDeductionsAndAllowance, shouldShowGenerateButton, calculateOvertimePayment } from '../helpers/ salaryInputProcessors';
import { employeeStore } from "../store/employeeStore";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const getFieldValue = (initialData, field) => {
  if (initialData[field.name] !== undefined) {
    if (field.type === 'date') {
      return formatDate(initialData[field.name]);
    }
    return initialData[field.name];
  }

  if (initialData.bankDetails?.[field.name] !== undefined) {
    return initialData.bankDetails[field.name];
  }

  if (initialData.salaryDetails?.[field.name] !== undefined) {
    return initialData.salaryDetails[field.name];
  }

  const defaultFields = [
    'transportationCosts',
    'familyAllowance',
    'attendanceAllowance',
    'leaveAllowance',
    'specialAllowance',
    'spouseDeduction',
    'dependentDeduction',
  ];

  if (defaultFields.includes(field.name)) {
    return '0'; 
  }

  return ''; 
};

export const initializeFormData = (sections, initialData = {}, mode) => {
  const formData = {};
  console.log('sections', sections);

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      console.log('field', field);
      if (mode === 'add' && field.name === 'employeeNumber') {
        const nextEmployeeNumber = employeeStore().nextEmployeeNumber;
        formData[field.name] = {
          ...field,
          value: nextEmployeeNumber,
        };
      } else {
        const fieldValue = getFieldValue(initialData, field);

        formData[field.name] = {
          ...field, 
          value: fieldValue !== undefined ? fieldValue : '', 
        };
      }
    });
  });

  return formData;
};

export const cleanInitializeFormData = () => {
  const sections = getSections({});
  const formData = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      formData[field.name] = field.type === "date" ? "" : "";
    });
  });

  return formData;
};

export const initializeAddSalaryFormData = (sections, employeeData = {}) => {
  const formData = {};
  const { salaryDetails, deductions } = employeeData;

  sections.forEach(({ fields }) => {
    fields.forEach(({ name, defaultValue }) => {
      if (employeeData[name] !== undefined) {
        formData[name] = employeeData[name];
      } else if (salaryDetails && salaryDetails[name] !== undefined) {
        formData[name] = salaryDetails[name];
      } else if (deductions && deductions[name] !== undefined) {
        formData[name] = deductions[name];
      } else {
        formData[name] = defaultValue || 0;
      }
    });
  });

  formData.basicSalary =
    salaryDetails?.basicSalary !== undefined ? salaryDetails.basicSalary : 0;
  formData.slipName = generatePaymentText();
  console.log(formData);

  return formData;
};

export const initializeUpdateSalaryFormData = (sections, salaryData = {}) => {
  const formData = {};
  const { workDetails, earnings, deductions, slipName } = salaryData;

  sections.forEach(({ fields }) => {
    fields.forEach(({ name, defaultValue }) => {
      if (salaryData[name] !== undefined) {
        formData[name] = salaryData[name];
      } else if (workDetails && workDetails[name] !== undefined) {
        formData[name] = workDetails[name];
      } else if (earnings && earnings[name] !== undefined) {
        formData[name] = earnings[name];
      } else if (deductions && deductions[name] !== undefined) {
        formData[name] = deductions[name];
      } else {
        formData[name] = defaultValue || 0;
      }
    });
  });

  formData.basicSalary =
    earnings?.basicSalary !== undefined ? earnings.basicSalary : 0;
  formData.slipName = slipName || generatePaymentText();
  formData.overtimePay = earnings.overtimePay || 0;
  formData.socialInsurance = deductions.socialInsurance || 0;

  return formData;
};

export const handleFormChange = (formData, setFormData) => (event) => {
  const { name, value } = event.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

export const validateForm = async (formData, t) => {
  // console.log(formData);
  const validationSchema = getValidationSchema(t);

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
    console.log("validationErrors", validationErrors);
    return validationErrors;
  }
};

export const salaryValidation = async (formData, t) => {
  const validationSchema = getSalaryValidationSchema(t);

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

export const transformFormDataForSalary = (formData, initialData) => {
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();

  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return {
    id: initialData.id,
    employeeId: initialData.employeeId
      ? initialData.employeeId
      : initialData.id,
    month: month,
    year: year,
    slipName: formData.slipName,
    dateOfBirth: initialData.dateOfBirth
      ? initialData.dateOfBirth
      : initialData.employee.dateOfBirth,
    workDetails: {
      scheduledWorkingDays: parseInt(formData.scheduledWorkingDays, 10),
      numberOfWorkingDays: parseInt(formData.numberOfWorkingDays, 10),
      numberOfPaidHolidays: parseInt(formData.numberOfPaidHolidays, 10),
      remainingPaidVacationDays: parseInt(
        formData.remainingPaidVacationDays,
        10
      ),
      overtime: parseFloat(formData.overtime),
      timeLate: parseFloat(formData.timeLate),
      timeLeavingEarly: parseFloat(formData.timeLeavingEarly),
      numberOfNonPaidLeave: parseInt(formData.numberOfNonPaidLeave, 10),
    },
    earnings: {
      basicSalary: parseFloat(
        initialData.salaryDetails
          ? initialData.salaryDetails.basicSalary
          : initialData.earnings.basicSalary
      ),
      overtimePay: parseFloat(formData.overtimePay),
      transportationCosts: parseFloat(formData.transportationCosts),
      attendanceAllowance: parseFloat(formData.attendanceAllowance),
      familyAllowance: parseFloat(formData.familyAllowance),
      leaveAllowance: parseFloat(formData.leaveAllowance),
      specialAllowance: parseFloat(formData.specialAllowance),
      holidayAllowance: parseFloat(formData.holidayAllowance),
    },
    deductions: {
      healthInsurance: parseFloat(formData.healthInsurance),
      employeePensionInsurance: parseFloat(formData.employeePensionInsurance),
      employmentInsurance: parseFloat(formData.employmentInsurance),
      longTermCareInsurance: parseFloat(formData.longTermCareInsurance),
      socialInsurance: parseFloat(formData.socialInsurance),
      incomeTax: parseFloat(formData.incomeTax),
      residentTax: parseFloat(formData.residentTax),
      advancePayment: parseFloat(formData.advancePayment),
      yearEndAdjustment: parseFloat(formData.yearEndAdjustment),
      nonEmploymentDeduction: parseFloat(formData.nonEmploymentDeduction),
      refundAmount: parseFloat(formData.refundAmount),
    },
  };
};

export const transformFormDataForIncomeTax = (formData, initialData) => {
  return {
    id: initialData.id,
    employeeId: initialData.employeeId
      ? initialData.employeeId
      : initialData.id,
    earnings: {
      basicSalary: parseFloat(
        initialData.salaryDetails
          ? initialData.salaryDetails.basicSalary
          : initialData.earnings.basicSalary
      ),
      overtimePay: parseFloat(formData.overtimePay),
      transportationCosts: parseFloat(formData.transportationCosts),
      attendanceAllowance: parseFloat(formData.attendanceAllowance),
      familyAllowance: parseFloat(formData.familyAllowance),
      leaveAllowance: parseFloat(formData.leaveAllowance),
      specialAllowance: parseFloat(formData.specialAllowance),
      holidayAllowance: parseFloat(formData.holidayAllowance),
    },
    socialInsurance: {
      healthInsurance: parseFloat(formData.healthInsurance),
      employeePensionInsurance: parseFloat(formData.employeePensionInsurance),
      employmentInsurance: parseFloat(formData.employmentInsurance),
      longTermCareInsurance: parseFloat(formData.longTermCareInsurance),
    },
    nonEmploymentDeduction: parseFloat(formData.nonEmploymentDeduction),
  };
};

export const getInitialFormData = (employeeData = {}) => {
  return cleanInitializeFormData(employeeData);
};

export const handleFormChangeUtil = (formData, setFormData, setShowGenerateButton) => (event) => {
  const { name, value } = event.target;
  const parsedValue = parseInputValue(name, value);
  const updatedFormData = { ...formData, [name]: parsedValue };

  if (["numberOfWorkingDays", "numberOfPaidHolidays", "numberOfNonPaidLeave"].includes(name)) {
    const deductionsAndAllowance = calculateDeductionsAndAllowance(updatedFormData);
    if (deductionsAndAllowance) {
      updatedFormData.nonEmploymentDeduction = deductionsAndAllowance.nonEmploymentDeduction;
      updatedFormData.holidayAllowance = deductionsAndAllowance.holidayAllowance;
    }
  }

  if (["overtime"].includes(name)) {
    const overtimePay = calculateOvertimePayment(updatedFormData);
    if (overtimePay) {
      updatedFormData.overtimePay =overtimePay;
    }
  }

  if (shouldShowGenerateButton(name)) {
    setShowGenerateButton(true);
  }

  setFormData(updatedFormData);
};