export const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  
  export const formatSalarySlipData = (data) => {
    return {
      ...data,
      totalEarnings: formatNumberWithCommas(data.totalEarnings),
      totalDeductions: formatNumberWithCommas(data.totalDeductions),
      netSalary: formatNumberWithCommas(data.netSalary),
      earnings: {
        ...data.earnings,
        basicSalary: formatNumberWithCommas(data.earnings.basicSalary),
        attendanceAllowance: formatNumberWithCommas(data.earnings.attendanceAllowance),
        holidayAllowance: formatNumberWithCommas(data.earnings.holidayAllowance),
      },
      deductions: {
        ...data.deductions,
        healthInsurance: formatNumberWithCommas(data.deductions.healthInsurance),
        employeePensionInsurance: formatNumberWithCommas(data.deductions.employeePensionInsurance),
        employmentInsurance: formatNumberWithCommas(data.deductions.employmentInsurance),
        socialInsurance: formatNumberWithCommas(data.deductions.socialInsurance),
        incomeTax: formatNumberWithCommas(data.deductions.incomeTax),
        nonEmploymentDeduction: formatNumberWithCommas(data.deductions.nonEmploymentDeduction),
        refundAmount: formatNumberWithCommas(data.deductions.refundAmount),
      }
    };
  };