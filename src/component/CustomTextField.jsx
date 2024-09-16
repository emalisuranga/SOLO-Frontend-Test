import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid } from '@mui/material';

const RegisterForm = ({ fields, formData, onChange, errors }) => {
  return (
    <Grid container spacing={2}>
      {fields.map((field) => {
        const fieldData = formData[field.name] || {};
        return (
          <Grid item xs={12} sm={6} key={field.name}>
            <TextField
              type={fieldData.type || field.type}
              label={fieldData.label || field.label}
              name={fieldData.name || field.name}
              value={fieldData.value || ''}
              onChange={onChange}
              error={!!errors[fieldData.name]}
              helperText={errors[fieldData.name]}
              fullWidth
              required={fieldData.required || field.required}
              margin="normal"
              variant="outlined"
              InputLabelProps={fieldData.type === 'date' ? { shrink: true } : {}}
              InputProps={fieldData.name === 'remainingPaidVacationDays' || fieldData.name === 'employeeNumber' ? { readOnly: true } : {}}
              disabled={fieldData.disabled || field.disabled}
            />
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
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default RegisterForm;