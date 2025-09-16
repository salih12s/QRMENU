import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Zoom,
  Fade,
  CardHeader
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Save as SaveIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Visibility as ViewsIcon,
  MenuBook as MenuIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const RestaurantInfo = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [restaurant, setRestaurant] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user?.restaurant_id) {
      loadRestaurantInfo();
    }
  }, [user]);

  const loadRestaurantInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantService.getRestaurant(user.restaurant_id);
      setRestaurant(response.restaurant);
      setFormData({
        name: response.restaurant.name || '',
        description: response.restaurant.description || '',
        address: response.restaurant.address || '',
        phone: response.restaurant.phone || '',
        email: response.restaurant.email || ''
      });
    } catch (error) {
      setError('Restoran bilgileri yüklenirken hata oluştu');
      console.error('Load restaurant info error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      await restaurantService.updateRestaurant(user.restaurant_id, formData);
      await loadRestaurantInfo();
      setSuccess('Restoran bilgileri başarıyla güncellendi');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError('Güncelleme sırasında hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
      console.error('Update restaurant error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      setError('');
      const response = await restaurantService.generateQRCode(user.restaurant_id);
      setQrData(response);
      setSuccess('QR kod başarıyla oluşturuldu');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError('QR kod oluşturulurken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
      console.error('Generate QR error:', error);
    }
  };

  const handleDownloadQR = () => {
    if (qrData) {
      const link = document.createElement('a');
      link.href = qrData.qrCode;
      link.download = `${restaurant.name}_QR.png`;
      link.click();
      setSuccess('QR kod indirildi');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="50vh"
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
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                  }
                }} 
              />
            </Box>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="600" color="primary" mb={1}>
              Restoran Bilgileri Yükleniyor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lütfen bekleyiniz...
            </Typography>
          </Box>
        </Box>
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
            <SettingsIcon sx={{ color: 'primary.main', fontSize: 36 }} />
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
              Restoran Bilgileri
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight="medium">
              Restoran bilgilerinizi görüntüleyin ve güncelleyin
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Fade>
      )}
      {success && (
        <Fade in={!!success}>
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }} 
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={4}>
        {/* Restaurant Form */}
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`
            }}
          >
            <CardHeader
              avatar={
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 48,
                    height: 48
                  }}
                >
                  <InfoIcon />
                </Avatar>
              }
              title={
                <Typography variant="h5" fontWeight="bold">
                  Temel Bilgiler
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Restoran bilgilerinizi düzenleyin ve güncelleyin
                </Typography>
              }
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            />
            
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Restoran Adı"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={updating}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <RestaurantIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Açıklama"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    disabled={updating}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Adres"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    disabled={updating}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefon"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={updating}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={updating}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </CardContent>

            <CardActions sx={{ p: 3, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={updating}
                startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSubmit}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                  }
                }}
              >
                {updating ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* QR Code and Stats */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* QR Code Section */}
            <Card 
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.info.main, 0.08)}`
              }}
            >
              <CardHeader
                avatar={
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.info.main,
                      width: 48,
                      height: 48
                    }}
                  >
                    <QrCodeIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" fontWeight="bold">
                    QR Kod
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Menü QR kodunuzu yönetin
                  </Typography>
                }
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              />
              
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {qrData ? (
                  <Zoom in={!!qrData}>
                    <Box>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          mb: 3, 
                          display: 'inline-block',
                          borderRadius: 2,
                          border: `2px solid ${alpha(theme.palette.info.main, 0.1)}`
                        }}
                      >
                        <img 
                          src={qrData.qrCode} 
                          alt="QR Kod" 
                          style={{
                            width: '200px',
                            height: '200px',
                            display: 'block'
                          }}
                        />
                      </Paper>
                      
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="QR Kodu İndir" arrow>
                            <Button
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              onClick={handleDownloadQR}
                              sx={{ borderRadius: 2 }}
                            >
                              İndir
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Yeni QR Kod Oluştur" arrow>
                            <Button
                              variant="contained"
                              startIcon={<RefreshIcon />}
                              onClick={handleGenerateQR}
                              sx={{ borderRadius: 2 }}
                            >
                              Yenile
                            </Button>
                          </Tooltip>
                        </Stack>
                        
                        <Paper 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(theme.palette.grey[50], 0.8),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold" color="text.primary" mb={1}>
                            Menü URL:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="primary" 
                            sx={{ 
                              wordBreak: 'break-all',
                              fontFamily: 'monospace',
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              p: 1,
                              borderRadius: 1
                            }}
                          >
                            {qrData.menuUrl}
                          </Typography>
                        </Paper>
                      </Stack>
                    </Box>
                  </Zoom>
                ) : (
                  <Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.grey[400], 0.1),
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      <QrCodeIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    </Avatar>
                    
                    <Typography variant="h6" color="text.secondary" mb={2}>
                      QR Kod Oluşturun
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Müşterilerinizin menünüze kolayca erişebilmesi için QR kod oluşturun
                    </Typography>
                    
                    <Button
                      variant="contained"
                      startIcon={<QrCodeIcon />}
                      onClick={handleGenerateQR}
                      size="large"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      QR Kod Oluştur
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {restaurant && (
              <Card 
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.08)}`
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.success.main,
                        width: 48,
                        height: 48
                      }}
                    >
                      <ViewsIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" fontWeight="bold">
                      İstatistikler
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Restoran performans bilgileri
                    </Typography>
                  }
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}
                />
                
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <MenuIcon sx={{ mr: 2, color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {restaurant.menu_items_count || 0}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        Toplam Menü Öğeleri
                      </Typography>
                    </Paper>

                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <ViewsIcon sx={{ mr: 2, color: 'success.main', fontSize: 24 }} />
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {restaurant.total_views || 0}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        Toplam Görüntülenme
                      </Typography>
                    </Paper>

                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarIcon sx={{ mr: 2, color: 'info.main', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold" color="info.main">
                          {new Date(restaurant.created_at).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        Oluşturulma Tarihi
                      </Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RestaurantInfo;
