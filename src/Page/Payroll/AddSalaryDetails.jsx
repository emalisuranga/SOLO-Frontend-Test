import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeHeader from "../../Page/Employee/EmployeeHeader";
import EmployeeSearch from "../Employee/EmployeeSearch";
import getSalarySections from "../../utils/salarySections";
import LoadingAnimation from "../../component/LoadingAnimation";
import styled from "styled-components";

import AddSalaryDetailsSteps from "./AddSalaryDetailsSteps";

const EmployeeInfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const EmployeeInfo = styled(Typography)`
  font-size: 1.2em;
  font-weight: bold;
`;

const AddSalary = () => {
  const handleSubmit = (formData) => {};

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSearch = (employee) => {
    setSelectedEmployee(employee);
  };
  const sections = getSalarySections(selectedEmployee);

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="addSalaryForm" />
      <EmployeeSearch onSearch={handleSearch} />
      
      {selectedEmployee ? (
        <Box sx={{ p: 3 }}>
          <EmployeeInfoContainer>
            <EmployeeInfo variant="h3" gutterBottom>
              {`${selectedEmployee.lastName} ${selectedEmployee.firstName}`}
            </EmployeeInfo>
            <EmployeeInfo variant="h4" gutterBottom>
              {selectedEmployee.id}
            </EmployeeInfo>
          </EmployeeInfoContainer>
          <AddSalaryDetailsSteps
            sections={sections}
            onSubmit={handleSubmit}
            initialData={selectedEmployee}
          />
        </Box>
      ) : (
        <LoadingAnimation />
      )}
    </React.Fragment>
  );
};

export default AddSalary;
