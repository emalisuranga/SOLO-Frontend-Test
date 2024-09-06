import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SideBar from './component/sidebar/SideBar';
import AppRoutes from './routes/AppRoutes';
import CustomSnackbar from "./component/Common/CustomSnackbar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <SideBar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '40px' }}>
            <AppRoutes />
          </Box>
        </Box>
      </BrowserRouter>
      <CustomSnackbar />
    </>
  );
};

export default App;