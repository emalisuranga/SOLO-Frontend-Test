import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmployeeTable from "./EmployeeTable";
import useEmployeeStore from "../../store/employeeStore";
import EmployeeSearch from "../../component/EmployeeSearch";
import MultiOptionDialog from "../../component/MultiOptionDialog";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const employeeCategories = [
    { id: "MONTHLY_BASIC", value: t("MONTHLY_BASIC") },
    { id: "DAILY_BASIC", value: t("DAILY_BASIC") },
    { id: "HOURLY_BASIC", value: t("HOURLY_BASIC") },
  ];

  const monthlyEmployeeCategories = {
    NON_EXECUTIVE: "NON_EXECUTIVE",
    EXECUTIVE: "EXECUTIVE",
  };

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

  const { employees, loading, fetchEmployees, setEmployeeCategory } = useEmployeeStore((state) => ({
      employees: state.employees,
      loading: state.loading,
      fetchEmployees: state.fetchEmployees,
      setEmployeeCategory: state.setEmployeeCategory,
    }));

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const determineSearchCategory = useCallback(
    (selectedEmployee) => {
      const category = selectedEmployee?.category;

      if (
        category === monthlyEmployeeCategories.EXECUTIVE ||
        category === monthlyEmployeeCategories.NON_EXECUTIVE
      ) {
        return "MONTHLY_BASIC";
      }

      return category || "";
    },
    [
      monthlyEmployeeCategories.EXECUTIVE,
      monthlyEmployeeCategories.NON_EXECUTIVE,
    ]
  );

  const handleNameChange = useCallback(
    (event) => {
      const selectedName = event.target.value;
      setSearchName(selectedName);
      const selectedEmployee = employees.find(
        (item) => `${item.lastName} ${item.firstName}` === selectedName
      );
      setSearchId(selectedEmployee ? selectedEmployee.id : "");
      setSearchCategory(determineSearchCategory(selectedEmployee));
    },
    [employees, determineSearchCategory]
  );

  const handleIdChange = useCallback(
    (event) => {
      const selectedId = event.target.value;
      setSearchId(selectedId);
      const selectedEmployee = employees.find(
        (item) => item.id === parseInt(selectedId, 10)
      );
      setSearchName(
        selectedEmployee
          ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}`
          : ""
      );
      setSearchCategory(determineSearchCategory(selectedEmployee));
    },
    [employees, determineSearchCategory]
  );

  const handleEmployeeCategoriesChange = useCallback(
    (event) => {
      const selectedCategory = event.target.value;
      setSearchCategory(selectedCategory);

      let filteredEmployees;

      if (selectedCategory === "MONTHLY_BASIC") {
        filteredEmployees = employees.filter(
          (employee) =>
            employee.category === monthlyEmployeeCategories.EXECUTIVE ||
            employee.category === monthlyEmployeeCategories.NON_EXECUTIVE
        );
      } else {
        filteredEmployees = employees.filter(
          (employee) => employee.category === selectedCategory
        );
      }
      console.dir(filteredEmployees);
      setSelectedEmployee(filteredEmployees);
    },
    [
      employees,
      setSearchCategory,
      setSelectedEmployee,
      monthlyEmployeeCategories.EXECUTIVE,
      monthlyEmployeeCategories.NON_EXECUTIVE,
    ]
  );

  const handleSearch = useCallback(() => {
    let idToSearch = searchId;

    if (!searchId && searchName) {
      const selectedEmployee = employees.find(
        (item) => `${item.lastName} ${item.firstName}` === searchName
      );
      idToSearch = selectedEmployee ? selectedEmployee.id : "";
    }

    if (idToSearch) {
      const employee = employees.find(
        (item) => item.id === parseInt(idToSearch, 10)
      );

      if (employee) {
        setSelectedEmployee([employee]);
      } else {
        console.error("Employee not found.");
      }
    } else {
      console.error("Please select an employee name or ID.");
    }
  }, [searchId, searchName, employees, setSelectedEmployee]);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOptionSelect = (selectedOption) => {
    setEmployeeCategory(selectedOption);
    navigate("/add-employee");
  };

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
            <Typography variant="h5">{t("Employee Details")}</Typography>
            {/* <Button variant="contained" onClick={() => navigate("/add-employee")}>{t('addEmployee')}</Button> */}
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              {t("addEmployee")}
            </Button>
          </Box>
        </Grid>
        {/* <EmployeeSearch onSearch={handleSearch} /> */}
        <EmployeeSearch
          employeeList={selectedEmployee ? selectedEmployee : employees}
          searchName={searchName}
          searchId={searchId}
          searchCategory={searchCategory}
          employeeCategories={employeeCategories}
          handleNameChange={handleNameChange}
          handleIdChange={handleIdChange}
          handleSearch={handleSearch}
          handleEmployeeCategoriesChange={handleEmployeeCategoriesChange}
        />
        {selectedEmployee ? (
          <Grid item xs={12}>
          <EmployeeTable data={selectedEmployee} />
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
