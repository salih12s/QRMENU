import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import { Edit, Delete, Add, QrCode2, OpenInNew } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant } from '../../types';

function RestaurantsManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [qrDialog, setQrDialog] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    theme_color: '#1976d2',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      enqueueSnackbar('Restoranlar yüklenemedi', { variant: 'error' });
    }
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      
      if (editMode && editId) {
        await restaurantService.update(editId, fd);
        enqueueSnackbar('Restoran güncellendi', { variant: 'success' });
      } else {
        await restaurantService.create(fd);
        enqueueSnackbar('Restoran oluşturuldu', { variant: 'success' });
      }
      
      handleClose();
      loadRestaurants();
    } catch (error) {
      enqueueSnackbar('Hata oluştu', { variant: 'error' });
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      contact_phone: restaurant.contact_phone || '',
      contact_email: restaurant.contact_email || '',
      address: restaurant.address || '',
      theme_color: restaurant.theme_color || '#1976d2',
    });
    setEditId(restaurant.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await restaurantService.delete(id);
        enqueueSnackbar('Restoran silindi', { variant: 'success' });
        loadRestaurants();
      } catch (error) {
        enqueueSnackbar('Hata oluştu', { variant: 'error' });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ name: '', description: '', contact_phone: '', contact_email: '', address: '', theme_color: '#1976d2' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Restoranlar</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Yeni Restoran
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Adı</TableCell>
              <TableCell>İletişim</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <Avatar src={restaurant.logo_url || undefined} />
                </TableCell>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{restaurant.contact_phone}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {restaurant.contact_email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: 40, height: 40, bgcolor: restaurant.theme_color, borderRadius: 1 }} />
                </TableCell>
                <TableCell>
                  <Chip label={restaurant.is_active ? 'Aktif' : 'Pasif'} color={restaurant.is_active ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => setQrDialog(restaurant)}>
                    <QrCode2 />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(restaurant)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(restaurant.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Restoran Düzenle' : 'Yeni Restoran'}</DialogTitle>
        <DialogContent>
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
          />
          <TextField
            fullWidth
            label="Tema Rengi"
            type="color"
            value={formData.theme_color}
            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!qrDialog} onClose={() => setQrDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>QR Kod - {qrDialog?.name}</DialogTitle>
        <DialogContent>
          {qrDialog?.qr_code_image && (
            <Box sx={{ textAlign: 'center' }}>
              <img src={qrDialog.qr_code_image} alt="QR Code" style={{ maxWidth: '100%' }} />
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                QR Kod: {qrDialog.qr_code}
              </Typography>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                onClick={() => window.open(`${window.location.origin}/menu/${qrDialog.qr_code}`, '_blank')}
                fullWidth
                sx={{ mt: 3 }}
              >
                Menüyü Görüntüle
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog(null)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RestaurantsManagement;
