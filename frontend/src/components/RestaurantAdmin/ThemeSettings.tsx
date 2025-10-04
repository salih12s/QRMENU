import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant } from '../../types';

interface Props {
  restaurant: Restaurant | null;
  onUpdate: () => void;
}

function ThemeSettings({ restaurant, onUpdate }: Props) {
  const [themeColor, setThemeColor] = useState(restaurant?.theme_color || '#1976d2');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    if (!restaurant) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('theme_color', themeColor);
      await restaurantService.update(restaurant.id, fd);
      enqueueSnackbar('Tema güncellendi', { variant: 'success' });
      onUpdate();
    } catch (error) {
      enqueueSnackbar('Hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tema Ayarları</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Tema Rengi</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <TextField
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              sx={{ width: 100 }}
            />
            <Box sx={{ width: 100, height: 50, bgcolor: themeColor, borderRadius: 1, border: '1px solid #ccc' }} />
            <Typography>{themeColor}</Typography>
          </Box>
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ThemeSettings;
