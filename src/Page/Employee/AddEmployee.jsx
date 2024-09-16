import React, { useEffect } from "react";
import EmployeeHeader from "../../Page/Employee/EmployeeHeader";
import CustomTabs from "../../component/CustomTabs";
import getSections from "../../utils/employeeSections";
import useEmployeeStore from "../../store/employeeStore";

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

  const handleSubmit = (formData) => {};

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="registrationForm" />
      <CustomTabs sections={sections} onSubmit={handleSubmit} />
    </React.Fragment>
  );
};

export default AddEmployee;
