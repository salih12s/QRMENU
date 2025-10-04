import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { publicService } from '../services/publicService';
import { PublicMenuData } from '../types';

function PublicMenuPage() {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [menuData, setMenuData] = useState<PublicMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (qrCode) {
      loadMenu();
    }
  }, [qrCode]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await publicService.getMenuByQRCode(qrCode!);
      setMenuData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Menü yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!menuData) {
    return null;
  }

  const themeColor = menuData.restaurant.theme_color || '#1976d2';

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 4 }}>
      {/* Header with Cover Image */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: themeColor,
          color: 'white',
          mb: 4,
          overflow: 'hidden',
        }}
      >
        {/* Cover Image */}
        {menuData.restaurant.cover_image_url && (
          <Box
            component="img"
            src={menuData.restaurant.cover_image_url}
            alt="Cover"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(to bottom, rgba(0,0,0,0.3), ${themeColor}dd)`,
          }}
        />

        {/* Content */}
        <Container maxWidth="md" sx={{ position: 'relative', py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuData.restaurant.logo_url ? (
              <Avatar
                src={menuData.restaurant.logo_url}
                sx={{ 
                  width: 80, 
                  height: 80,
                  border: '3px solid white',
                  boxShadow: 3,
                }}
              />
            ) : (
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '3px solid white',
              }}>
                <RestaurantIcon sx={{ fontSize: 40 }} />
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                {menuData.restaurant.name}
              </Typography>
              {menuData.restaurant.description && (
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.95, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {menuData.restaurant.description}
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Menu Content */}
      <Container maxWidth="md">
        {menuData.categories.length > 0 ? (
          <>
            {/* Category Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': {
                    color: themeColor,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: themeColor,
                  },
                }}
              >
                {menuData.categories.map((category, index) => (
                  <Tab
                    key={category.id}
                    label={category.name}
                    id={`category-tab-${index}`}
                    aria-controls={`category-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            {menuData.categories.map((category, index) => (
              <Box
                key={category.id}
                role="tabpanel"
                hidden={selectedTab !== index}
                id={`category-tabpanel-${index}`}
                aria-labelledby={`category-tab-${index}`}
              >
                {selectedTab === index && (
                  <Box>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {category.description}
                      </Typography>
                    )}

                    <Grid container spacing={2}>
                      {category.items.map((item) => (
                        <Grid item xs={12} key={item.id}>
                          <Card sx={{ display: 'flex', height: '100%' }}>
                            {item.image_url && (
                              <CardMedia
                                component="img"
                                sx={{ width: 120, height: 120, objectFit: 'cover' }}
                                image={item.image_url}
                                alt={item.name}
                              />
                            )}
                            <CardContent sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <Typography variant="h6" component="div">
                                  {item.name}
                                </Typography>
                                <Chip
                                  label={`₺${Number(item.price).toFixed(2)}`}
                                  color="primary"
                                  sx={{ bgcolor: themeColor, fontWeight: 'bold' }}
                                />
                              </Box>
                              {item.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {item.description}
                                </Typography>
                              )}
                              {item.allergen_info && (
                                <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                                  ⚠️ {item.allergen_info}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {category.items.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 4, textAlign: 'center' }}>
                        Bu kategoride henüz ürün bulunmuyor.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </>
        ) : (
          <Alert severity="info">Henüz menü oluşturulmamış.</Alert>
        )}
      </Container>
    </Box>
  );
}

export default PublicMenuPage;
