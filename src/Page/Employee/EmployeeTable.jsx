import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";
import useEmployeeStore from "../../store/employeeStore";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../component/Common/CustomSnackbar";
import { handleSuccess, handleError } from "../../utils/responseHandlers";

const EmployeeTable = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { softDeleteEmployee, fetchEmployees } = useEmployeeStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (currentRow) {
    }
  }, [currentRow]);

  const handleEdit = (row) => {
    navigate(`/employee/edit/${row.id}`);
    handleActionClose();
  };

  const handleView = (row) => {
    navigate(`/employee/${row.id}`);
  };

  const handleActionClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentRow(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (currentRow) {
      try {
        await softDeleteEmployee(currentRow.id);
        handleSuccess(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, t("actions.delete_success"));
        setTimeout(() => fetchEmployees(), 2000);
      } catch (error) {
        handleError(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, error, t("actions.delete_error"));
        console.error("Failed to save data", error);
      }
      handleDialogClose();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("table.employeeId")}</TableCell>
            <TableCell>{t("table.fullName")}</TableCell>
            <TableCell>{t("table.phone")}</TableCell>
            <TableCell>{t("table.joinDate")}</TableCell>
            <TableCell>{t("table.department")}</TableCell>
            {/* <TableCell>{t("table.bankAccountNumber")}</TableCell>
            <TableCell>{t("table.bankName")}</TableCell> */}
            <TableCell>{t("table.basicSalary")}</TableCell>
            <TableCell>{t("table.totalAllowance")}</TableCell>
            <TableCell>{t("table.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell>{row.employeeNumber}</TableCell>
              <TableCell>{`${row.lastName} ${row.firstName}`}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>
                {new Date(row.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{row.department}</TableCell>
              {/* <TableCell>{row.bankDetails?.bankAccountNumber}</TableCell>
              <TableCell>{row.bankDetails?.bankName}</TableCell> */}
              <TableCell>{row.salaryDetails?.basicSalary}</TableCell>
              <TableCell>
                {[
                  row.salaryDetails?.transportationCosts,
                  row.salaryDetails?.familyAllowance,
                  row.salaryDetails?.attendanceAllowance,
                  row.salaryDetails?.leaveAllowance,
                  row.salaryDetails?.specialAllowance,
                ].reduce((acc, allowance) => acc + (allowance || 0), 0)}
              </TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleActionClick(e, row)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleActionClose}
                >
                  <MenuItem onClick={() => handleView(currentRow)}>
                    {t("View")}
                  </MenuItem>
                  <MenuItem onClick={() => handleEdit(currentRow)}>
                    {t("Edit")}
                  </MenuItem>
                  <MenuItem onClick={() => setOpenDialog(true)}>
                    {t("Delete")}
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("table.rowsPerPage")}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("Confirm Delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("actions.deleteConfirmationMessageEmployee")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("Cancel")}
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </TableContainer>
  );
};

export default EmployeeTable;
