import React, { useState } from "react";
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
  TablePagination, // Import TablePagination
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomSnackbar from "../../component/Common/CustomSnackbar";
import useSalaryStore from "../../store/salaryStore";
import { handleSuccess, handleError } from "../../utils/responseHandlers";

const SalaryTable = ({ salaries, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { deleteSalary, fetchSalaryDetailsByMonth } = useSalaryStore();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleActionClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleView = (row) => {
    navigate(`/salary-details/view/${row.id}`);
    handleActionClose();
  };

  const handleEdit = (row) => {
    navigate(`/salary-details/edit/${row.id}`);
    handleActionClose();
  };

  const handlePrintPDF = (row) => {
    navigate(`/salary-slip/${row.employeeId}/${row.id}`);
    handleActionClose();
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
        await deleteSalary(currentRow.id);
        handleSuccess(setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, t("actions.delete_success"));
        setTimeout(() => fetchSalaryDetailsByMonth(currentRow.month, currentRow.year), 2000);
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

  const paginatedSalaries = Array.isArray(salaries) ? salaries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) : [];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("table.employeeId")}</TableCell>
              <TableCell>{t("table.fullName")}</TableCell>
              <TableCell>{t("table.totalEarnings")}</TableCell>
              <TableCell>{t("table.totalDeductions")}</TableCell>
              <TableCell>{t("table.netSalary")}</TableCell>
              <TableCell>{t("table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSalaries.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell>{salary.employee.employeeNumber}</TableCell>
                <TableCell>{`${salary.employee.lastName} ${salary.employee.firstName}`}</TableCell>
                <TableCell>{salary.totalEarnings}</TableCell>
                <TableCell>{salary.totalDeductions}</TableCell>
                <TableCell>{salary.netSalary}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleActionClick(e, salary)}>
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
                    <MenuItem onClick={() => handlePrintPDF(currentRow)}>
                      {t("printPDF")}
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
          count={salaries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("table.rowsPerPage")}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("Confirm Delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("actions.deleteConfirmationMessageSalary")}
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
    </>
  );
};

SalaryTable.propTypes = {
  salaries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      employee: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      totalEarnings: PropTypes.number.isRequired,
      totalDeductions: PropTypes.number.isRequired,
      netSalary: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalaryTable;