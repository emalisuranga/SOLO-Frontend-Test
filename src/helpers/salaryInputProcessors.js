import {
  calculateNonEmploymentDeduction,
  calculateHolidayAllowance,
  calculateDeduction,
} from "../utils/salaryCalculations";

export const parseInputValue = (name, value) => {
  if (name === 'slipName') {
    return value;
  }

  if (name === 'numberOfWorkingDays') {
    if (value.trim() === '') {
      return ''; 
    }

    if (!isNaN(value)) {
      if (value.includes('.')) {
        return value; 
      }
      return parseFloat(value); 
    } else {
      console.warn(`Invalid input for ${name}: "${value}". Expected a number.`);
      return 0;
    }
  }

  if (!isNaN(value) && value.trim() !== '') {
    return Number(value);
  } else {
    console.warn(`Invalid input for ${name}: "${value}". Expected a number.`);
    return 0;
  }
};

export const calculateDeductionsAndAllowance = (formData) => {
  const {
    scheduledWorkingDays,
    numberOfWorkingDays,
    numberOfPaidHolidays = 0,
    numberOfNonPaidLeave = 0,
    basicSalary,
  } = formData;

  const adjustedScheduledWorkingDays =
    scheduledWorkingDays - numberOfPaidHolidays;
  const adjustedWorkingDays = numberOfWorkingDays - numberOfNonPaidLeave;

  if (scheduledWorkingDays >= numberOfWorkingDays) {
    const checkCorrectDayOff = scheduledWorkingDays - numberOfWorkingDays;
    const currantDayOff = numberOfNonPaidLeave + numberOfPaidHolidays;

    if (checkCorrectDayOff !== currantDayOff) {
      return null;
    }

    const totalNonPaidDaysOff = Math.max(0,numberOfNonPaidLeave - numberOfPaidHolidays);
    return {
      nonEmploymentDeduction: calculateDeduction(
        basicSalary,
        scheduledWorkingDays,
        totalNonPaidDaysOff
      ),
      holidayAllowance: 0,
    };
  }

  return {
    nonEmploymentDeduction: calculateNonEmploymentDeduction(
      {
        adjustedScheduledWorkingDays,
        adjustedWorkingDays,
        scheduledWorkingDays,
        numberOfPaidHolidays,
      },
      basicSalary
    ),
    holidayAllowance: calculateHolidayAllowance(basicSalary, {
      scheduledWorkingDays: adjustedScheduledWorkingDays,
      numberOfWorkingDays: adjustedWorkingDays,
    }),
  };
};

export const shouldShowGenerateButton = (name) => {
  return [
    "healthInsurance",
    "employeePensionInsurance",
    "employmentInsurance",
    "longTermCareInsurance",
  ].includes(name);
};

export const calculateOvertimePayment = (workDetails, employeeCategory) => {
  const { basicSalary, scheduledWorkingDays, overtime } = workDetails;
  const overtimeInDecimal = Math.floor(overtime) + ((overtime % 1) / 0.6);

  let calculatedValue;
  if (employeeCategory === 'DAILY_BASIC') {
    calculatedValue = (basicSalary / 8) * 1.25 * overtimeInDecimal;
  } else {
    calculatedValue = (basicSalary / scheduledWorkingDays / 8) * 1.25 * overtimeInDecimal;
  }

  const finalPayment = Math.ceil(calculatedValue);
  return finalPayment;
};
