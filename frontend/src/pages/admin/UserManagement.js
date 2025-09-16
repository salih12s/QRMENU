import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../../services/authService';
import { restaurantService } from '../../services/restaurantService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Restaurant as RestaurantIcon,
  SupervisorAccount as SuperAdminIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'restaurant_admin',
    restaurant_id: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Şimdilik sadece restoranları yükleyelim, kullanıcı API'si henüz hazır değil
      const restaurantsResponse = await restaurantService.getAllRestaurants();
      setRestaurants(restaurantsResponse.restaurants || []);
      // Geçici kullanıcı verisi
      setUsers([
        {
          id: 1,
          username: 'superadmin',
          email: 'superadmin@example.com',
          role: 'super_admin',
          restaurant_id: null,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          username: 'saydam',
          email: 'saydam@example.com',
          role: 'restaurant_admin',
          restaurant_id: 1,
          created_at: '2024-01-02'
        }
      ]);
    } catch (error) {
      console.error('Load data error:', error);
      setError('Veriler yüklenirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await authService.register(formData);
      setSuccess('Kullanıcı başarıyla oluşturuldu');
      setShowCreateDialog(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'restaurant_admin',
        restaurant_id: ''
      });
      loadData(); // Listeyi yenile
    } catch (error) {
      setError('Kullanıcı oluşturulurken hata: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin': return 'Süper Admin';
      case 'restaurant_admin': return 'Restoran Admin';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'restaurant_admin': return 'primary';
      default: return 'default';
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Atanmamış';
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" color="text.secondary">
          Kullanıcılar yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <GroupIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Kullanıcı Yönetimi
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Sistem kullanıcılarını yönetin ve admin yetkileri atayın
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Listeyi Yenile">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                color="primary"
              >
                <RefreshIcon sx={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              }}
            >
              Yeni Kullanıcı
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
                {users.length}
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                Toplam Kullanıcı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <SuperAdminIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="error.main" mb={1}>
                {users.filter(u => u.role === 'super_admin').length}
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                Süper Admin
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <AdminIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="secondary.main" mb={1}>
                {users.filter(u => u.role === 'restaurant_admin').length}
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                Restoran Admin
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Kullanıcı Listesi
            </Typography>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kullanıcı</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Atanan Restoran</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Oluşturma Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.50' },
                      '&:nth-of-type(even)': { bgcolor: 'grey.25' }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            bgcolor: user.role === 'super_admin' ? 'error.main' : 'primary.main',
                            width: 40,
                            height: 40
                          }}
                        >
                          {user.role === 'super_admin' ? <SuperAdminIcon /> : <AdminIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email || 'Email belirtilmemiş'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleDisplayName(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        icon={user.role === 'super_admin' ? <SuperAdminIcon /> : <AdminIcon />}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.role === 'restaurant_admin' ? (
                        <Box display="flex" alignItems="center">
                          <RestaurantIcon sx={{ mr: 1, fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body2" fontWeight="medium">
                            {getRestaurantName(user.restaurant_id)}
                          </Typography>
                        </Box>
                      ) : (
                        <Chip 
                          label="Tüm Sistem" 
                          size="small" 
                          variant="outlined"
                          color="warning"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Düzenle">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Henüz kullanıcı bulunamadı
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <PersonAddIcon sx={{ mr: 2, color: 'primary.main' }} />
            Yeni Kullanıcı Oluştur
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kullanıcı Adı"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Şifre"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Rol"
                  >
                    <MenuItem value="restaurant_admin">Restoran Admin</MenuItem>
                    <MenuItem value="super_admin">Süper Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.role === 'restaurant_admin' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Restoran</InputLabel>
                    <Select
                      name="restaurant_id"
                      value={formData.restaurant_id}
                      onChange={handleChange}
                      label="Restoran"
                    >
                      <MenuItem value="">Restoran Seçin</MenuItem>
                      {restaurants.map(restaurant => (
                        <MenuItem key={restaurant.id} value={restaurant.id}>
                          <Box display="flex" alignItems="center">
                            <RestaurantIcon sx={{ mr: 1, fontSize: 20 }} />
                            {restaurant.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowCreateDialog(false)}>
              İptal
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={<PersonAddIcon />}
            >
              Oluştur
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UserManagement;