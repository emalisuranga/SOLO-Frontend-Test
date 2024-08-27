import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSalaryStore from "../../store/salaryStore";
import SalaryFilter from "./SalaryFilter";
import SalaryTable from "../../Page/Payroll/SalaryTable";
import Loading from "../../component/Common/Loading";
import Error from "../../component/Common/Error";
import { useTranslation } from 'react-i18next';

const SalaryDetailsTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { salaries, fetchSalaryDetailsByMonth, loading, error } =
    useSalaryStore();

  const currentYear = new Date().getFullYear();
  const lastMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth(); // If current month is January, set lastMonth to December

  const [month, setMonth] = useState(lastMonth);
  const [year, setYear] = useState(currentYear);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSearch = () => {
    fetchSalaryDetailsByMonth(month, year);
  };

  useEffect(() => {
    fetchSalaryDetailsByMonth(month, year);
  }, [month, year, fetchSalaryDetailsByMonth]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">{t('sections.salaryDetails')}</Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/add-salary-details")}
            >
              {t('addSalaryForm')}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <SalaryFilter
            month={month}
            year={year}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onSearch={handleSearch}
          />
        </Grid>
        <Grid item xs={12}>
          <SalaryTable
            salaries={salaries}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalaryDetailsTable;
