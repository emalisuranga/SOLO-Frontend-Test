import React, { useEffect, useState } from "react";
import {  CircularProgress, Box } from "@mui/material";
import { useParams } from 'react-router-dom';
import useEmployeeStore from '../../store/employeeStore';
import getSections from '../../utils/employeeSections';
import EmployeeHeader from '../../Page/Employee/EmployeeHeader';
import CustomStepperForEmployee from "./CustomStepperForEmployee";

const EditEmployee = () => {
  const { id } = useParams();
  const { employee, fetchEmployeeDetails, employeeCategory } = useEmployeeStore();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEmployeeDetails(id);
      } catch (error) {
        console.error('Failed to fetch employee details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, fetchEmployeeDetails]);

  useEffect(() => {
    if (employee) {
      const sectionsData = getSections(employee, employeeCategory);
      setSections(sectionsData);
    }
  }, [employee, employeeCategory]);
  


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="updateForm" />
      {/* <CustomTabs sections={sections} mode="edit" initialData={employee} onSubmit={handleSubmit} /> */}
      <CustomStepperForEmployee sections={sections} mode="edit" initialData={employee}/>
    </React.Fragment>
  );
};

export default EditEmployee;