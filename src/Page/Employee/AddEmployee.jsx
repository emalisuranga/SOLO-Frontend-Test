import React, { useEffect } from "react";
import EmployeeHeader from "../../Page/Employee/EmployeeHeader";
import getSections from "../../utils/employeeSections";
import useEmployeeStore from "../../store/employeeStore";
import CustomStepperForEmployee from "./CustomStepperForEmployee";

const AddEmployee = () => {
  const { fetchNextEmployeeNumber } = useEmployeeStore();

  useEffect(() => {
    const fetchAndSetNextEmployeeNumber = async () => {
      try {
        await fetchNextEmployeeNumber();
      } catch (error) {
      }
    };

    fetchAndSetNextEmployeeNumber();
  }, [ fetchNextEmployeeNumber]);

  const sections = getSections();

  // const handleSubmit = (formData) => {};

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="registrationForm" />
      <CustomStepperForEmployee sections={sections} mode="add" />
    </React.Fragment>
  );
};

export default AddEmployee;
