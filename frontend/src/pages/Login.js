import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
    },
    secondary: {
      main: '#ff6f00',
      dark: '#e65100',
      light: '#ff8f00',
    },
    background: {
      default: '#f1f8e9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2e7d32',
    },
    h6: {
      fontWeight: 500,
      color: '#424242',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', formData);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      await login(formData.username, formData.password);
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                color: 'white',
                textAlign: 'center',
                py: 4,
                px: 3,
              }}
            >
              <QrCodeIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                QR Menu
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Yönetim Sistemi
              </Typography>
            </Box>

            {/* Login Form */}
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Kullanıcı Adı"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  margin="normal"
                  autoComplete="username"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  margin="normal"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>

                {/* Demo Accounts Info */}
                <Card
                  variant="outlined"
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    borderColor: '#e9ecef',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Demo Hesaplar:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Super Admin:</strong> superadmin / 12345
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Restaurant Admin:</strong> saydam / 12345
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 QR Menu - Restoran Menü Yönetim Sistemi
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;