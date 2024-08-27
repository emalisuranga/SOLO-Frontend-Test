import { create } from 'zustand';
import { getInitialFormData } from '../utils/formUtils';

const useFormStore = create((set) => ({
  formData: {},
  errors: {},
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  clearFormData: () => set({ formData: getInitialFormData() }),
  setErrors: (errors) => set({ errors }),
}));

export default useFormStore;