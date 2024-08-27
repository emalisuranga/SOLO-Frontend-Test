import React from "react";
import EmployeeHeader from '../../Page/Employee/EmployeeHeader';
import CustomTabs from "../../component/CustomTabs";
import getSections from '../../utils/employeeSections';

const AddEmployee = () => {
  const handleSubmit = (formData) => {
  };
  const sections = getSections();

  return (
    <React.Fragment>
      <EmployeeHeader titleKey="registrationForm" />
      <CustomTabs sections={sections} onSubmit={handleSubmit} />
    </React.Fragment>
  );
};

export default AddEmployee;
