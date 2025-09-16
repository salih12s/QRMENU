import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Grid,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

const MenuItemModal = ({ item, category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    allergens: '',
    sort_order: 0,
    is_available: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        allergens: item.allergens || '',
        sort_order: item.sort_order || 0,
        is_available: item.is_available !== false
      });
      // Mevcut resim varsa önizleme olarak göster (base64 formatında)
      if (item.image_url || item.image) {
        const imageData = item.image_url || item.image;
        setImagePreview(imageData);
        setImageData(imageData);
      }
    } else {
      // Yeni item için temizle
      setFormData({
        name: '',
        description: '',
        price: '',
        allergens: '',
        sort_order: 0,
        is_available: true
      });
      setImagePreview(null);
      setImageData(null);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Sadece resim dosyaları yüklenebilir');
        return;
      }
      
      // Base64'e çevir ve önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // Base64 image data varsa ekle
      if (imageData) {
        dataToSave.image_data = imageData;
      }
      
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Kayıt sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {item ? 'Ürün Düzenle' : `Yeni Ürün${category ? ` - ${category.name}` : ''}`}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Ürün Bilgileri */}
            <Grid item xs={12} md={imagePreview ? 8 : 12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Ürün Bilgileri
                </Typography>
                
                <TextField
                  fullWidth
                  name="name"
                  label="Ürün Adı"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RestaurantIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  name="price"
                  label="Fiyat (₺)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  margin="normal"
                  inputProps={{ min: "0", step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  name="description"
                  label="Açıklama"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  name="allergens"
                  label="Alerjenler"
                  value={formData.allergens}
                  onChange={handleChange}
                  disabled={loading}
                  margin="normal"
                  helperText="Alerjen bilgilerini virgülle ayırın"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Ayarlar */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Ayarlar
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="sort_order"
                      label="Sıralama"
                      type="number"
                      value={formData.sort_order}
                      onChange={handleChange}
                      disabled={loading}
                      inputProps={{ min: "0" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SortIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      helperText="Düşük sayı önce görünür"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_available}
                          onChange={handleChange}
                          name="is_available"
                          disabled={loading}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Mevcut</Typography>
                          <Chip 
                            label={formData.is_available ? 'Aktif' : 'Pasif'} 
                            color={formData.is_available ? 'success' : 'error'}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Resim Yükleme */}
            <Grid item xs={12} md={imagePreview ? 4 : 12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Ürün Fotoğrafı
                </Typography>
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      mb: 2,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                    }}
                  >
                    Fotoğraf Seç
                  </Button>
                </label>

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Maksimum 5MB, JPG, PNG, GIF formatları desteklenir
                </Typography>

                {imagePreview && (
                  <Card sx={{ position: 'relative', borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imagePreview}
                      alt="Ürün önizleme"
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={removeImage}
                      disabled={loading}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Card>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Kaydet'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MenuItemModal;