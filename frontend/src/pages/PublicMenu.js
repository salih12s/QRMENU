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
  Grid,
  Chip,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Warning as WarningIcon,
  LocalOffer as PriceIcon,
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
          elevation={2}
          sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: 'white',
            borderRadius: 0,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <RestaurantIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                {menuData?.restaurant?.name}
              </Typography>
              {menuData?.restaurant?.description && (
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {menuData.restaurant.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Chip
                  icon={<QrCodeIcon />}
                  label="QR Menü"
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Category Tabs */}
          {menuData?.categories && menuData.categories.length > 0 && (
            <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 64,
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
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
                <Grid container spacing={3}>
                  {selectedCategoryData.menu_items?.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        {item.image_url && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={item.image_url}
                            alt={item.name}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                        
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1 }}>
                              {item.name}
                            </Typography>
                            <Chip
                              icon={<PriceIcon />}
                              label={`₺${parseFloat(item.price).toFixed(2)}`}
                              color="primary"
                              sx={{ ml: 1, fontWeight: 600 }}
                            />
                          </Box>

                          {item.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {item.description}
                            </Typography>
                          )}

                          {item.allergens && (
                            <Box sx={{ mt: 'auto' }}>
                              <Divider sx={{ mb: 1 }} />
                              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                                <WarningIcon color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                                  Alerjenler:
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.allergens}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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