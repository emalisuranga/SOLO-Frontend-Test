import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EmployeeTable from './EmployeeTable';
import useEmployeeStore from '../../store/employeeStore';
import EmployeeSearch from "./EmployeeSearch";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const { employees, loading, fetchEmployees } = useEmployeeStore((state) => ({
    employees: state.employees,
    loading: state.loading,
    fetchEmployees: state.fetchEmployees,
  }));

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (employee) => {
    setSelectedEmployee(employee);
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
            <Button variant="contained" onClick={() => navigate("/add-employee")}>{t('addEmployee')}</Button>
          </Box>
        </Grid>
        <EmployeeSearch onSearch={handleSearch} />
        {selectedEmployee ? (
          <Grid item xs={12}>
            <Typography variant="h6">
              {`${selectedEmployee.firstName} ${selectedEmployee.lastName} (ID: ${selectedEmployee.id})`}
            </Typography>
            <EmployeeTable data={[selectedEmployee]} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <EmployeeTable data={employees} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EmployeeDetails;