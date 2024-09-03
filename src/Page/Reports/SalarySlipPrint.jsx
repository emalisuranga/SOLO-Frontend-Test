import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableRow,
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import {
  CustomTableCell,
  VerticalTableCellPrint,
} from "./SalarySlipDetails/SalarySlipDetails.styles";

const SalarySlipPrint = ({ salarySlip }) => {
  useEffect(() => {
    const adjustScale = () => {
      const content = document.getElementById("salary-slip");
      const scale = Math.min(window.innerWidth / content.offsetWidth, 1);
      content.style.transform = `scale(${scale})`;
    };

    window.addEventListener("resize", adjustScale);
    adjustScale();

    return () => window.removeEventListener("resize", adjustScale);
  });

  if (!salarySlip) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Paper
        id="salary-slip"
        sx={{
          p: 2,
        }}
      >
        <Table sx={{ width: "450px", height: 50 }}>
          <TableBody>
            <TableRow>
              <CustomTableCell>
                <Typography variant="h6" align="center">
                  株式会社SOLA
                </Typography>
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">{salarySlip.slipName}</Typography>
                  <Typography variant="body2">給料明細書</Typography>
                </Box>
              </CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">{`${salarySlip.employee.lastName} ${salarySlip.employee.firstName}`}</Typography>
                  <Typography variant="body1">殿</Typography>
                </Box>
              </CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ mt: 1 }}>
          <Table sx={{ width: "250px" }}>
            <TableBody>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    部門名
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.employee.department}`}
                  </Typography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    役職名
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                  {`${salarySlip.employee.jobTitle}`}
                  </Typography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    社員NO
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.employeeId}`}
                  </Typography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* <Grid container spacing={2} sx={{ mt: 10 }}>
          <Grid item xs={5}>
            <Typography variant="body2" align="left">
              {salarySlip.slipName}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" align="left">
              給料明細書
            </Typography>
          </Grid>
        </Grid> */}

        {/* <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Table sx={{ width: 1000 }}>
            <TableBody>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    部門名
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography
                    variant="body2"
                    align="center"
                  >{`${salarySlip.employee.department}`}</Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    社員NO
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography
                    variant="body2"
                    align="center"
                  >{`${salarySlip.employeeId}`}</Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    氏名
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography
                    variant="body2"
                    align="center"
                  >{`${salarySlip.employee.firstName} ${salarySlip.employee.lastName}`}</Typography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box> */}

        <Grid
          container
          columnSpacing={{ md: 30 }}
          sx={{ mt: 1, marginTop: "50px" }}
        >
          <Grid item xs={8}>
            <Table sx={{ height: 100, width: "100%" }}>
              <TableBody>
                <TableRow>
                  <VerticalTableCellPrint rowSpan={4}>
                    <Typography variant="body2" align="center">
                      勤怠
                    </Typography>
                  </VerticalTableCellPrint>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {/* 所定労働日数/Scheduled working days */}
                      所定労働日数
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      出勤日数
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {/* 法定時間外/Overtime */}
                      法定時間外
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      遅刻時間
                    </Typography>
                  </CustomTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.scheduledWorkingDays}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.numberOfWorkingDays}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.overtime}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLate}`}
                    </Typography>
                  </CustomTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      早退時間
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {/* 控除時間/Deductions */}
                      控除時間
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {/* 有給休暇日数/Number of paid holidays */}
                      有給休暇日数
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      残有給日数
                    </Typography>
                  </CustomTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLeavingEarly}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLeavingEarly}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.workDetails.numberOfPaidHolidays}`}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Typography variant="body2" align="center">
                      {`${salarySlip.employee.paidHolidays[0].remainingLeave}`}
                    </Typography>
                  </CustomTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={4}>
            <Table sx={{ height: 100, width: "100%" }}>
              <TableBody>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="h6" align="center">
                      差引支給額
                    </Typography>
                  </CustomTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="h4" align="center">
                      {`${salarySlip.netSalary}`}
                    </Typography>
                  </CustomTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        <Grid sx={{ mt: 1 }}>
          <Table sx={{ height: 100 }}>
            <TableBody>
              {/* First Row */}
              <TableRow>
                <VerticalTableCellPrint rowSpan={4}>
                  <Typography variant="body2" align="center">
                    支給
                  </Typography>
                </VerticalTableCellPrint>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    役員報酬
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {/* 残業手当/overtime pay */}
                    残業手当
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {/* 交通費/Transportation costs */}
                    交通費
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {/* 家族手当/Family allowance */}
                    家族手当
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    精勤手当
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    休日手当
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
              </TableRow>

              {/* Second Row */}
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.basicSalary}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.overtimePay}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.transportationCosts}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.familyAllowance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.attendanceAllowance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.holidayAllowance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
              </TableRow>

              {/* Third Row */}
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {/* 特別手当/Special allowance */}
                    特別手当
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {/* 不就労控除/Non-employment deduction */}
                    不就労控除
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    総支給額
                  </Typography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.earnings.specialAllowance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.nonEmploymentDeduction}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.totalEarnings}`}
                  </Typography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        <Grid sx={{ mt: 2 }}>
          <Table sx={{ height: 100 }}>
            <TableBody>
              {/* First Row */}
              <TableRow>
                <VerticalTableCellPrint rowSpan={4}>
                  <Typography variant="body2" align="center">
                    控除
                  </Typography>
                </VerticalTableCellPrint>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    介護保険
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    健康保険
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    厚生年金
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    雇用保険
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    社会保険料計
                  </Typography>
                </CustomTableCell>
              </TableRow>

              {/* Second Row */}
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.longTermCareInsurance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.healthInsurance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.employeePensionInsurance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.employmentInsurance}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.socialInsurance}`}
                  </Typography>
                </CustomTableCell>
              </TableRow>

              {/* Third Row */}
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    年末調整
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    住民税
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    前払金
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    還付金等
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    所得税
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    控除計
                  </Typography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <Typography variant="body2" align="center"></Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.yearEndAdjustment}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.residentTax}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.advancePayment}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.refundAmount}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {`${salarySlip.deductions.incomeTax}`}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell>
                  <Typography variant="body2" align="center">
                    {salarySlip.totalDeductions}
                  </Typography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <TextField
          type="text"
          label="備考"
          name="remarks"
          value={salarySlip.remarks}
          fullWidth
          sx={{ mt: 4 }}
          multiline
          minRows={10}
          maxRows={10}
        />
      </Paper>
    </Box>
  );
};

export default SalarySlipPrint;
