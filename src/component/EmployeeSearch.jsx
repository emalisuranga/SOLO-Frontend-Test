import React from "react";
import { Grid, Box, TextField, MenuItem, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const EmployeeSearch = ({
  employeeList,
  searchName,
  searchId,
  searchCategory,
  employeeCategories,
  handleNameChange,
  handleIdChange,
  handleSearch,
  handleEmployeeCategoriesChange,
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label={t("fields.category")}
          variant="outlined"
          value={searchCategory}
          onChange={handleEmployeeCategoriesChange}
          select
          size="small"
          sx={{ width: 200 }}
        >
          {employeeCategories.map((item, index) => (
            <MenuItem key={item.id || index} value={item.id}>
              {item.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t("name")}
          variant="outlined"
          value={searchName}
          onChange={handleNameChange}
          select
          size="small"
          sx={{ width: 200 }}
        >
          {employeeList.map((item, index) => (
            <MenuItem
              key={item.id || index}
              value={`${item.lastName} ${item.firstName}`}
            >
              {`${item.lastName} ${item.firstName}`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t("ID")}
          variant="outlined"
          value={searchId}
          onChange={handleIdChange}
          select
          size="small"
          sx={{ width: 100 }}
        >
          {employeeList.map((item, index) => (
            <MenuItem key={item.id || index} value={item.id}>
              {item.employeeNumber}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleSearch} sx={{ height: 40 }}>
          {t("Search")}
        </Button>
      </Box>
    </Grid>
  );
};

export default EmployeeSearch;
