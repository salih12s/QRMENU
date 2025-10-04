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
  Typography,
  Chip,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { authService } from '../../services/authService';
import { restaurantService } from '../../services/restaurantService';
import { User, Restaurant } from '../../types';

function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'restaurant_admin',
    restaurant_id: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadUsers();
    loadRestaurants();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        ...formData,
        restaurant_id: formData.restaurant_id ? parseInt(formData.restaurant_id) : undefined,
      };
      await authService.createUser(userData);
      enqueueSnackbar('Kullanıcı oluşturuldu', { variant: 'success' });
      setOpen(false);
      loadUsers();
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'restaurant_admin',
        restaurant_id: '',
      });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Hata oluştu', { variant: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      return;
    }
    try {
      await authService.deleteUser(id);
      enqueueSnackbar('Kullanıcı silindi', { variant: 'success' });
      loadUsers();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Hata oluştu', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Yeni Kullanıcı
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Restoran</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Henüz kullanıcı bulunmuyor
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === 'super_admin' ? 'Süper Admin' : 'Restoran Admin'}
                    color={user.role === 'super_admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.restaurant_id ? `Restoran #${user.restaurant_id}` : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Aktif' : 'Pasif'}
                    color={user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" size="small" onClick={() => handleDelete(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ad Soyad"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Rol"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
          >
            <MenuItem value="super_admin">Süper Admin</MenuItem>
            <MenuItem value="restaurant_admin">Restoran Admin</MenuItem>
          </TextField>
          {formData.role === 'restaurant_admin' && (
            <TextField
              select
              fullWidth
              label="Restoran"
              value={formData.restaurant_id}
              onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
              margin="normal"
              required
            >
              {restaurants.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsersManagement;
