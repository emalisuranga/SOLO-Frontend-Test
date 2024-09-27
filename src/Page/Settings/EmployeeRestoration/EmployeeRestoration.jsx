import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid } from "@mui/material";
import useEmployeeStore from "../../../store/employeeStore";
import Loading from "../../../component/Common/Loading";
import Error from "../../../component/Common/Error";
import EmployeeSearch from "../../../component/EmployeeSearch";
import ActionableTable from "../../../component/ActionableTable";
import { useTranslation } from "react-i18next";

const EmployeeRestoration = () => {
  const { t } = useTranslation();
  const { getAllDeletedEmployees, loading, error } = useEmployeeStore();

  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");

  const columns = [
    { headerName: "table.employeeId", field: "employeeNumber" },
    { headerName: "table.fullName", field: "fullName", render: (row) => `${row.firstName} ${row.lastName}` },
    { headerName: "table.phone", field: "phone" },
    { headerName: "table.joinDate", field: "joinDate", render: (row) => new Date(row.joinDate).toLocaleDateString() },
    { headerName: "table.department", field: "department" },
    { headerName: "table.basicSalary", field: "basicSalary", render: (row) => row.salaryDetails?.basicSalary || 0 }
  ];

  // Fetch deleted employees on component mount
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

  const handleNameChange = useCallback(
    (event) => {
      const selectedName = event.target.value;
      setSearchName(selectedName);
      const selectedEmployee = deletedEmployees.find(
        (item) => `${item.firstName} ${item.lastName}` === selectedName
      );
      setSearchId(selectedEmployee ? selectedEmployee.id : "");
    },
    [deletedEmployees]
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
    },
    [deletedEmployees]
  );

  const handleSearch = useCallback(() => {
    let idToSearch = searchId;
  
    // Find employee by name if no ID is provided
    if (!searchId && searchName) {
      const selectedEmployee = deletedEmployees.find(
        (item) => `${item.firstName} ${item.lastName}` === searchName
      );
      idToSearch = selectedEmployee ? selectedEmployee.id : '';
    }
  
    // Check if there is a valid ID to search for
    if (idToSearch) {
      // Find the employee in the current employeeList without making an API call
      const employee = deletedEmployees.find(item => item.id === parseInt(idToSearch, 10));
  
      if (employee) {
        setSelectedEmployee(employee);  // Pass the found employee to the onSearch handler
      } else {
        console.error('Employee not found.');
      }
    } else {
      console.error('Please select an employee name or ID.');
    }
  }, [searchId, searchName, deletedEmployees, setSelectedEmployee]);

  const handleRestore = async () => {
    // if (selectedEmployee.length > 0) {
    //   try {
    //     const response = await api.post('/employees/restore', { employeeIds: selectedEmployee.map(item => item.id) });
    //     if (response.status === 200) {
    //       setDeletedEmployees(deletedEmployees.filter((item) => !selectedEmployee.includes(item)));
    //       setSelectedEmployee([]);
    //     } else {
    //       console.error('Failed to restore employees:', response.data);
    //     } 
    //   } catch (err) {
    //     console.error('Failed to restore employees:', err);
    //   }
    // }
  };

  const actions = [
    {
      label: t("employeeRestoration.restore"),
      onClick: handleRestore()
    }
  ];

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return <Error message={error} />;
  }

  // Empty state handling
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
            {/* Add any additional controls like a button for going back */}
          </Box>
        </Grid>

        <Grid item xs={12}>
          {/* Replace with a table or list component displaying deleted employees */}
          <EmployeeSearch
            employeeList={deletedEmployees}
            searchName={searchName}
            searchId={searchId}
            handleNameChange={handleNameChange}
            handleIdChange={handleIdChange}
            handleSearch={handleSearch}
          />
          <ActionableTable data={selectedEmployee}  columns={columns} actions={actions}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeRestoration;
