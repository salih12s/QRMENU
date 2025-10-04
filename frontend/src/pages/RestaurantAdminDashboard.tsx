import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Restaurant,
  Dashboard,
  Category,
  MenuBook,
  Palette,
  Assessment,
  Settings,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { restaurantService } from '../services/restaurantService';
import { Restaurant as RestaurantType } from '../types';

// Import components
import RestaurantDashboard from '../components/RestaurantAdmin/RestaurantDashboard';
import CategoriesManagement from '../components/RestaurantAdmin/CategoriesManagement';
import MenuManagement from '../components/RestaurantAdmin/MenuManagement';
import ThemeSettings from '../components/RestaurantAdmin/ThemeSettings';
import RestaurantSettings from '../components/RestaurantAdmin/RestaurantSettings';
import RestaurantStats from '../components/RestaurantAdmin/RestaurantStats';

const drawerWidth = 260;

function RestaurantAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.restaurant_id) {
      loadRestaurant();
    }
  }, [user]);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantService.getById(user!.restaurant_id!);
      setRestaurant(data);
    } catch (error) {
      console.error('Restaurant loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Kategoriler', icon: <Category />, path: '/admin/categories' },
    { text: 'Menü', icon: <MenuBook />, path: '/admin/menu' },
    { text: 'Tema', icon: <Palette />, path: '/admin/theme' },
    { text: 'Ayarlar', icon: <Settings />, path: '/admin/settings' },
    { text: 'Raporlar', icon: <Assessment />, path: '/admin/reports' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: restaurant?.theme_color || 'primary.main' }}>
        <Toolbar>
          <Restaurant sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {restaurant?.name || 'Restoran Panel'}
          </Typography>
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.full_name}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route index element={<RestaurantDashboard restaurant={restaurant} />} />
          <Route path="categories" element={<CategoriesManagement restaurantId={user!.restaurant_id!} />} />
          <Route path="menu" element={<MenuManagement restaurantId={user!.restaurant_id!} />} />
          <Route path="theme" element={<ThemeSettings restaurant={restaurant} onUpdate={loadRestaurant} />} />
          <Route path="settings" element={<RestaurantSettings restaurant={restaurant} onUpdate={loadRestaurant} />} />
          <Route path="reports" element={<RestaurantStats restaurantId={user!.restaurant_id!} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default RestaurantAdminDashboard;
