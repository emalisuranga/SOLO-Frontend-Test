import React from "react";
import PropTypes from "prop-types";
import { TextField, Grid, MenuItem } from "@mui/material";

const RegisterForm = ({ fields, formData, onChange, errors }) => {
  return (
    <Grid container spacing={2}>
      {fields.map((field) => {
        const fieldData = formData[field.name] || {};
        const isSelectField = field.type === "select";

        return (
          <Grid item xs={12} sm={6} key={field.name}>
            <TextField
              select={isSelectField} 
              type={fieldData.type || field.type}
              label={fieldData.label || field.label}
              name={fieldData.name || field.name}
              value={
                fieldData.value !== undefined && fieldData.value !== null
                  ? fieldData.value
                  : ""
              }
              onChange={onChange}
              error={!!errors[fieldData.name]}
              helperText={errors[fieldData.name]}
              fullWidth
              required={fieldData.required || field.required}
              margin="normal"
              variant="outlined"
              InputLabelProps={
                fieldData.type === "date" ? { shrink: true } : {}
              }
              InputProps={fieldData.readOnly ? { readOnly: true } : {}}
              disabled={fieldData.disabled || field.disabled}
            >
              {isSelectField && field.options
                ? field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                : null}
            </TextField>
          </Grid>
        );
      })}
    </Grid>
  );
};

RegisterForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      required: PropTypes.bool,
      options: PropTypes.arrayOf( 
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default RegisterForm;