import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Restaurant,
  Visibility,
  TrendingUp,
} from '@mui/icons-material';
import { reportService } from '../../services/reportService';
import { AllRestaurantsStats as StatsType } from '../../types';

function AllRestaurantsStats() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await reportService.getAllRestaurantsStats();
      setStats(data);
    } catch (error) {
      console.error('Stats loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Genel İstatistikler
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Restaurant color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Toplam Restoran
                  </Typography>
                  <Typography variant="h4">{stats?.total_restaurants || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Visibility color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Toplam Erişim
                  </Typography>
                  <Typography variant="h4">{stats?.total_access || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Son 30 Gün
                  </Typography>
                  <Typography variant="h4">{stats?.last_30_days_access || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Restoran Bazlı Erişimler
          </Typography>
          {stats?.restaurant_access.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography>{item.name}</Typography>
              <Typography color="primary" fontWeight="bold">
                {item.access_count} erişim
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AllRestaurantsStats;
