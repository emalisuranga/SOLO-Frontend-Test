import React, { useState, useEffect,  useCallback } from "react";
import {
  Table,
  TableBody,
  TableRow,
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import useSalarySlipStore from "../../../store/salarySlipStore";
import Loading from "../../../component/Common/Loading";
import {
  CustomTableCell,
  SmallTypography,
  VerticalTableCell,
  ColoredTableCell,
} from "./SalarySlipDetails.styles";
import SalarySlipPrint from "../SalarySlipPrint";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../../../utils/responseHandlers";
import CustomSnackbar from "../../../component/Common/CustomSnackbar";
import { formatSalarySlipData } from '../../../utils/formatUtils';

const SalarySlipDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employeeId, paymentDetailsId } = useParams();
  const { salarySlip, loading, error, fetchSalarySlipDetails, updateRemarks, setSalarySlip } =
    useSalarySlipStore();
  const [remarks, setRemarks] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchAndSetSalarySlipDetails = useCallback(async () => {
    try {
      const result = await fetchSalarySlipDetails(parseInt(employeeId, 10), parseInt(paymentDetailsId, 10));
      if (result) {
        const formattedData = formatSalarySlipData(result);
        setSalarySlip(formattedData);
        handleSuccess(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, t("actions.fetchSalarySlipSuccess"));
      } else {
        throw new Error('Data not found');
      }
    } catch (error) {
      handleError(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, error, t("actions.fetchSalarySlipError"));
    }
  }, [employeeId, paymentDetailsId, fetchSalarySlipDetails, setSalarySlip, t]);

  useEffect(() => {
    fetchAndSetSalarySlipDetails();
  }, [fetchAndSetSalarySlipDetails]);

  useEffect(() => {
    if (salarySlip && salarySlip.remarks !== undefined) {
      setRemarks(salarySlip.remarks || "");
    }
  }, [salarySlip]);

  const handleSubmit = async () => {
    try {
      await updateRemarks(paymentDetailsId, remarks);
      handleSuccess(
        setSnackbarMessage,
        setSnackbarSeverity,
        setSnackbarOpen,
        t("actions.remark_submit_message")
      );
      exportAsPDF();
    } catch (error) {
      console.error("Error updating remarks:", error);
      handleError(
        setSnackbarMessage,
        setSnackbarSeverity,
        setSnackbarOpen,
        error,
        t("actions.update_error")
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const exportAsPDF = async () => {
    const input = document.getElementById("salary-slip");

    const canvas = await html2canvas(input, { scale: 1.5, useCORS: true });
    let imgData = canvas.toDataURL("image/jpeg", 0.8);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    const fileName = `${salarySlip.slipName}_${salarySlip.employee.firstName}_${salarySlip.employee.lastName}.pdf`;
    pdf.save(fileName);
  };

  if (loading) {
    return (
        <Loading />
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
  if (!salarySlip) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        mt: 2,
      }}
    >
      <Paper
        id="salary-slip1"
        sx={{
          width: "100%",
          maxWidth: "100%",
          p: 2,
        }}
      >
        <Table sx={{ width: "450px", height: 50 }}>
          <TableBody>
            <TableRow>
              <CustomTableCell>
                <Typography variant="body2" align="center">
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
                  <SmallTypography variant="body2">
                    {salarySlip.slipName}
                  </SmallTypography>
                  <SmallTypography variant="body2">給料明細書</SmallTypography>
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
                  <SmallTypography variant="body1">{`${salarySlip.employee.lastName} ${salarySlip.employee.firstName}`}</SmallTypography>
                  <SmallTypography variant="body1">殿</SmallTypography>
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
                  <SmallTypography variant="body2" align="center">
                    部門名
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                <SmallTypography variant="body2" align="center">
                    {`${salarySlip.employee.department}`}
                  </SmallTypography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    役職名
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    社員NO
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.employeeId}`}
                  </SmallTypography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={5}>
            <SmallTypography variant="body2" align="left">
            {salarySlip.slipName}
            </SmallTypography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" align="left">
              給料明細書
            </Typography>
          </Grid>
        </Grid> */}

        {/* <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Table sx={{ width: 1000 }}>
            <TableBody>
              <TableRow>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    部門名
                  </SmallTypography>
                </ColoredTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.employee.department}`}
                  </SmallTypography>
                </CustomTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    社員NO
                  </SmallTypography>
                </ColoredTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  >{`${salarySlip.employeeId}`}</SmallTypography>
                </CustomTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    氏名
                  </SmallTypography>
                </ColoredTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  >{`${salarySlip.employee.firstName} ${salarySlip.employee.lastName}`}</SmallTypography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box> */}

        <Grid container columnSpacing={{ md: 30 }} sx={{ mt: 1, marginTop: '50px' }}>
          <Grid item xs={8}>
            <Table sx={{ height: 100, width: "100%" }}>
              <TableBody>
                <TableRow>
                  <VerticalTableCell rowSpan={4}>
                    <SmallTypography variant="body2" align="center">
                      勤怠
                    </SmallTypography>
                  </VerticalTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      所定労働日数/Scheduled working days
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      出勤日数
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      法定時間外/Overtime
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      遅刻時間
                    </SmallTypography>
                  </ColoredTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.scheduledWorkingDays}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.numberOfWorkingDays}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.overtime}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLate}`}
                    </SmallTypography>
                  </CustomTableCell>
                </TableRow>
                <TableRow>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      早退時間
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      控除時間/Deductions
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      有給休暇日数/Number of paid holidays
                    </SmallTypography>
                  </ColoredTableCell>
                  <ColoredTableCell>
                    <SmallTypography variant="body2" align="center">
                      残有給日数
                    </SmallTypography>
                  </ColoredTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLeavingEarly}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.timeLeavingEarly}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.workDetails.numberOfPaidHolidays}`}
                    </SmallTypography>
                  </CustomTableCell>
                  <CustomTableCell>
                    <SmallTypography variant="body2" align="center">
                      {`${salarySlip.employee.paidHolidays[0].remainingLeave}`}
                    </SmallTypography>
                  </CustomTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={4}>
            <Table sx={{ height: 100, width: "100%" }}>
              <TableBody>
                <TableRow>
                  <ColoredTableCell>
                    <Typography variant="h6" align="center">
                      差引支給額
                    </Typography>
                  </ColoredTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>
                    <Typography variant="h6" align="center">
                      {`${salarySlip.netSalary}`}
                    </Typography>
                  </CustomTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        <Grid sx={{ mt: 2 }}>
          <Table sx={{ height: 100 }}>
            <TableBody>
              {/* First Row */}
              <TableRow>
                <VerticalTableCell rowSpan={4}>
                  <SmallTypography variant="body2" align="center">
                    支給
                  </SmallTypography>
                </VerticalTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    役員報酬
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    残業手当/overtime pay
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    交通費/Transportation costs
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    家族手当/Family allowance
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    精勤手当
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    精勤手当
                  </SmallTypography>
                </ColoredTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
              </TableRow>

              {/* Second Row */}
              <TableRow>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.basicSalary}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.overtimePay}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.transportationCosts}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.familyAllowance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.attendanceAllowance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.holidayAllowance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
              </TableRow>

              {/* Third Row */}
              <TableRow>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    特別手当/Special allowance
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    不就労控除/Non-employment deduction
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    総支給額
                  </SmallTypography>
                </ColoredTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.earnings.specialAllowance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.nonEmploymentDeduction}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${
                      salarySlip.totalEarnings
                    }`}
                  </SmallTypography>
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
                <VerticalTableCell rowSpan={4}>
                  <SmallTypography variant="body2" align="center">
                    控除
                  </SmallTypography>
                </VerticalTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    介護保険
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    健康保険
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    厚生年金
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    雇用保険
                  </SmallTypography>
                </ColoredTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    社会保険料計
                  </SmallTypography>
                </ColoredTableCell>
              </TableRow>

              {/* Second Row */}
              <TableRow>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.longTermCareInsurance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.healthInsurance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.employeePensionInsurance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.employmentInsurance}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                  {`${salarySlip.deductions.socialInsurance}`}
                  </SmallTypography>
                </CustomTableCell>
              </TableRow>

              {/* Third Row */}
              <TableRow>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    年末調整
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    住民税
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    前払金
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    還付金等
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    所得税
                  </SmallTypography>
                </ColoredTableCell>
                <ColoredTableCell>
                  <SmallTypography variant="body2" align="center">
                    控除計
                  </SmallTypography>
                </ColoredTableCell>
              </TableRow>
              <TableRow>
                <CustomTableCell>
                  <SmallTypography
                    variant="body2"
                    align="center"
                  ></SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.yearEndAdjustment}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.residentTax}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.advancePayment}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.refundAmount}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {`${salarySlip.deductions.incomeTax}`}
                  </SmallTypography>
                </CustomTableCell>
                <CustomTableCell>
                  <SmallTypography variant="body2" align="center">
                    {salarySlip.totalDeductions}
                  </SmallTypography>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <TextField
          type="text"
          label={t("fields.remarks")}
          name="remarks"
          value={remarks === null ? "" : remarks}
          onChange={(e) => setRemarks(e.target.value)}
          fullWidth
          sx={{ mt: 4 }}
          multiline
          minRows={10}
          maxRows={10}
        />
      </Paper>

      <Box
        id="salary-slip"
        sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}
      >
        <SalarySlipPrint salarySlip={salarySlip} />
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t("button.exportAsPDF")}
        </Button>
        <Button
          onClick={() => navigate("/salary-details")}
          variant="outlined"
          color="primary"
        >
          {t("button.backToSalaryDetails")}
        </Button>
      </Stack>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SalarySlipDetails;
