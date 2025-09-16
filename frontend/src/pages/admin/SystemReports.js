import React, { useState, useEffect, useCallback } from 'react';
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
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Paper,
  Divider,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Restaurant as RestaurantIcon,
  MenuBook as MenuBookIcon,
  Category as CategoryIcon,
  Visibility as ViewsIcon,
  Star as StarIcon,
  DateRange as DateIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';

const SystemReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getSuperAdminReports(
        dateRange.startDate, 
        dateRange.endDate
      );
      setReports(data);
    } catch (error) {
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Simple Stat Card
  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ color, mb: 2 }}>
          {icon}
        </Box>
        
        <Typography variant="h4" component="div" fontWeight="bold" color={color} mb={1}>
          {value?.toLocaleString() || '0'}
        </Typography>
        
        <Typography variant="h6" color="text.primary" fontWeight="medium" mb={1}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Simple Report Table
  const ReportTable = ({ title, data, columns, icon }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Box sx={{ color: 'primary.main', mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {columns.map((column) => (
                  <TableCell 
                    key={column.key}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.slice(0, 10).map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:hover': { bgcolor: 'grey.50' },
                    '&:nth-of-type(even)': { bgcolor: 'grey.25' }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

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
          Raporlar yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <ReportIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Sistem Raporları
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sistem performansı ve kullanım istatistikleri
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Date Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <DateIcon sx={{ color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" fontWeight="bold">
              Tarih Filtresi
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Başlangıç Tarihi"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Bitiş Tarihi"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={loadReports}
                  fullWidth={isMobile}
                >
                  Filtrele
                </Button>
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
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {reports ? (
        <>
          {/* Stats Grid */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Toplam Restoran"
                value={reports.systemStats.total_restaurants}
                subtitle={`Aktif: ${reports.systemStats.active_restaurants}`}
                icon={<RestaurantIcon fontSize="large" />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Menü Öğeleri"
                value={reports.systemStats.total_menu_items}
                subtitle="Toplam ürün sayısı"
                icon={<MenuBookIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Kategoriler"
                value={reports.systemStats.total_categories}
                subtitle="Ürün kategorileri"
                icon={<CategoryIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Toplam Görüntülenme"
                value={reports.systemStats.total_views}
                subtitle="Menü ziyaretleri"
                icon={<ViewsIcon fontSize="large" />}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Reports Tables */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ReportTable
                title="Restoran Performansı"
                data={reports.restaurantPerformance}
                icon={<TrendingUpIcon fontSize="large" />}
                columns={[
                  { 
                    key: 'name', 
                    label: 'Restoran Adı',
                    render: (value, row, index) => (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          #{index + 1} {value}
                        </Typography>
                      </Box>
                    )
                  },
                  { 
                    key: 'is_active', 
                    label: 'Durum',
                    render: (value) => (
                      <Chip
                        label={value ? 'Aktif' : 'Pasif'}
                        color={value ? 'success' : 'error'}
                        size="small"
                      />
                    )
                  },
                  { 
                    key: 'menu_items_count', 
                    label: 'Menü Öğeleri',
                    render: (value) => (
                      <Typography variant="body2" fontWeight="bold">
                        {value}
                      </Typography>
                    )
                  },
                  { 
                    key: 'total_views', 
                    label: 'Görüntülenmeler',
                    render: (value) => (
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {value?.toLocaleString() || '0'}
                      </Typography>
                    )
                  }
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReportTable
                title="Popüler Menü Öğeleri"
                data={reports.topMenuItems}
                icon={<StarIcon fontSize="large" />}
                columns={[
                  { 
                    key: 'name', 
                    label: 'Ürün Adı',
                    render: (value, row, index) => (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          #{index + 1} {value}
                        </Typography>
                      </Box>
                    )
                  },
                  { key: 'restaurant_name', label: 'Restoran' },
                  { 
                    key: 'category_name', 
                    label: 'Kategori',
                    render: (value) => (
                      <Chip
                        label={value}
                        variant="outlined"
                        size="small"
                      />
                    )
                  },
                  { 
                    key: 'views', 
                    label: 'Görüntülenmeler',
                    render: (value) => (
                      <Typography variant="body2" color="warning.main" fontWeight="bold">
                        {value?.toLocaleString() || '0'}
                      </Typography>
                    )
                  }
                ]}
              />
            </Grid>
          </Grid>

          {/* Summary Stats */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Özet İstatistikler
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box p={2} bgcolor="primary.light" borderRadius={1}>
                    <Typography variant="body2" color="primary.contrastText" mb={1}>
                      Aktif Restoran Oranı
                    </Typography>
                    <Typography variant="h5" color="primary.contrastText" fontWeight="bold">
                      {Math.round((reports.systemStats.active_restaurants / reports.systemStats.total_restaurants) * 100)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box p={2} bgcolor="secondary.light" borderRadius={1}>
                    <Typography variant="body2" color="secondary.contrastText" mb={1}>
                      Ortalama Menü Büyüklüğü
                    </Typography>
                    <Typography variant="h5" color="secondary.contrastText" fontWeight="bold">
                      {Math.round(reports.systemStats.total_menu_items / reports.systemStats.total_restaurants)} öğe
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body1">
            Rapor verisi bulunamadı. Lütfen tarih aralığını kontrol edin ve tekrar deneyin.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default SystemReports;