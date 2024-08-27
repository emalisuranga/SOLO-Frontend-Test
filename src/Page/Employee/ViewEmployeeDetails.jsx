import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Card, CardContent, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import useEmployeeStore from "../../store/employeeStore";
import EmployeeHeader from '../../Page/Employee/EmployeeHeader';

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { employee, loading, fetchEmployeeDetails, error } = useEmployeeStore();

  useEffect(() => {
    fetchEmployeeDetails(id);
  }, [id, fetchEmployeeDetails]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!employee) {
    return null;
  }

  const renderEmployeeDetail = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle1" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value}
      </Typography>
    </Grid>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const calculateTotalAllowance = () => {
    return [
      employee.salaryDetails?.transportationCosts,
      employee.salaryDetails?.familyAllowance,
      employee.salaryDetails?.attendanceAllowance,
      employee.salaryDetails?.leaveAllowance,
      employee.salaryDetails?.specialAllowance,
    ].reduce((acc, allowance) => acc + (allowance || 0), 0);
  };

  const totalAllowance = calculateTotalAllowance();
  const totalCompensation = (employee.salaryDetails?.basicSalary || 0) + totalAllowance;

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="fields.employeeDetails" />
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>{`${employee.firstName} ${employee.lastName}`}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("fields.personalInformation")}</Typography>
              </Grid>
              {renderEmployeeDetail(t("fields.phone"), employee.phone)}
              {renderEmployeeDetail(t("fields.address"), employee.address)}
              {renderEmployeeDetail(t("fields.dateOfBirth"), formatDate(employee.dateOfBirth))}
              {renderEmployeeDetail(t("fields.joinDate"), formatDate(employee.joinDate))}
              {renderEmployeeDetail(t("fields.department"), employee.department)}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.bankDetails")}</Typography>
              </Grid>
              {renderEmployeeDetail(t("fields.bankAccountNumber"), employee.bankDetails?.bankAccountNumber)}
              {renderEmployeeDetail(t("fields.bankName"), employee.bankDetails?.bankName)}
              {renderEmployeeDetail(t("fields.branchCode"), employee.bankDetails?.branchCode)}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.salaryDetails")}</Typography>
              </Grid>
              {renderEmployeeDetail(t("fields.basicSalary"), employee.salaryDetails?.basicSalary)}
              {renderEmployeeDetail(t("fields.totalAllowance"), totalAllowance)}
              {renderEmployeeDetail(t("fields.totalCompensation"), totalCompensation)}
              {renderEmployeeDetail(t("fields.transportationCosts"), employee.salaryDetails?.transportationCosts)}
              {renderEmployeeDetail(t("fields.familyAllowance"), employee.salaryDetails?.familyAllowance)}
              {renderEmployeeDetail(t("fields.attendanceAllowance"), employee.salaryDetails?.attendanceAllowance)}
              {renderEmployeeDetail(t("fields.leaveAllowance"), employee.salaryDetails?.leaveAllowance)}
              {renderEmployeeDetail(t("fields.specialAllowance"), employee.salaryDetails?.specialAllowance)}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default EmployeeDetails;