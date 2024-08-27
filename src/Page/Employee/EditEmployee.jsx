import React, { useEffect, useState } from "react";
import {  CircularProgress, Box } from "@mui/material";
import CustomTabs from "../../component/CustomTabs";
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../store/employeeStore';
import getSections from '../../utils/employeeSections';
import EmployeeHeader from '../../Page/Employee/EmployeeHeader';

const EditEmployee = () => {
  const { id } = useParams();
  const { employee, fetchEmployeeDetails } = useEmployeeStore();
  const navigate = useNavigate();
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
      const sectionsData = getSections(employee);
      setSections(sectionsData);
    }
  }, [employee]);

  const handleSubmit = (formData) => {
    navigate('/employee');
  };

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
      <CustomTabs sections={sections} mode="edit" initialData={employee} onSubmit={handleSubmit} />
    </React.Fragment>
  );
};

export default EditEmployee;