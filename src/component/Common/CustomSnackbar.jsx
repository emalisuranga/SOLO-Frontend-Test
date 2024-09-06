import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbarStore } from "../../store/snackbarStore"; 

const CustomSnackbar = () => {
  const { snackbarOpen, snackbarMessage, snackbarSeverity, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;