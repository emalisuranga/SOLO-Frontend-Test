import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid } from '@mui/material';

const RegisterForm = ({ fields, formData, onChange, errors }) => {
  return (
    <Grid container spacing={2}>
      {fields.map(({ name, type, label, required, defaultValue, disabled }) => {
        const value = formData[name] ?? defaultValue ?? '';
        const isReadOnly = name === 'remainingPaidVacationDays' || name === 'employeeNumber';
        const isDateField = type === 'date';

        return (
          <Grid item xs={12} sm={6} key={name}>
            <TextField
              type={type}
              label={label}
              name={name}
              value={value}
              onChange={onChange}
              error={!!errors[name]}
              helperText={errors[name]}
              fullWidth
              required={required}
              margin="normal"
              variant="outlined"
              InputLabelProps={isDateField ? { shrink: true } : {}}
              InputProps={isReadOnly ? { readOnly: true } : {}}
              disabled={disabled}
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
      defaultValue: PropTypes.any,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default RegisterForm;