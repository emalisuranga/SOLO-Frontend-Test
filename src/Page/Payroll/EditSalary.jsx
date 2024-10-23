import React, { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
// import CustomTabsForSalary from "./CustomTabsForSalary";
import { useParams, useNavigate } from 'react-router-dom';
import useSalaryStore from '../../store/salaryStore';
import getSalarySections from '../../utils/salarySections';
import EmployeeHeader from '../../Page/Employee/EmployeeHeader';
import AddSalaryDetailsSteps from "./AddSalaryDetailsSteps";

const EditSalary = () => {
  const { paymentId } = useParams();
  const { fetchSalaryDetailsById, salary } = useSalaryStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (paymentId) {
          await fetchSalaryDetailsById(paymentId);
        }
      } catch (error) {
        console.error('Failed to fetch salary details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paymentId, fetchSalaryDetailsById]);

  useEffect(() => {
    if (salary) {
      const sectionsData = getSalarySections(salary);
      setSections(sectionsData);
    }
  }, [salary]);

  const handleSubmit = (formData) => {
    navigate('/salary-details');
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
      <EmployeeHeader titleKey="updateSalaryForm" />
      {/* <CustomTabsForSalary sections={sections} initialData={salary} onSubmit={handleSubmit} /> */}
      <AddSalaryDetailsSteps
            sections={sections}
            onSubmit={handleSubmit}
            initialData={salary}
            mode="EDIT"
          />
    </React.Fragment>
  );
};

export default EditSalary;