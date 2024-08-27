import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const useEmployeeStore = create((set) => ({
  employees: [],
  employee: null,
  loading: false,
  error: null,
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
      throw error;
    }
  },
  saveData: async (data) => {
    try {
      const response = await api.post("/employees/save", data);
      return response.data;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  },
  updateData: async (data) => {
    try {
      const response = await api.put(`/employees/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
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
}));

export default useEmployeeStore;