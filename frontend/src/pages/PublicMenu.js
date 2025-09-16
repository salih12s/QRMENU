import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { menuService } from '../services/menuService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  QrCode as QrCodeIcon,
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
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const PublicMenu = () => {
  const { qrCode } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading menu for QR code:', qrCode);
      const response = await menuService.getMenuByQR(qrCode);
      console.log('Menu response:', response);
      setMenuData(response);
      setSelectedCategory(0);
    } catch (error) {
      console.error('Load menu error:', error);
      console.error('Error response:', error.response);
      setError('Menü bulunamadı veya erişim sağlanamadı');
    } finally {
      setLoading(false);
    }
  }, [qrCode]);

  useEffect(() => {
    if (qrCode) {
      loadMenu();
    }
  }, [qrCode, loadMenu]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Menü yükleniyor...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 400, textAlign: 'center', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <WarningIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="error">
                Menü Bulunamadı
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {error}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  const selectedCategoryData = menuData?.categories[selectedCategory];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
            color: 'white',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ py: { xs: 4, sm: 6 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <RestaurantIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.5px'
                }}
              >
                {menuData?.restaurant?.name}
              </Typography>
              {menuData?.restaurant?.description && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.95, 
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.5
                  }}
                >
                  {menuData.restaurant.description}
                </Typography>
              )}
              <Box sx={{ mt: 3 }}>
                <Chip
                  icon={<QrCodeIcon />}
                  label="QR Menü"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.7)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 1,
                    '& .MuiChip-icon': { 
                      color: 'white',
                      fontSize: 20
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
          {/* Category Tabs */}
          {menuData?.categories && menuData.categories.length > 0 && (
            <Paper elevation={1} sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2, overflow: 'hidden' }}>
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minHeight: { xs: 56, sm: 64 },
                    padding: { xs: '8px 12px', sm: '12px 16px' },
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '& .MuiTabs-scrollButtons': {
                    '&.Mui-disabled': {
                      opacity: 0.3,
                    }
                  }
                }}
              >
                {menuData.categories.map((category, index) => (
                  <Tab
                    key={category.id}
                    label={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'inherit' }}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {category.menu_items?.length || 0} ürün
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Paper>
          )}

          {/* Menu Items */}
          {selectedCategoryData && (
            <Box>
              <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3, textAlign: 'center' }}>
                {selectedCategoryData.name}
              </Typography>

              {selectedCategoryData.menu_items?.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'center' }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  Bu kategoride henüz ürün bulunmuyor
                </Alert>
              ) : (
                <Stack spacing={3}>
                  {selectedCategoryData.menu_items?.map((item) => (
                    <Card
                      key={item.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row', // Mobilde de yatay
                        borderRadius: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        minHeight: { xs: 120, sm: 140 }, // Mobilde biraz daha küçük
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                        },
                        ...(item.is_available === false && {
                          opacity: 0.7,
                          filter: 'grayscale(0.5)'
                        })
                      }}
                    >
                      {/* Sol taraf - İçerik */}
                      <Box 
                        sx={{ 
                          flex: 1, 
                          p: { xs: 1.5, sm: 3 }, // Mobilde daha az padding
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* Başlık ve Fiyat */}
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '0.95rem', sm: '1.25rem' }, // Mobilde daha küçük font
                                color: 'text.primary',
                                lineHeight: 1.3
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: 'primary.main',
                                fontSize: { xs: '0.95rem', sm: '1.25rem' }, // Mobilde daha küçük font
                                ml: { xs: 1, sm: 2 } // Mobilde daha az margin
                              }}
                            >
                              ₺{parseFloat(item.price).toFixed(2)}
                            </Typography>
                          </Box>
                          
                          {/* Açıklama - sadece varsa göster */}
                          {item.description && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                lineHeight: 1.5,
                                fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Mobilde daha küçük
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: { xs: 2, sm: 3 },
                                WebkitBoxOrient: 'vertical',
                                mb: { xs: 1, sm: 0 }
                              }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Alt bilgiler */}
                        {item.allergens && (
                          <Box sx={{ mt: 1 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'warning.main',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              ⚠️ Alerjen uyarısı: {item.allergens}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Sağ taraf - Resim */}
                      <Box 
                        sx={{ 
                          width: { xs: 120, sm: 200 }, // Mobilde daha küçük resim alanı
                          height: { xs: 120, sm: 140 },
                          position: 'relative',
                          flexShrink: 0
                        }}
                      >
                        {item.image_url ? (
                          <CardMedia
                            component="img"
                            image={item.image_url}
                            alt={item.name}
                            sx={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: { xs: '0 12px 12px 0', sm: '0 12px 12px 0' } // Mobilde de sağ köşeler yuvarlak
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: { xs: '0 12px 12px 0', sm: '0 12px 12px 0' } // Mobilde de sağ köşeler yuvarlak
                            }}
                          >
                            <RestaurantIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                          </Box>
                        )}
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Paper 
          elevation={0}
          sx={{ 
            mt: 6, 
            py: 3, 
            backgroundColor: '#f5f5f5',
            borderRadius: 0,
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2025 QR Menu sistemi ile hazırlanmıştır
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
              Ziyaret zamanı: {new Date().toLocaleString('tr-TR')}
            </Typography>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default PublicMenu;