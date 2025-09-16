import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  TrendingUp,
  Visibility,
  Assessment,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { authService } from '../../services/authService';
import { restaurantService } from '../../services/restaurantService';

const RestaurantInfo = () => {
  const theme = useTheme();
  const user = authService.getCurrentUser();
  const restaurantId = user?.restaurant_id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });
  
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      const menuUrl = `${window.location.origin}/menu/${restaurant.qr_code}`;
      await navigator.clipboard.writeText(menuUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const loadRestaurantInfo = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await restaurantService.getRestaurant(restaurantId);
      setRestaurant(response.restaurant);
      console.log('Restaurant data:', response.restaurant);
      console.log('QR Code URL:', response.restaurant.qr_code);
      console.log('QR Code type:', typeof response.restaurant.qr_code);
      
      // QR kod verisi varsa, gerçek QR kod resmini al
      if (response.restaurant.qr_code) {
        try {
          const qrResponse = await restaurantService.generateQRCode(restaurantId);
          setQrCodeDataUrl(qrResponse.qrCode);
          console.log('QR kod başarıyla yüklendi');
        } catch (qrError) {
          console.error('QR kod yüklenemedi:', qrError);
          setQrCodeDataUrl(null);
        }
      }
      
      setFormData({
        name: response.restaurant.name || '',
        description: response.restaurant.description || '',
        address: response.restaurant.address || '',
        phone: response.restaurant.phone || '',
        email: response.restaurant.email || ''
      });
    } catch (error) {
      setError('Restoran bilgileri yüklenirken hata oluştu');
      console.error('Load restaurant info error:', error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadRestaurantInfo();
  }, [loadRestaurantInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await restaurantService.updateRestaurant(restaurantId, formData);
      setSuccess('Restoran bilgileri başarıyla güncellendi');
      await loadRestaurantInfo();
    } catch (error) {
      setError('Güncelleme sırasında hata oluştu');
      console.error('Update restaurant error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadQR = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `${restaurant.name}-qr-kod.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          borderRadius: 2
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              animation: 'pulse 2s infinite'
            }}
          >
            Restoran bilgileri yükleniyor...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Card 
        sx={{ 
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[8]
        }}
      >
        <CardHeader
          avatar={
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette.common.white, 0.2),
                width: 64,
                height: 64
              }}
            >
              <RestaurantIcon sx={{ fontSize: 32 }} />
            </Avatar>
          }
          title={
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Restoran Bilgileri
            </Typography>
          }
          subheader={
            <Typography variant="h6" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
              Restoranınızın bilgilerini yönetin
            </Typography>
          }
        />
      </Card>

      <Grid container spacing={3}>
        {/* Restaurant Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ boxShadow: theme.shadows[4] }}>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Restoran Detayları
                </Typography>
              }
              subheader="Restoran bilgilerinizi güncelleyin"
            />
            <Divider />
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Restoran Adı"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <RestaurantIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Açıklama"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <DescriptionIcon sx={{ color: theme.palette.primary.main, mr: 1, mt: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <LocationIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code & Stats Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* QR Code Section */}
            <Card sx={{ boxShadow: theme.shadows[4] }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    QR Kod Menüsü
                  </Typography>
                }
                subheader="Menünüze erişim QR kodu"
              />
              <Divider />
              <CardContent sx={{ textAlign: 'center' }}>
                {restaurant && qrCodeDataUrl ? (
                  <Box>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        display: 'inline-block',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                      }}
                    >
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Kod" 
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                    </Paper>
                    
                    {/* QR Kod URL'si */}
                    <Box sx={{ mb: 2, px: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'medium' }}>
                        Menü Linki:
                      </Typography>
                      <Paper 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: alpha(theme.palette.grey[100], 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          borderRadius: 1,
                          position: 'relative'
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            color: theme.palette.primary.main,
                            fontWeight: 'medium',
                            pr: 5
                          }}
                        >
                          {`${window.location.origin}/menu/${restaurant.qr_code}`}
                        </Typography>
                        <Tooltip title={copySuccess ? "Kopyalandı!" : "Linki Kopyala"} arrow>
                          <IconButton
                            onClick={copyToClipboard}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              color: copySuccess ? theme.palette.success.main : theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Bu linki paylaşarak müşterileriniz menünüze erişebilir
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="QR Kodu İndir">
                        <IconButton 
                          onClick={downloadQR}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="QR Kodu Yenile">
                        <IconButton 
                          onClick={loadRestaurantInfo}
                          sx={{ 
                            color: theme.palette.secondary.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{ py: 4 }}>
                    <QrCodeIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                      QR kod henüz oluşturulmamış
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
                      Restoran bilgilerinizi kaydedin, QR kod otomatik oluşacaktır
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Restaurant Stats */}
            <Card sx={{ boxShadow: theme.shadows[4] }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    İstatistikler
                  </Typography>
                }
                subheader="Restoran performansı"
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.2)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, width: 40, height: 40 }}>
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          24
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Günlük Görüntülenme
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.2)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
                        <Visibility />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          156
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Toplam Görüntülenme
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.2)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 40, height: 40 }}>
                        <Assessment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          4.2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ortalama Değerlendirme
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantInfo;