export const handleSuccess = (setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, message) => {
    setSnackbarMessage(message || "Operation successful.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };
  
  export const handleError = (setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, error, defaultMessage) => {
    console.error("Error:", error);
    setSnackbarMessage(defaultMessage || "Operation failed.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };