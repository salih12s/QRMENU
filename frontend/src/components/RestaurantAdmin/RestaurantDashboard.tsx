import { Box, Card, CardContent, Typography, Grid, Avatar, Button } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';
import { Restaurant } from '../../types';

interface Props {
  restaurant: Restaurant | null;
}

function RestaurantDashboard({ restaurant }: Props) {
  if (!restaurant) return null;

  const menuUrl = `${window.location.origin}/menu/${restaurant.qr_code}`;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'start' }}>
                <Avatar src={restaurant.logo_url || undefined} sx={{ width: 100, height: 100 }} />
                <Box>
                  <Typography variant="h5">{restaurant.name}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{restaurant.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>📞 {restaurant.contact_phone}</Typography>
                  <Typography variant="body2">✉️ {restaurant.contact_email}</Typography>
                  <Typography variant="body2">📍 {restaurant.address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Menü QR Kodu</Typography>
              <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', borderRadius: 2 }}>
                <QRCodeCanvas value={menuUrl} size={200} />
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                {restaurant.qr_code}
              </Typography>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                onClick={() => window.open(menuUrl, '_blank')}
                fullWidth
                sx={{ mt: 2 }}
              >
                Menüyü Görüntüle
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantDashboard;
