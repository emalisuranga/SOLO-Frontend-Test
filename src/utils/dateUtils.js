export const getReiwaYear = (year) => {
  const reiwaStartYear = 2019;
  return year >= reiwaStartYear ? `令和${year - reiwaStartYear + 1}年` : `${year}年`;
};

export const generatePaymentText = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  // Adjust year and month if current month is January (0)
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const reiwaYear = getReiwaYear(year);
  const monthText = `${month}月`;
  const paymentText = "支給分";
  return `${reiwaYear}${monthText}${paymentText}`;
};