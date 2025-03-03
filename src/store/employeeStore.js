import { create } from "zustand";
import axios from "axios";
import { useSnackbarStore } from "./snackbarStore";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api",
});

const useEmployeeStore = create((set, get) => ({
  employees: [],
  employee: null,
  loading: false,
  error: null,
  nextEmployeeNumber: "",
  employeeCategory: "",

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
      set({ employee: response.data.data, loading: false, employeeCategory: response.data.data.category });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      set({ error: "Error fetching employee details", loading: false });
    }
  },
  fetchEmployeeNamesAndIds: async () => {
    try {
      const employeeCategory = get().employeeCategory;
      const response = await api.get(`/employees/employee-names-ids/${employeeCategory}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employee names and IDs:", error);
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
    const employeeCategory = get().employeeCategory;
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/employees/next-employee-number/${employeeCategory}`);
      set({
        nextEmployeeNumber: response.data.data.nextEmployeeNumber,
        loading: false,
      });
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
      const response = await api.get("/employees/deleted-employees");
      set({ loading: false });
      return response.data.data;;
    } catch (error) {
      console.error("Error fetching deleted employees:", error);
      set({ error: "Error fetching next employee number", loading: false });
      throw error;
    }
  },
  undoDeleteEmployee: async (id, t) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/employees/undo-delete/${id}`);
      set({ loading: false });
      const { setSnackbar } = useSnackbarStore.getState();
      setSnackbar(t("employeeRestoration.restorationSuccess"), "success");
      return response.data.data;
    } catch (error) {
      console.error("Error restoring employee:", error);
      set({ error: t("employeeRestoration.restorationError"), loading: false });
      const { setSnackbar } = useSnackbarStore.getState();
      setSnackbar(t("employeeRestoration.restorationError"), "error"); 
      throw error;
    }
  },
  setEmployeeCategory: (category) => set({ employeeCategory: category }),
}));

export default useEmployeeStore;
export const employeeStore = useEmployeeStore.getState;
