import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
});

const useEmployeeStore = create((set) => ({
  employees: [],
  employee: null,
  loading: false,
  error: null,
  nextEmployeeNumber: "",
  
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/employees");
      set({ employees: response.data.data || [], loading: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      set({ error: "Error fetching data", loading: false });
    }
  },
  fetchEmployeeDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/employees/${id}`);
      set({ employee: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      set({ error: "Error fetching employee details", loading: false });
    }
  },
  fetchEmployeeNamesAndIds: async () => {
    try {
      const response = await api.get('/employees/employee-names-ids');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching employee names and IDs:', error);
      set({ error: error.message || "An error occurred", loading: false });
      throw error;
    }
  },
  saveData: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/employees/save", data);
      set({ employee: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("Error saving data:", error);
      set({ error: error.message || "An error occurred", loading: false });
      throw error;
    }
  },
  updateData: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/employees/${data.id}`, data);
      set({ employee: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      set({ error: "Error fetching Update Employee details", loading: false });
      throw error;
    }
  },
  softDeleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/soft-delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
  fetchNextEmployeeNumber: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/employees/next-employee-number');
      set({ nextEmployeeNumber: response.data.data.nextEmployeeNumber, loading: false });
      return response.data.data.nextEmployeeNumber;
    } catch (error) {
      console.error("Error fetching next employee number:", error);
      set({ error: "Error fetching next employee number", loading: false });
      throw error;
    }
  },
  getAllDeletedEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/employees/deleted-employees');
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching deleted employees:", error);
      set({ error: "Error fetching next employee number", loading: false });
      throw error;
    }
  },
}));



export default useEmployeeStore;
export const employeeStore = useEmployeeStore.getState;