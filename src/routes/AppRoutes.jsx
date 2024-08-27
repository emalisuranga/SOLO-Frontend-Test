import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Page/Dashboard';
import Settings from '../Page/Settings';
import ErrorBoundary from '../component/ErrorBoundary';

const Employee = lazy(() => import('../Page/Employee/Employee'));
const AddEmployee = lazy(() => import('../Page/Employee/AddEmployee'));
const AddSalaryDetails = lazy(() => import('../Page/Payroll/AddSalaryDetails'));
const SalaryDetails = lazy(() => import('../Page/Payroll/SalaryDetails'));
const ViewEmployeeDetails = lazy(() => import('../Page/Employee/ViewEmployeeDetails'));
const EditEmployee = lazy(() => import('../Page/Employee/EditEmployee'));
const ViewSalaryDetails = lazy(() => import('../Page/Payroll/ViewSalaryDetails'));
const EditSalary = lazy(() => import('../Page/Payroll/EditSalary'));
const SalarySlipDetails = lazy(() => import('../Page/Reports/SalarySlipDetails/SalarySlipDetails'));
const SalarySlipPrint = lazy(() => import('../Page/Reports/SalarySlipPrint'));

const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/add-salary-details" element={<AddSalaryDetails />} />
        <Route path="/employee/:id" element={<ViewEmployeeDetails />} />
        <Route path="/employee/edit/:id" element={<EditEmployee />} />
        <Route path="/salary-details/view/:paymentId" element={<ViewSalaryDetails />} />
        <Route path="/salary-details" element={<SalaryDetails />} />
        <Route path="/salary-details/edit/:paymentId" element={<EditSalary />} />
        <Route path="/salary-slip/:employeeId/:paymentDetailsId" element={<SalarySlipDetails />} />
        <Route path="/salary-slip-print/:employeeId/:paymentDetailsId" element={<SalarySlipPrint />} />
      </Routes>
    </Suspense>
   </ErrorBoundary>
);

export default AppRoutes;