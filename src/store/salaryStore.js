import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const handleError = (set, error, message) => {
  console.error(message, error);
  const errorMessage = error.response?.data?.message || error.message || message;
  set({ error: errorMessage, loading: false });
  return { error: errorMessage };
};

const useSalaryStore = create((set) => ({
  salaries: [],
  salary: null,
  loading: false,
  error: null,

  fetchSalaries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/salary-details");
      set({ salaries: response.data.data || [], loading: false });
    } catch (error) {
      handleError(set, error, "Error fetching salaries");
    }
  },

  fetchSalaryDetailsById: async (paymentId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/salary-details/payment/${paymentId}`);
      set({ salary: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      handleError(set, error, "Error fetching salary details by ID");
    }
  },

  calculateSalaryDetails: async (salaryData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/salary-details/calculate-salary', salaryData);
      set({ salary: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      handleError(set, error, "Error calculating salary details");
    }
  },

  fetchSalaryDetailsByMonth: async (month, year) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/salary-details/${month}/${year}`);
      set({ salaries: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      handleError(set, error, "Error fetching salary details by month");
    }
  },

  saveSalary: async (data) => {
    set({ error: null }); // Reset error state before making the request
    try {
      const response = await api.post("/salary-details/save", data);
      return response.data;
    } catch (error) {
      return handleError(set, error, "Error saving salary data");
    }
  },

  updateSalary: async (id, data) => {
    set({ error: null }); // Reset error state before making the request
    try {
      const response = await api.put(`/salary-details/payment/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(set, error, "Error updating salary data");
     // Return null to indicate an error occurred
    }
  },

  deleteSalary: async (id) => {
    set({ error: null }); // Reset error state before making the request
    try {
      const response = await api.delete(`/salary-details/${id}`);
      return response.data;
    } catch (error) {
      handleError(set, error, "Error deleting salary data");
      return null; // Return null to indicate an error occurred
    }
  },

  generateIncomeTax: async(insuranceData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/salary-details/income-tax', insuranceData);
      return response.data;
    } catch (error) {
      return handleError(set, error, "Error generating income tax");
    }
  },
}));

export default useSalaryStore;