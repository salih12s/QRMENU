import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant } from '../../types';

interface Props {
  restaurant: Restaurant | null;
  onUpdate: () => void;
}

function RestaurantSettings({ restaurant, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    contact_phone: restaurant?.contact_phone || '',
    contact_email: restaurant?.contact_email || '',
    address: restaurant?.address || '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(restaurant?.logo_url || null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(restaurant?.cover_image_url || null);
  const { enqueueSnackbar } = useSnackbar();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!restaurant) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('contact_phone', formData.contact_phone);
      fd.append('contact_email', formData.contact_email);
      fd.append('address', formData.address);
      if (logoFile) {
        fd.append('logo', logoFile);
      }
      if (coverFile) {
        fd.append('cover_image', coverFile);
      }
      
      await restaurantService.update(restaurant.id, fd);
      enqueueSnackbar('Restoran bilgileri güncellendi', { variant: 'success' });
      onUpdate();
    } catch (error) {
      enqueueSnackbar('Hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Restoran Ayarları
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Logo
              </Typography>
              <Avatar
                src={logoPreview || undefined}
                sx={{ width: 150, height: 150, margin: '0 auto', mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Logo Yükle
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
              {logoFile && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {logoFile.name}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Kapak Fotoğrafı
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Menü sayfasının üst kısmında görüntülenecek
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 150,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'grey.200',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Kapak görüntüsü yok
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Kapak Fotoğrafı Yükle
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </Button>
              {coverFile && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {coverFile.name}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temel Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Restoran Adı"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Açıklama"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              
              <TextField
                fullWidth
                label="Telefon"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="E-posta"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Adres"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
              
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                sx={{ mt: 3 }}
                fullWidth
                size="large"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantSettings;
