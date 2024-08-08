import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Components
import Produto from '../Components/Produtos'; // Importando o componente Produto

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerItem = styled(IconButton)(({ theme, active }) => ({
  color: active ? 'rgb(68, 68, 187)' : 'inherit',
}));

const BottomTabBar = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: '#fafafa',
  borderTop: '1px solid #e0e0e0',
  padding: theme.spacing(1, 0),
  zIndex: 1300,
  '& .active': {
    color: 'rgb(68, 68, 187)',
  },
  '& .inactive': {
    color: 'inherit',
  }
}));

const DrawerFooter = styled(Box)({
  marginTop: 'auto',
});

export default function MainLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // Hook for navigation

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to the home page
  };

  const renderDrawer = () => (
    <Drawer variant="permanent" open={open}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          {[
            { text: 'Página Inicial', icon: faHome, active: true },
          ].map(({ text, icon, active }) => (
            <Tooltip key={text} title={text} placement="top">
              <DrawerItem active={active}>
                <FontAwesomeIcon icon={icon} />
              </DrawerItem>
            </Tooltip>
          ))}
        </Box>
        <DrawerFooter>
          <Tooltip title="Sair" placement="top">
            <DrawerItem onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </DrawerItem>
          </Tooltip>
        </DrawerFooter>
      </Box>
    </Drawer>
  );

  const renderBottomTabBar = () => (
    <BottomTabBar>
      {[
        { text: 'Página Inicial', icon: faHome, active: true },
        { text: 'Sair', icon: faSignOutAlt, active: false },
      ].map(({ text, icon, active }) => (
        <Tooltip key={text} title={text} placement="top">
          <IconButton sx={{ color: active ? 'rgb(68, 68, 187)' : 'inherit' }} onClick={text === 'Sair' ? handleLogout : undefined}>
            <FontAwesomeIcon icon={icon} />
          </IconButton>
        </Tooltip>
      ))}
    </BottomTabBar>
  );

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    {!isMobile && renderDrawer()} {/* Render Drawer only on non-mobile screens */}
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Produto />
    </Box>
    {isMobile && renderBottomTabBar()} {/* Render BottomTabBar only on mobile screens */}
  </Box>
  );
}
