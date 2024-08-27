import React from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBack } from '@mui/icons-material';

const EmployeeHeader = ({ titleKey }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, mt: 2 }}>
      <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
        </IconButton>
      <Typography variant="h5">{t(titleKey)}</Typography>
    </Stack>
  );
};

export default EmployeeHeader;