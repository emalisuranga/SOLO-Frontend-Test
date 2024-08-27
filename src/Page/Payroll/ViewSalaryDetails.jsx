import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Card, CardContent, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import useSalaryStore from "../../store/salaryStore";
import EmployeeHeader from "../../Page/Employee/EmployeeHeader";

const ViewSalaryDetails = () => {
  const { t } = useTranslation();
  const { paymentId } = useParams();
  const { fetchSalaryDetailsById, loading, error } = useSalaryStore();
  const [salaryDetails, setSalaryDetails] = useState(null);

  useEffect(() => {
    const getSalaryDetails = async () => {
      const details = await fetchSalaryDetailsById(paymentId);
      setSalaryDetails(details);
    };
    getSalaryDetails();
  }, [paymentId, fetchSalaryDetailsById]);

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

  if (!salaryDetails) {
    return null;
  }

  const renderSalaryDetail = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle1" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  );

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="sections.salaryDetails" />
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>{`${salaryDetails.employee.firstName} ${salaryDetails.employee.lastName}`}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.summary")}</Typography>
              </Grid>
              {renderSalaryDetail(t("fields.totalEarnings"), salaryDetails.totalEarnings)}
              {renderSalaryDetail(t("fields.totalDeductions"), salaryDetails.totalDeductions)}
              {renderSalaryDetail(t("fields.netSalary"), salaryDetails.netSalary)}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.attendanceWorkDetails")}</Typography>
              </Grid>
              {renderSalaryDetail(t("fields.scheduledWorkingDays"), salaryDetails.workDetails.scheduledWorkingDays)}
              {renderSalaryDetail(t("fields.numberOfWorkingDays"), salaryDetails.workDetails.numberOfWorkingDays)}
              {renderSalaryDetail(t("fields.numberOfPaidHolidays"), salaryDetails.workDetails.numberOfPaidHolidays)}
              {renderSalaryDetail(t("fields.remainingPaidVacationDays"), salaryDetails.workDetails.remainingPaidVacationDays)}
              {renderSalaryDetail(t("fields.overtime"), salaryDetails.workDetails.overtime)}
              {renderSalaryDetail(t("fields.timeLate"), salaryDetails.workDetails.timeLate)}
              {renderSalaryDetail(t("fields.timeLeavingEarly"), salaryDetails.workDetails.timeLeavingEarly)}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.earnings")}</Typography>
              </Grid>
              {renderSalaryDetail(t("fields.basicSalary"), salaryDetails.earnings.basicSalary)}
              {renderSalaryDetail(t("fields.overtimePay"), salaryDetails.earnings.overtimePay)}
              {renderSalaryDetail(t("fields.transportationCosts"), salaryDetails.earnings.transportationCosts)}
              {renderSalaryDetail(t("fields.attendanceAllowance"), salaryDetails.earnings.attendanceAllowance)}
              {renderSalaryDetail(t("fields.familyAllowance"), salaryDetails.earnings.familyAllowance)}
              {renderSalaryDetail(t("fields.leaveAllowance"), salaryDetails.earnings.leaveAllowance)}
              {renderSalaryDetail(t("fields.specialAllowance"), salaryDetails.earnings.specialAllowance)}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{t("sections.deductions")}</Typography>
              </Grid>
              {renderSalaryDetail(t("fields.healthInsurance"), salaryDetails.deductions.healthInsurance)}
              {renderSalaryDetail(t("fields.employeePensionInsurance"), salaryDetails.deductions.employeePensionInsurance)}
              {renderSalaryDetail(t("fields.employmentInsurance"), salaryDetails.deductions.employmentInsurance)}
              {renderSalaryDetail(t("fields.longTermCareInsurance"), salaryDetails.deductions.longTermCareInsurance)}
              {renderSalaryDetail(t("fields.socialInsurance"), salaryDetails.deductions.socialInsurance)}
              {renderSalaryDetail(t("fields.incomeTax"), salaryDetails.deductions.incomeTax)}
              {renderSalaryDetail(t("fields.residentTax"), salaryDetails.deductions.residentTax)}
              {renderSalaryDetail(t("fields.advancePayment"), salaryDetails.deductions.advancePayment)}
              {renderSalaryDetail(t("fields.yearEndAdjustment"), salaryDetails.deductions.yearEndAdjustment)}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default ViewSalaryDetails;