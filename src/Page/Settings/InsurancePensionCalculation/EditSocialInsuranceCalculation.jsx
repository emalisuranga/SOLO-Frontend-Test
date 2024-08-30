import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import getSocialInsuranceFields from "../../../utils/sections/insurancePensionSections";
import useSocialInsuranceCalculationStore from "../../../store/useSocialInsuranceCalculationStore";
import InsurancePensionForm from "./InsurancePensionForm";
import Loading from "../../../component/Common/Loading";

const EditSocialInsuranceCalculation = () => {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);

  const { socialInsuranceCalculation, loading, fetchSocialInsuranceCalculationDetails } = useSocialInsuranceCalculationStore((state) => ({
    socialInsuranceCalculation: state.socialInsuranceCalculation,
    loading: state.loading,
    fetchSocialInsuranceCalculationDetails: state.fetchSocialInsuranceCalculationDetails,
  }));

  useEffect(() => {
    const fetchData = async () => {
      await fetchSocialInsuranceCalculationDetails();
      const fetchedSections = getSocialInsuranceFields();
      setSections(fetchedSections);
    };

    fetchData();
  }, [fetchSocialInsuranceCalculationDetails]);

  if (loading) {
    return (
        <Loading />
    );
  }

  const handleSubmit = (data) => {
    // Implement the submission logic here
    console.log('Submitted data:', data);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">{t('Employee Details')}</Typography>
          </Box>
          {/* <InsurancePensionForm sections={sections} onSubmit={handleSubmit} /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditSocialInsuranceCalculation;