import {
    calculateNonEmploymentDeduction,
    calculateHolidayAllowance,
    calculateDeduction,
  } from "../utils/salaryCalculations";

export const parseInputValue = (name, value) => {
    if (name === 'slipName') {
      return value;
    } else if (!isNaN(value) && value.trim() !== '') {
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
  
    const adjustedScheduledWorkingDays = scheduledWorkingDays - numberOfPaidHolidays;
    const adjustedWorkingDays = numberOfWorkingDays - numberOfNonPaidLeave;
  
    if (scheduledWorkingDays >= numberOfWorkingDays) {
      const checkCorrectDayOff = scheduledWorkingDays - numberOfWorkingDays;
      const currantDayOff = numberOfNonPaidLeave + numberOfPaidHolidays;
  
      if (checkCorrectDayOff !== currantDayOff) {
        console.log("Please check the number of days off");
        return null;
      }
  
      const totalNonPaidDaysOff = Math.max(0, numberOfNonPaidLeave - numberOfPaidHolidays);
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