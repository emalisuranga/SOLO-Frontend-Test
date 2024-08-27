export const calculateNonEmploymentDeduction = (workDetails, basicSalary) => {
    const { scheduledWorkingDays, adjustedWorkingDays, adjustedScheduledWorkingDays, numberOfPaidHolidays } = workDetails;

    if (!adjustedScheduledWorkingDays || isNaN(adjustedScheduledWorkingDays)) {
        return 0; 
    }

    if (!adjustedWorkingDays || isNaN(adjustedWorkingDays)) {
        return 0; 
    }

    const totalDaysOff = Math.max(0, scheduledWorkingDays - adjustedScheduledWorkingDays - numberOfPaidHolidays);
    const deduction = calculateDeduction(basicSalary,scheduledWorkingDays, totalDaysOff);

    return deduction;
};

export const calculateHolidayAllowance = (basicSalary, workDetails) => {
    const { scheduledWorkingDays, numberOfWorkingDays } = workDetails;
    const extraDays = numberOfWorkingDays - scheduledWorkingDays;
    const dailyRate = basicSalary / scheduledWorkingDays;
    const holidayAllowance = (dailyRate * 1.35) * extraDays;
    return Math.round(holidayAllowance);
    
  };

export const calculateDeduction = (basicSalary,scheduledWorkingDays, totalDaysOff) => {
    const perDayDeduction = Math.ceil(basicSalary / scheduledWorkingDays);
    return perDayDeduction * totalDaysOff;
};