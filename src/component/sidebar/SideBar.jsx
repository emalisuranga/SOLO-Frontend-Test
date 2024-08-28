import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { AppBar, Drawer, DrawerHeader, StyledListItemButton } from './SideBar.styles';  // Import the styled component

export default function SideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState('/');
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    setSelectedItem(path);
    navigate(path);
  };

  const navigationItems = [
    { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/' },
    { text: '従業員', icon: <PeopleAltIcon />, path: '/employee' },
    { text: '給与', icon: <CurrencyYenIcon />, path: '/salary-details' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            人事制度
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <StyledListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={selectedItem === item.path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}