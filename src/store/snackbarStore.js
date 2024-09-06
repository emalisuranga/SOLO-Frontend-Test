import create from "zustand";

export const useSnackbarStore = create((set) => ({
  snackbarOpen: false,
  snackbarMessage: "",
  snackbarSeverity: "success",
  setSnackbar: (message, severity = "success") => {
    set({ snackbarMessage: message, snackbarSeverity: severity, snackbarOpen: true });
  },
  closeSnackbar: () => set({ snackbarOpen: false }),
}));