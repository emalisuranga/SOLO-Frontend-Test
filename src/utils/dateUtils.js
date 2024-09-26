export const getReiwaYear = (year) => {
  const reiwaStartYear = 2019;
  return year >= reiwaStartYear ? `令和${year - reiwaStartYear + 1}年` : `${year}年`;
};

export const generatePaymentText = (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1 // Adjust to current month (1-based)
) => {
  // Adjust year and month if the current month is January (1)
  if (month === 1) {
    month = 12;
    year -= 1;
  }

  const reiwaYear = getReiwaYear(year);
  const monthText = `${month}月`;
  const paymentText = "支給分";
  return `${reiwaYear}${monthText}${paymentText}`;
};

export const getCurrentYearAndMonth = () => {
  const now = new Date();
  const month = now.getMonth() + 1; 
  const year = now.getFullYear();
  
  return { year, month };
};