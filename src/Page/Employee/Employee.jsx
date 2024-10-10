import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EmployeeTable from './EmployeeTable';
import useEmployeeStore from '../../store/employeeStore';
import EmployeeSearch from "./EmployeeSearch";
import MultiOptionDialog from "../../component/MultiOptionDialog";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { employees, loading, fetchEmployees, setEmployeeCategory } = useEmployeeStore((state) => ({
    employees: state.employees,
    loading: state.loading,
    fetchEmployees: state.fetchEmployees,
    setEmployeeCategory: state.setEmployeeCategory,
  }));

  const OPTION_KEYS = {
    MONTHLY_BASIC: "MONTHLY_BASIC",
    DAILY_BASIC: "DAILY_BASIC",
    HOURLY_BASIC: "HOURLY_BASIC",
  };

  const BUTTON_COLORS = {
    MONTHLY_BASIC: "primary",
    DAILY_BASIC: "secondary",
    HOURLY_BASIC: "success",
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOptionSelect = (selectedOption) => {
    console.log("Selected Option:", selectedOption);
    setEmployeeCategory(selectedOption);
    navigate("/add-employee");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">{t('Employee Details')}</Typography>
            {/* <Button variant="contained" onClick={() => navigate("/add-employee")}>{t('addEmployee')}</Button> */}
             <Button variant="contained" onClick={() => setDialogOpen(true)}>{t('addEmployee')}</Button>
          </Box>
        </Grid>
        <EmployeeSearch onSearch={handleSearch} />
        {selectedEmployee ? (
          <Grid item xs={12}>
            <Typography variant="h6">
              {`${selectedEmployee.lastName} ${selectedEmployee.firstName} (ID: ${selectedEmployee.employeeNumber})`}
            </Typography>
            <EmployeeTable data={[selectedEmployee]} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <EmployeeTable data={employees} />
          </Grid>
        )}
      </Grid>

      <MultiOptionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSelect={handleOptionSelect}
        titleKey="chooseEmployeeCategory" 
        descriptionKey="employeeCategoryDescription" 
        optionKeys={Object.values(OPTION_KEYS)}
        optionButtonColors={Object.values(BUTTON_COLORS)}
      />
    </Box>
  );
};

export default EmployeeDetails;