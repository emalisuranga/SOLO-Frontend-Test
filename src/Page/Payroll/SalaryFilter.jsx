import React from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const getYears = (currentYear) => {
  const years = [];
  for (let year = currentYear - 5; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

const SalaryFilter = ({ month, year, onMonthChange, onYearChange, onSearch }) => {
    const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const lastMonth = new Date().getMonth(); 

  const getAvailableMonths = () => {
    if (year === currentYear) {
      return months.filter((month) => month.value <= lastMonth);
    }
    return months;
  };

  const months = [
    { value: 1, label: t('months.january') },
    { value: 2, label: t('months.february') },
    { value: 3, label: t('months.march') },
    { value: 4, label: t('months.april') },
    { value: 5, label: t('months.may') },
    { value: 6, label: t('months.june') },
    { value: 7, label: t('months.july') },
    { value: 8, label: t('months.august') },
    { value: 9, label: t('months.september') },
    { value: 10, label: t('months.october') },
    { value: 11, label: t('months.november') },
    { value: 12, label: t('months.december') },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label= {t('Month')}
        variant="outlined"
        value={month}
        onChange={onMonthChange}
        select
        size="small"
        sx={{ width: 150 }}
      >
        {getAvailableMonths().map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label= {t('Year')}
        variant="outlined"
        value={year}
        onChange={onYearChange}
        select
        size="small"
        sx={{ width: 100 }}
      >
        {getYears(currentYear).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={onSearch}>
        {t('Search')}
      </Button>
    </Box>
  );
};

SalaryFilter.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SalaryFilter;