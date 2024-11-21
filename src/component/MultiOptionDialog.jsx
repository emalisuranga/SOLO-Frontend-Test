import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const MultiOptionDialog = React.memo(
  ({
    open,
    onClose,
    onSelect,
    titleKey,
    descriptionKey,
    optionKeys,
    optionButtonColors,
  }) => {
    const { t } = useTranslation();

    const buttonStyles = { minWidth: "120px" };

    const handleSelect = (option) => {
      onSelect(option);
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle align="center">{t(titleKey)}</DialogTitle>
        <DialogContent>
          <DialogContentText align="center">
            {t(descriptionKey)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} justifyContent="center">
            {optionKeys.map((key, index) => (
              <Grid item key={key}>
                <Button
                  onClick={() => handleSelect(key)}
                  variant="contained"
                  color={optionButtonColors[index] || "primary"}
                  style={buttonStyles} 
                >
                  {t(key)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogActions>

        <Box mt={2} mb={2} display="flex" justifyContent="center">
          <Button onClick={onClose} variant="outlined" style={buttonStyles}>
            {t("cancel")}
          </Button>
        </Box>
      </Dialog>
    );
  }
);

export default MultiOptionDialog;