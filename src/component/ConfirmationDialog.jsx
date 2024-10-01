import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  titleKey,              
  descriptionKey,       
  confirmTextKey = "confirm",  
  cancelTextKey = "cancel",    
  confirmButtonColor = "secondary", 
  cancelButtonColor = "primary",    
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t(titleKey)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(descriptionKey)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={cancelButtonColor}>
          {t(cancelTextKey)}
        </Button>
        <Button onClick={onConfirm} color={confirmButtonColor} autoFocus>
          {t(confirmTextKey)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;