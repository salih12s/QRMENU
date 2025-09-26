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
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalDining as LocalDiningIcon,
  LocalBar as LocalBarIcon,
  Cake as CakeIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryView, setShowCategoryView] = useState(false);

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading menu for QR code:', qrCode);
      const response = await menuService.getMenuByQR(qrCode);
      console.log('Menu response:', response);
      setMenuData(response);
      setSelectedCategory(null);
      setShowCategoryView(false);
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryView(true);
  };

  const handleBackToCategories = () => {
    setShowCategoryView(false);
    setSelectedCategory(null);
  };

  // Kategori icon'larını belirle
  const getCategoryIcon = (categoryName) => {
    const iconStyles = { 
      fontSize: { xs: 32, sm: 40, md: 48 }, 
      color: 'white' 
    };
    
    const name = categoryName.toLowerCase();
    if (name.includes('ana yemek') || name.includes('yemek') || name.includes('main')) {
      return <LocalDiningIcon sx={iconStyles} />;
    } else if (name.includes('içecek') || name.includes('drink') || name.includes('beverage')) {
      return <LocalBarIcon sx={iconStyles} />;
    } else if (name.includes('tatlı') || name.includes('dessert') || name.includes('sweet')) {
      return <CakeIcon sx={iconStyles} />;
    } else {
      return <RestaurantIcon sx={iconStyles} />;
    }
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

  if (error || !menuData) {
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Restaurant Header */}
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
            color: 'white',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ py: { xs: 3, sm: 4, md: 6 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                fontSize: { xs: 50, sm: 60, md: 80 }, 
                mb: { xs: 1.5, sm: 2 },
                '& > span': { 
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: { xs: 60, sm: 80, md: 100 },
                  height: { xs: 60, sm: 80, md: 100 },
                  lineHeight: { xs: '60px', sm: '80px', md: '100px' },
                  margin: '0 auto'
                }
              }}>
                <span>🍽️</span>
              </Box>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {menuData?.restaurant?.name || 'MSSCAFE'}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                }}
              >
                {menuData?.restaurant?.description || 'MSSCAFE VE RESTORANT'}
              </Typography>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 3 } }}>
          {!showCategoryView ? (
            // Ana Kategori Görünümü
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                textAlign="center" 
                sx={{ 
                  mb: { xs: 3, sm: 4 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                }}
              >
                Menü Kategorileri
              </Typography>
              
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }} 
                sx={{
                  justifyContent: { xs: 'stretch', sm: 'stretch', md: 'center' }
                }}
                alignItems="stretch"
              >
                {menuData?.categories?.length > 0 ? (
                  menuData.categories.map((category) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={12} 
                    md={4} 
                    key={category.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: { xs: 'stretch', sm: 'stretch', md: 'center' },
                      width: '100%'
                    }}
                  >
                    <Card
                      onClick={() => handleCategorySelect(category)}
                      sx={{
                        height: { xs: 160, sm: 180, md: 200 },
                        width: '100%', // Her durumda container'ın tam genişliği
                        cursor: 'pointer',
                        borderRadius: { xs: 3, sm: 4 },
                        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                          opacity: 0.3
                        }
                      }}
                    >
                      <CardContent 
                        sx={{ 
                          p: { xs: 1.5, sm: 3, md: 4 },
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          position: 'relative',
                          zIndex: 1,
                          flex: 1
                        }}
                      >
                        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                          {getCategoryIcon(category.name)}
                        </Box>
                        <Typography 
                          variant={{ xs: 'h6', sm: 'h5' }} 
                          fontWeight="bold" 
                          sx={{ 
                            mb: { xs: 0.5, sm: 1 },
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            opacity: 0.9,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          {category.menu_items?.length || 0} ürün
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                      <CardContent>
                        <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" gutterBottom color="text.secondary">
                          Henüz Menü Eklenmemiş
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Bu restoran henüz menü kategorileri ve yemeklerini eklemeyi tamamlamamış. 
                          Lütfen daha sonra tekrar kontrol edin.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            // Kategori Detay Görünümü
            <Box>
              {/* Geri Dönüş Butonu */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBackToCategories}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    textTransform: 'none',
                    fontWeight: 600,
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Kategorilere Geri Dön
                </Button>
              </Box>

              <Typography 
                variant="h4" 
                fontWeight="bold" 
                textAlign="center" 
                sx={{ 
                  mb: { xs: 3, sm: 4 }, 
                  color: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                }}
              >
                {selectedCategory?.name}
              </Typography>

              {selectedCategory?.menu_items?.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'center' }}>
                  Bu kategoride henüz ürün bulunmuyor
                </Alert>
              ) : (
                <Stack spacing={3}>
                  {selectedCategory?.menu_items?.map((item) => (
                    <Card
                      key={item.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        borderRadius: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        minHeight: { xs: 120, sm: 140 },
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
                          p: { xs: 1.5, sm: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '0.95rem', sm: '1.25rem' },
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
                                fontSize: { xs: '0.95rem', sm: '1.25rem' },
                                ml: { xs: 1, sm: 2 }
                              }}
                            >
                              {parseFloat(item.price).toFixed(2)} ₺
                            </Typography>
                          </Box>
                          
                          {item.description && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                lineHeight: 1.5,
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
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
                          width: { xs: 120, sm: 200 },
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
                              borderRadius: '0 12px 12px 0'
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
                              borderRadius: '0 12px 12px 0'
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