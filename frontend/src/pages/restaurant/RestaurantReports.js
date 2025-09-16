import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../services/reportsService';
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
  TextField,
  Button,
  CircularProgress,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  DateRange as DateRangeIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const RestaurantReports = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getRestaurantReports(
        user.restaurant_id,
        dateRange.startDate,
        dateRange.endDate
      );
      setReports(data);
    } catch (error) {
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.restaurant_id, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    if (user?.restaurant_id) {
      loadReports();
    }
  }, [user, loadReports]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Raporlar yükleniyor...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            Raporlar ve Analitik
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Restoranınızın performansını takip edin ve analiz edin
        </Typography>
      </Box>

      {/* Date Filter */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="end">
          <DateRangeIcon sx={{ color: 'primary.main', fontSize: 30 }} />
          <TextField
            label="Başlangıç Tarihi"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Bitiş Tarihi"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={loadReports}
            startIcon={<TimelineIcon />}
            sx={{ 
              minWidth: 120,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Filtrele
          </Button>
        </Stack>
      </Card>

      {reports && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <VisibilityIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {reports.stats.total_views}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Toplam Görüntülenme
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TrendingUpIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {reports.stats.active_days}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Aktif Günler
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RestaurantIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {reports.stats.total_menu_items}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Menü Öğeleri
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CategoryIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {reports.stats.total_categories}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Kategoriler
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Reports Grid */}
          <Grid container spacing={4}>
            {/* Popular Items */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: 'fit-content' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                      <Typography variant="h5" fontWeight="bold">
                        Popüler Ürünler
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      En çok görüntülenen menü öğeleri
                    </Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Ürün</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Görüntülenmeler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports.popularItems.slice(0, 10).map((item, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.category_name} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                ₺{parseFloat(item.price).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.views} 
                                size="small" 
                                color="secondary"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Performance */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: 'fit-content' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CategoryIcon sx={{ color: 'info.main', fontSize: 28 }} />
                      <Typography variant="h5" fontWeight="bold">
                        Kategori Performansı
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Kategorilerin görüntülenme analizi
                    </Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Ürün Sayısı</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Toplam Görüntülenme</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Ortalama</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports.categoryPerformance.map((category, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.info.main, 0.02) },
                              '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.08) }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {category.category_name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={category.item_count} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold" color="info.main">
                                {category.total_views}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={parseFloat(category.avg_views_per_item).toFixed(1)} 
                                size="small" 
                                color="secondary"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default RestaurantReports;