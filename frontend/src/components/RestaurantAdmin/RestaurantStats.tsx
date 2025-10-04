import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { Visibility, Category, MenuBook } from '@mui/icons-material';
import { reportService } from '../../services/reportService';
import { RestaurantStats as StatsType } from '../../types';

interface Props {
  restaurantId: number;
}

function RestaurantStats({ restaurantId }: Props) {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [restaurantId]);

  const loadStats = async () => {
    try {
      const data = await reportService.getRestaurantStats(restaurantId);
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>İstatistikler</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Visibility color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">Toplam Erişim</Typography>
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
                <Category color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">Kategoriler</Typography>
                  <Typography variant="h4">{stats?.total_categories || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MenuBook color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">Ürünler</Typography>
                  <Typography variant="h4">{stats?.total_menu_items || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantStats;
