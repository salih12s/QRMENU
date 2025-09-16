import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { menuService } from '../../services/menuService';
import MenuItemModal from '../../components/MenuItemModal';
import CategoryModal from '../../components/CategoryModal';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Chip,
  IconButton,
  Paper,
  Alert,
  Tooltip,
  Avatar,
  CircularProgress,
  alpha,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  MenuBook as MenuIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  Fastfood as FastfoodIcon
} from '@mui/icons-material';

const RestaurantMenuManagement = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await menuService.getRestaurantMenu(user?.restaurant_id);
      setCategories(response.categories);
      
      // Debug: Resim verilerini kontrol et
      response.categories?.forEach(category => {
        category.menu_items?.forEach(item => {
          if (item.image_url) {
            console.log(`Ürün: ${item.name}, Resim var: ${item.image_url ? 'Evet' : 'Hayır'}`, 
                       item.image_url ? `İlk 50 karakter: ${item.image_url.substring(0, 50)}...` : '');
          }
        });
      });
      
      setError('');
    } catch (error) {
      setError('Menü yüklenirken hata oluştu');
      console.error('Load menu error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.restaurant_id]);

  useEffect(() => {
    if (user?.restaurant_id) {
      loadMenu();
    }
  }, [user?.restaurant_id, loadMenu]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMenu();
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bu kategoriyi ve içindeki tüm ürünleri silmek istediğinizden emin misiniz?')) {
      try {
        await menuService.deleteCategory(categoryId);
        await loadMenu();
      } catch (error) {
        alert('Kategori silinirken hata oluştu');
        console.error('Delete category error:', error);
      }
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        await menuService.updateCategory(selectedCategory.id, categoryData);
      } else {
        await menuService.createCategory(user.restaurant_id, categoryData);
      }
      setShowCategoryModal(false);
      await loadMenu();
    } catch (error) {
      throw error;
    }
  };

  const handleCreateItem = (category) => {
    setSelectedItem(null);
    setSelectedCategoryForItem(category);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setSelectedCategoryForItem(null);
    setShowItemModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await menuService.deleteMenuItem(itemId);
        await loadMenu();
      } catch (error) {
        alert('Ürün silinirken hata oluştu');
        console.error('Delete item error:', error);
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (selectedItem) {
        await menuService.updateMenuItem(selectedItem.id, itemData);
      } else {
        await menuService.createMenuItem(selectedCategoryForItem.id, itemData);
      }
      setShowItemModal(false);
      await loadMenu();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="60vh"
        >
          <Box sx={{ position: 'relative', mb: 4 }}>
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                animationDuration: '550ms'
              }} 
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MenuIcon 
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
              Menü Yükleniyor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lütfen bekleyiniz, kategori ve ürünler hazırlanıyor...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Box 
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderRadius: 3,
            p: 4,
            mb: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Box display="flex" alignItems="center" mb={{ xs: 2, md: 0 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  mr: 3,
                  width: 64,
                  height: 64,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <MenuIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  Menü Yönetimi
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  Kategori ve ürünlerinizi yönetin, menünüzü düzenleyin
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
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateCategory}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  borderRadius: 2,
                  px: 3,
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
                Yeni Kategori
              </Button>
            </Stack>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Categories Section */}
      {categories.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 8,
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mx: 'auto', 
              mb: 3, 
              width: 80, 
              height: 80
            }}
          >
            <CategoryIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="text.primary" mb={2}>
            Henüz Kategori Bulunmuyor
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} maxWidth="400px" mx="auto">
            İlk kategoriyi oluşturarak menünüzü düzenlemeye başlayabilirsiniz
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCategory}
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
            İlk Kategoriyi Oluştur
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {categories.map((category) => (
            <Accordion 
              key={category.id}
              defaultExpanded
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: 0,
                  mb: 3,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderRadius: 3,
                  minHeight: 72,
                  '&.Mui-expanded': {
                    minHeight: 72,
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '16px 0',
                    '&.Mui-expanded': {
                      margin: '16px 0',
                    },
                  },
                }}
              >
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  width="100%"
                  onClick={(e) => e.stopPropagation()}
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
                      <CategoryIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {category.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={category.is_active ? 'Aktif' : 'Pasif'}
                          size="small"
                          color={category.is_active ? 'success' : 'default'}
                          sx={{ fontWeight: 'medium' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {category.menu_items?.length || 0} ürün
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Ürün Ekle" arrow>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateItem(category);
                        }}
                        size="small"
                        sx={{ 
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                          '&:hover': { 
                            bgcolor: 'success.main',
                            color: 'white',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Kategoriyi Düzenle" arrow>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                        size="small"
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          '&:hover': { 
                            bgcolor: 'primary.main',
                            color: 'white',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Kategoriyi Sil" arrow>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        size="small"
                        sx={{ 
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: 'error.main',
                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                          '&:hover': { 
                            bgcolor: 'error.main',
                            color: 'white',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ pt: 0 }}>
                <Divider sx={{ mb: 3 }} />
                
                {category.menu_items?.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        mx: 'auto', 
                        mb: 2, 
                        width: 64, 
                        height: 64
                      }}
                    >
                      <FastfoodIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Bu kategoride henüz ürün bulunmuyor
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      İlk ürününüzü ekleyerek başlayın
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleCreateItem(category)}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: theme.palette.primary.dark,
                        }
                      }}
                    >
                      İlk Ürünü Ekle
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {category.menu_items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                              borderColor: alpha(theme.palette.primary.main, 0.3)
                            }
                          }}
                        >
                          {/* Ürün Resmi */}
                          {item.image_url ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={item.image_url.startsWith('data:') ? item.image_url : `data:image/jpeg;base64,${item.image_url}`}
                              alt={item.name}
                              sx={{
                                objectFit: 'cover',
                                borderTopLeftRadius: 2,
                                borderTopRightRadius: 2
                              }}
                              onError={(e) => {
                                console.log('Resim yüklenirken hata:', item.name, item.image_url?.substring(0, 50));
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          {/* Placeholder for missing or broken images */}
                          {!item.image_url ? (
                            <Box
                              sx={{
                                height: 200,
                                bgcolor: alpha(theme.palette.grey[300], 0.3),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderTopLeftRadius: 2,
                                borderTopRightRadius: 2,
                                flexDirection: 'column'
                              }}
                            >
                              <ImageIcon 
                                sx={{ 
                                  fontSize: 48, 
                                  color: alpha(theme.palette.grey[500], 0.6),
                                  mb: 1
                                }} 
                              />
                              <Typography variant="caption" color="text.secondary">
                                Resim eklenmemiş
                              </Typography>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                height: 200,
                                bgcolor: alpha(theme.palette.grey[300], 0.3),
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderTopLeftRadius: 2,
                                borderTopRightRadius: 2,
                                flexDirection: 'column'
                              }}
                            >
                              <ImageIcon 
                                sx={{ 
                                  fontSize: 48, 
                                  color: alpha(theme.palette.grey[500], 0.6),
                                  mb: 1
                                }} 
                              />
                              <Typography variant="caption" color="text.secondary">
                                Resim yüklenemedi
                              </Typography>
                            </Box>
                          )}
                          
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Typography variant="h6" fontWeight="bold" color="text.primary" noWrap>
                                {item.name}
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ₺{parseFloat(item.price).toFixed(2)}
                              </Typography>
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {item.description || 'Açıklama yok'}
                            </Typography>
                            
                            {item.allergens && (
                              <Typography variant="caption" color="warning.main" sx={{ mb: 2, display: 'block' }}>
                                <strong>Alerjenler:</strong> {item.allergens}
                              </Typography>
                            )}
                            
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Chip 
                                label={item.is_available ? 'Mevcut' : 'Mevcut Değil'}
                                size="small"
                                color={item.is_available ? 'success' : 'error'}
                                sx={{ fontWeight: 'medium' }}
                              />
                              
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Düzenle" arrow>
                                  <IconButton
                                    onClick={() => handleEditItem(item)}
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: 'primary.main',
                                      '&:hover': { 
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                      }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Sil" arrow>
                                  <IconButton
                                    onClick={() => handleDeleteItem(item.id)}
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.error.main, 0.1),
                                      color: 'error.main',
                                      '&:hover': { 
                                        bgcolor: 'error.main',
                                        color: 'white'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal
          category={selectedCategory}
          onSave={handleSaveCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showItemModal && (
        <MenuItemModal
          item={selectedItem}
          category={selectedCategoryForItem}
          onSave={handleSaveItem}
          onClose={() => setShowItemModal(false)}
        />
      )}
    </Container>
  );
};

export default RestaurantMenuManagement;