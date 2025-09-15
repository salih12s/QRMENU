import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantManagement from './admin/RestaurantManagement';
import UserManagement from './admin/UserManagement';
import SystemReports from './admin/SystemReports';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
    },
    secondary: {
      main: '#ff6f00',
      dark: '#e65100',
      light: '#ff8f00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const drawerWidth = 280;

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { 
      path: '/admin/restaurants', 
      label: 'Restoranlar', 
      icon: <RestaurantIcon />,
      description: 'Restoran yönetimi'
    },
    { 
      path: '/admin/users', 
      label: 'Kullanıcılar', 
      icon: <PeopleIcon />,
      description: 'Kullanıcı yönetimi'
    },
    { 
      path: '/admin/reports', 
      label: 'Raporlar', 
      icon: <ReportsIcon />,
      description: 'Sistem raporları'
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const AdminHome = () => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Süper Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Hoş geldin, {user?.username}! Sistem yönetimi için aşağıdaki menülerden birini seçin.
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.path}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleNavigation(item.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Sistem Bilgileri
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<AdminIcon />} 
            label={`Aktif Kullanıcı: ${user?.username}`}
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<DashboardIcon />} 
            label="Super Admin Panel"
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );

  const drawer = (
    <Box>
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
        <AdminIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div">
          Süper Admin
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user?.username}
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => handleNavigation('/admin')}
            selected={location.pathname === '/admin' || location.pathname === '/admin/'}
            sx={{
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Ana Sayfa" />
          </ListItemButton>
        </ListItem>

        {menuItems.map((item) => (
          <ListItem disablePadding key={item.path} sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ borderRadius: 2 }}
        >
          Çıkış Yap
        </Button>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="primary" sx={{ flexGrow: 1 }}>
              QR Menu - Süper Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/restaurants" element={<RestaurantManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<SystemReports />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SuperAdminDashboard;