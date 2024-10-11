import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid } from "@mui/material";
import useEmployeeStore from "../../../store/employeeStore";
import Loading from "../../../component/Common/Loading";
import EmployeeSearch from "../../../component/EmployeeSearch";
import ActionableTable from "../../../component/ActionableTable";
import ConfirmationDialog from "../../../component/ConfirmationDialog";
import { useTranslation } from "react-i18next";

const EmployeeRestoration = () => {
  const { t } = useTranslation();
  const { getAllDeletedEmployees, undoDeleteEmployee, loading } = useEmployeeStore();

  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const columns = [
    { headerName: "table.employeeId", field: "employeeNumber" },
    { headerName: "table.fullName", field: "fullName", render: (row) => `${row.firstName} ${row.lastName}` },
    { headerName: "table.phone", field: "phone" },
    { headerName: "table.joinDate", field: "joinDate", render: (row) => new Date(row.joinDate).toLocaleDateString() },
    { headerName: "table.department", field: "department" },
    { headerName: "table.basicSalary", field: "basicSalary", render: (row) => row.salaryDetails?.basicSalary || 0 }
  ];

  const employeeCategories = [
    { id: 'MONTHLY_BASIC', value: t('MONTHLY_BASIC') },
    { id: 'DAILY_BASIC', value: t('DAILY_BASIC') },
    { id: 'HOURLY_BASIC', value: t('HOURLY_BASIC') },
  ];

  const monthlyEmployeeCategories = {
    NON_EXECUTIVE: 'NON_EXECUTIVE',
    EXECUTIVE: 'EXECUTIVE'
  };

  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      try {
        const employees = await getAllDeletedEmployees();
        setDeletedEmployees(employees);
        setSelectedEmployee(employees);
      } catch (err) {
        console.error("Error fetching deleted employees:", err);
      }
    };

    fetchDeletedEmployees();
  }, [getAllDeletedEmployees]);

  const determineSearchCategory = useCallback((selectedEmployee) => {
    const category = selectedEmployee?.category;
  
    if (category === monthlyEmployeeCategories.EXECUTIVE || category === monthlyEmployeeCategories.NON_EXECUTIVE) {
      return "MONTHLY_BASIC";
    }
    
    return category || "";
  }, [monthlyEmployeeCategories.EXECUTIVE, monthlyEmployeeCategories.NON_EXECUTIVE]);

  const handleNameChange = useCallback(
    (event) => {
      const selectedName = event.target.value;
      setSearchName(selectedName);
      const selectedEmployee = deletedEmployees.find(
        (item) => `${item.lastName} ${item.firstName}` === selectedName
      );
      setSearchId(selectedEmployee ? selectedEmployee.id : "");
      setSearchCategory(determineSearchCategory(selectedEmployee))
    },
    [deletedEmployees, determineSearchCategory]
  );

  const handleIdChange = useCallback(
    (event) => {
      const selectedId = event.target.value;
      setSearchId(selectedId);
      const selectedEmployee = deletedEmployees.find(
        (item) => item.id === parseInt(selectedId, 10)
      );
      setSearchName(
        selectedEmployee
          ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}`
          : ""
      );
      setSearchCategory(determineSearchCategory(selectedEmployee))
    },
    [deletedEmployees, determineSearchCategory]
  );

  const handleEmployeeCategoriesChange = useCallback(
    (event) => {
      const selectedCategory = event.target.value;
      setSearchCategory(selectedCategory);
  
      let filteredEmployees;
  
      if (selectedCategory === 'MONTHLY_BASIC') {
        filteredEmployees = deletedEmployees.filter(
          (employee) =>
            employee.category === monthlyEmployeeCategories.EXECUTIVE || employee.category === monthlyEmployeeCategories.NON_EXECUTIVE
        );
      } else {
        filteredEmployees = deletedEmployees.filter(
          (employee) => employee.category === selectedCategory
        );
      }
      setSelectedEmployee(filteredEmployees);
    },
    [deletedEmployees, setSearchCategory, setSelectedEmployee, monthlyEmployeeCategories.EXECUTIVE, monthlyEmployeeCategories.NON_EXECUTIVE]
  );

  const handleSearch = useCallback(() => {
    let idToSearch = searchId;
  
    if (!searchId && searchName) {
      const selectedEmployee = deletedEmployees.find(
        (item) => `${item.lastName} ${item.firstName}` === searchName
      );
      idToSearch = selectedEmployee ? selectedEmployee.id : '';
    }
  
    if (idToSearch) {
      const employee = deletedEmployees.find(item => item.id === parseInt(idToSearch, 10));
  
      if (employee) {
        setSelectedEmployee([employee]);
      } else {
        console.error('Employee not found.');
      }
    } else {
      console.error('Please select an employee name or ID.');
    }
  }, [searchId, searchName, deletedEmployees, setSelectedEmployee]);

  const handleRestore = (currentRow) => {
    setCurrentEmployee(currentRow);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentEmployee(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(currentEmployee.id);
    handleDialogClose();
  };

  const onDelete = async (employeeId) => {
    try {
      await undoDeleteEmployee( employeeId, t );
      
      const updatedDeletedEmployees = await getAllDeletedEmployees();
      setDeletedEmployees(updatedDeletedEmployees);
    } catch (error) {
      console.error("Error restoring the employee:", error);
    }
  };

  const actions = [
    {
      label: t("employeeRestoration.restore"),
      onClick: (row) => handleRestore(row),
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (deletedEmployees.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" align="center">
          {t("employeeRestoration.noDeletedEmployees")}
        </Typography>
      </Box>
    );
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
            <Typography variant="h5">
              {t("employeeRestoration.title")}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <EmployeeSearch
            employeeList={selectedEmployee}
            searchName={searchName}
            searchId={searchId}
            searchCategory={searchCategory}
            employeeCategories={employeeCategories}
            handleNameChange={handleNameChange}
            handleIdChange={handleIdChange}
            handleSearch={handleSearch}
            handleEmployeeCategoriesChange={handleEmployeeCategoriesChange}
          />
          {/* <ActionableTable data={deletedEmployees}  columns={columns} actions={actions}/> */}
          {selectedEmployee ? (
          <Grid item xs={12}>
            <ActionableTable data={selectedEmployee} columns={columns} actions={actions}/>
          </Grid>
        ) : (
          <Grid item xs={12}>
             <ActionableTable data={deletedEmployees}  columns={columns} actions={actions}/>
          </Grid>
        )}
        </Grid>

        <ConfirmationDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        titleKey="employeeRestoration.confirmRestore.title"                  
        descriptionKey="employeeRestoration.confirmRestore.description"      
        confirmTextKey="actions.delete"                 
        cancelTextKey="actions.cancel"                 
      />

      </Grid>
    </Box>
  );
};

export default EmployeeRestoration;
