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
import Collapse from '@mui/material/Collapse';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SocialIcon from '@mui/icons-material/Security'; // Example icon
import RemunerationIcon from '@mui/icons-material/AttachMoney'; // Example icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { AppBar, Drawer, DrawerHeader, StyledListItemButton } from './SideBar.styles';  // Import the styled component

export default function SideBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState('/');
  const [settingsOpen, setSettingsOpen] = React.useState(false);
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

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const navigationItems = [
    { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/' },
    { text: t('navigation.employee'), icon: <PeopleAltIcon />, path: '/employee' },
    { text: t('navigation.salaryDetails'), icon: <CurrencyYenIcon />, path: '/salary-details' },
  ];

  const settingsItems = [
    { text: t('navigation.settings.socialInsurance'), icon: <SocialIcon />, path: '/settings/pension-insurance-calculation' },
    // { text: t('navigation.settings.monthlyRemuneration'), icon: <RemunerationIcon />, path: '/settings/monthly-remuneration' },
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

          <ListItem disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton onClick={handleSettingsClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('navigation.settings.label')} sx={{ opacity: open ? 1 : 0 }} />
              {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </StyledListItemButton>
          </ListItem>

          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ pl: 4 }}>
                  <StyledListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={selectedItem === item.path}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </StyledListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

        </List>
      </Drawer>
    </Box>
  );
}