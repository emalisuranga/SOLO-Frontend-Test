import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
});

const useSocialInsuranceCalculationStore = create((set) => ({
  socialInsuranceCalculation: null,
  loading: false,
  error: null,
  
  fetchSocialInsuranceCalculationDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/social-insurance-calculation`);
      set({ socialInsuranceCalculation: response.data.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch social insurance calculation details',
        loading: false,
      });
      return null;
    }
  },

  updateSocialInsuranceCalculation: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/social-insurance-calculation/${id}`, data);
      set({ socialInsuranceCalculation: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update social insurance calculation',
        loading: false,
      });
    }
  },

  setSocialInsuranceCalculation: (socialInsuranceCalculation) => set({ socialInsuranceCalculation }),
}));

export default useSocialInsuranceCalculationStore;