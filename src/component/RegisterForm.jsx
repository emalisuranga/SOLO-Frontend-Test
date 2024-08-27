import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid } from '@mui/material';

const RegisterForm = ({ fields, formData, onChange, errors }) => {
  return (
    <Grid container spacing={2}>
      {fields.map((field) => (
        <Grid item xs={12} sm={6} key={field.name}>
          <TextField
            key={field.name}
            type={field.type}
            label={field.label}
            name={field.name}
            value={formData[field.name] !== undefined ? formData[field.name] : (field.defaultValue !== undefined ? field.defaultValue : '')}
            onChange={onChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            fullWidth
            required={field.required}
            margin="normal"
            variant="outlined"
            InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            InputProps={field.name === 'remainingPaidVacationDays' ? { readOnly: true } : {}}
            disabled={field.disabled}
          />
        </Grid>
      ))}
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