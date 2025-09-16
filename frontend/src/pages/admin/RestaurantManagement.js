import React, { useState, useEffect, useCallback } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { authService } from '../../services/authService';
import RestaurantModal from '../../components/RestaurantModal';
import QRCodeModal from '../../components/QRCodeModal';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Stack,
  Paper,
  Divider,
  Badge,
  useTheme,
  Zoom
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Visibility as ViewsIcon,
  MenuBook as MenuIcon,
  Refresh as RefreshIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const theme = useTheme();

  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantService.getAllRestaurants();
      setRestaurants(response.restaurants);
    } catch (error) {
      setError('Restoranlar yüklenirken hata oluştu');
      console.error('Load restaurants error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRestaurants();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCreate = () => {
    setSelectedRestaurant(null);
    setShowModal(true);
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleDelete = async (restaurant) => {
    if (window.confirm(`"${restaurant.name}" restoranını silmek istediğinizden emin misiniz?`)) {
      try {
        await restaurantService.deleteRestaurant(restaurant.id);
        setSuccess('Restoran başarıyla silindi');
        await loadRestaurants();
      } catch (error) {
        setError('Restoran silinirken hata oluştu');
        console.error('Delete restaurant error:', error);
      }
    }
  };

  const handleSave = async (restaurantData) => {
    try {
      if (selectedRestaurant) {
        await restaurantService.updateRestaurant(selectedRestaurant.id, restaurantData);
        setSuccess('Restoran başarıyla güncellendi');
      } else {
        await restaurantService.createRestaurant(restaurantData);
        setSuccess('Restoran başarıyla oluşturuldu');
      }
      setShowModal(false);
      await loadRestaurants();
    } catch (error) {
      throw error;
    }
  };

  const handleGenerateQR = async (restaurant) => {
    try {
      const response = await restaurantService.generateQRCode(restaurant.id);
      setQrData({ ...response, restaurant });
      setShowQRModal(true);
    } catch (error) {
      setError('QR kod oluşturulurken hata oluştu');
      console.error('Generate QR error:', error);
    }
  };

  const handleCreateAdmin = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setAdminForm({ username: '', email: '', password: '' });
    setShowAdminDialog(true);
  };

  const handleAdminFormSubmit = async () => {
    try {
      await authService.register({
        ...adminForm,
        role: 'restaurant_admin',
        restaurant_id: selectedRestaurant.id
      });
      setSuccess(`${selectedRestaurant.name} için admin başarıyla oluşturuldu`);
      setShowAdminDialog(false);
      setAdminForm({ username: '', email: '', password: '' });
    } catch (error) {
      setError('Admin oluşturulurken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    }
  };

  const RestaurantCard = ({ restaurant, index }) => (
    <Zoom in={!loading} style={{ transitionDelay: loading ? '0ms' : `${index * 100}ms` }}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.05)}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            '& .restaurant-actions': {
              transform: 'translateY(0)',
              opacity: 1
            }
          }
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
            color: 'white',
            p: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
              transform: 'translate(30px, -30px)'
            }
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Badge
                badgeContent={restaurant.is_active ? '●' : '●'}
                color={restaurant.is_active ? 'success' : 'error'}
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '8px',
                    minWidth: '12px',
                    height: '12px',
                    borderRadius: '50%'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: alpha('#fff', 0.2),
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${alpha('#fff', 0.3)}`,
                    width: 56,
                    height: 56
                  }}
                >
                  <RestaurantIcon fontSize="large" sx={{ color: '#fff' }} />
                </Avatar>
              </Badge>
              <Box ml={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
                  {restaurant.name}
                </Typography>
                <Chip
                  label={restaurant.is_active ? 'Aktif' : 'Pasif'}
                  size="small"
                  sx={{ 
                    mt: 0.5,
                    bgcolor: restaurant.is_active ? alpha('#4caf50', 0.2) : alpha('#f44336', 0.2),
                    color: '#fff',
                    fontWeight: 'bold',
                    border: `1px solid ${restaurant.is_active ? alpha('#4caf50', 0.5) : alpha('#f44336', 0.5)}`
                  }}
                />
              </Box>
            </Box>
            <Chip 
              label={`#${restaurant.id}`} 
              size="small" 
              sx={{
                bgcolor: alpha('#fff', 0.15),
                color: '#fff',
                fontWeight: 'bold',
                border: `1px solid ${alpha('#fff', 0.3)}`
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack spacing={2.5}>
            {restaurant.description && (
              <Box 
                display="flex" 
                alignItems="flex-start"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                }}
              >
                <DescriptionIcon sx={{ 
                  mr: 1.5, 
                  mt: 0.5, 
                  fontSize: 20, 
                  color: 'info.main',
                  flexShrink: 0
                }} />
                <Typography variant="body2" color="text.primary" lineHeight={1.6}>
                  {restaurant.description}
                </Typography>
              </Box>
            )}

            {restaurant.address && (
              <Box display="flex" alignItems="flex-start">
                <LocationIcon sx={{ 
                  mr: 1.5, 
                  mt: 0.5, 
                  fontSize: 20, 
                  color: 'primary.main',
                  flexShrink: 0 
                }} />
                <Typography variant="body2" color="text.primary" lineHeight={1.6}>
                  {restaurant.address}
                </Typography>
              </Box>
            )}

            <Box display="flex" gap={2}>
              {restaurant.phone && (
                <Box display="flex" alignItems="center" flex={1}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 18, color: 'success.main' }} />
                  <Typography variant="body2" fontSize="0.85rem">
                    {restaurant.phone}
                  </Typography>
                </Box>
              )}

              {restaurant.email && (
                <Box display="flex" alignItems="center" flex={1}>
                  <EmailIcon sx={{ mr: 1, fontSize: 18, color: 'warning.main' }} />
                  <Typography variant="body2" fontSize="0.85rem">
                    {restaurant.email}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 2.5, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <MenuIcon sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {restaurant.menu_items_count || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Menü Öğesi
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 2.5, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.success.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <ViewsIcon sx={{ mr: 1, color: 'success.main', fontSize: 24 }} />
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {restaurant.total_views || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Görüntülenme
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>

        <CardActions 
          className="restaurant-actions"
          sx={{ 
            p: 2.5, 
            justifyContent: 'space-between',
            bgcolor: alpha(theme.palette.grey[50], 0.8),
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transform: 'translateY(10px)',
            opacity: 0.7,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title="Düzenle" arrow>
              <IconButton
                onClick={() => handleEdit(restaurant)}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': { 
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="QR Kod Oluştur" arrow>
              <IconButton
                onClick={() => handleGenerateQR(restaurant)}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: 'info.main',
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  '&:hover': { 
                    bgcolor: 'info.main',
                    color: 'white',
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`
                  }
                }}
              >
                <QrCodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Admin Oluştur" arrow>
              <IconButton
                onClick={() => handleCreateAdmin(restaurant)}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  '&:hover': { 
                    bgcolor: 'success.main',
                    color: 'white',
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`
                  }
                }}
              >
                <PersonAddIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sil" arrow>
              <IconButton
                onClick={() => handleDelete(restaurant)}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: 'error.main',
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  '&:hover': { 
                    bgcolor: 'error.main',
                    color: 'white',
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    </Zoom>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="60vh"
          gap={3}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress 
              size={80} 
              thickness={3}
              sx={{
                color: theme.palette.primary.main,
                animationDuration: '2s'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RestaurantIcon 
                sx={{ 
                  fontSize: 32, 
                  color: theme.palette.primary.main,
                  animation: 'pulse 2s infinite'
                }} 
              />
            </Box>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="600" color="primary" mb={1}>
              Restoranlar Yükleniyor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lütfen bekleyiniz, veriler hazırlanıyor...
            </Typography>
          </Box>

          <Box sx={{ width: '300px' }}>
            <Box 
              sx={{
                height: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 2,
                  animation: 'loading 2s ease-in-out infinite',
                  '@keyframes loading': {
                    '0%': { width: '0%', transform: 'translateX(0)' },
                    '50%': { width: '100%', transform: 'translateX(0)' },
                    '100%': { width: '100%', transform: 'translateX(100%)' }
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Global keyframes for animations */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header Section */}
      <Box 
        mb={4}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderRadius: 3,
          p: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                p: 1.5,
                mr: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <StoreIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            </Box>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Restoran Yönetimi
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Sistemdeki restoranları yönetin ve ayarlarını düzenleyin
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Listeyi Yenile" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <RefreshIcon 
                  sx={{ 
                    color: 'primary.main',
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} 
                />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                }
              }}
            >
              Yeni Restoran Ekle
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <RestaurantIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                {restaurants.length}
              </Typography>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Toplam Restoran
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Sistemde kayıtlı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.15)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.success.main,
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.3)}`
                }}
              >
                <StoreIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                {restaurants.filter(r => r.is_active).length}
              </Typography>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Aktif Restoran
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Şu anda hizmet veren
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${alpha(theme.palette.info.main, 0.15)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.info.main,
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.3)}`
                }}
              >
                <MenuIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="info.main" mb={1}>
                {restaurants.reduce((sum, r) => sum + (r.menu_items_count || 0), 0)}
              </Typography>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Toplam Menü
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Menü öğesi sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${alpha(theme.palette.warning.main, 0.15)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.warning.main,
                  mx: 'auto', 
                  mb: 2, 
                  width: 64, 
                  height: 64,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.3)}`
                }}
              >
                <ViewsIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="warning.main" mb={1}>
                {restaurants.reduce((sum, r) => sum + (r.total_views || 0), 0)}
              </Typography>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Görüntülenme
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Toplam ziyaret sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {restaurants.length > 0 ? (
        <Grid container spacing={3}>
          {restaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} lg={4} key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} index={index} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.4)} 100%)`,
            border: `2px dashed ${alpha(theme.palette.grey[400], 0.3)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)`,
              pointerEvents: 'none'
            }
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.grey[400], 0.1),
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                border: `3px dashed ${alpha(theme.palette.grey[400], 0.3)}`
              }}
            >
              <RestaurantIcon sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
            
            <Typography variant="h4" fontWeight="bold" color="text.primary" mb={2}>
              Henüz Restoran Bulunmuyor
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={1}>
              Sisteminizde kayıtlı restoran bulunmamaktadır
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} maxWidth="400px" mx="auto">
              İlk restoranınızı oluşturarak QR menü sisteminizi kullanmaya başlayabilirsiniz
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                }
              }}
            >
              İlk Restoranı Oluştur
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog 
        open={showAdminDialog} 
        onClose={() => setShowAdminDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
          }
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              <PersonAddIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Admin Oluştur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRestaurant?.name} için yeni yönetici hesabı
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              value={adminForm.username}
              onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              fullWidth
              label="Email Adresi"
              type="email"
              value={adminForm.email}
              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setShowAdminDialog(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdminFormSubmit}
            startIcon={<PersonAddIcon />}
            disabled={!adminForm.username || !adminForm.email || !adminForm.password}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
              }
            }}
          >
            Admin Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {showModal && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showQRModal && qrData && (
        <QRCodeModal
          qrData={qrData}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </Container>
  );
};

export default RestaurantManagement;
