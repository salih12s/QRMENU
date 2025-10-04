import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { MenuItem as MenuItemType, Category } from '../../types';

interface Props {
  restaurantId: number;
}

function MenuManagement({ restaurantId }: Props) {
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    allergen_info: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadMenu();
    loadCategories();
  }, [restaurantId]);

  const loadMenu = async () => {
    try {
      const data = await menuService.getByRestaurant(restaurantId);
      setItems(data);
    } catch (error) {
      enqueueSnackbar('Menü yüklenemedi', { variant: 'error' });
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getByRestaurant(restaurantId);
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append('restaurant_id', restaurantId.toString());
      fd.append('category_id', formData.category_id);
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', formData.price);
      fd.append('allergen_info', formData.allergen_info);
      if (imageFile) fd.append('image', imageFile);

      if (editMode && editId) {
        await menuService.update(editId, fd);
        enqueueSnackbar('Ürün güncellendi', { variant: 'success' });
      } else {
        await menuService.create(fd);
        enqueueSnackbar('Ürün oluşturuldu', { variant: 'success' });
      }
      
      handleClose();
      loadMenu();
    } catch (error) {
      enqueueSnackbar('Hata oluştu', { variant: 'error' });
    }
  };

  const handleEdit = (item: MenuItemType) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      allergen_info: item.allergen_info || '',
    });
    setEditId(item.id);
    setEditMode(true);
    if (item.image_url) {
      setImagePreview(item.image_url);
    }
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await menuService.delete(id);
        enqueueSnackbar('Ürün silindi', { variant: 'success' });
        loadMenu();
      } catch (error) {
        enqueueSnackbar('Hata oluştu', { variant: 'error' });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ name: '', description: '', price: '', category_id: '', allergen_info: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Menü Yönetimi</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Yeni Ürün
        </Button>
      </Box>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.image_url && (
                <CardMedia component="img" height="200" image={item.image_url} alt={item.name} />
              )}
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>₺{Number(item.price).toFixed(2)}</Typography>
                {item.allergen_info && (
                  <Typography variant="caption" color="warning.main">⚠️ {item.allergen_info}</Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Ürün Düzenle' : 'Yeni Ürün'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Kategori"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Ürün Adı"
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
            rows={2}
          />
          <TextField
            fullWidth
            label="Fiyat (₺)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Alerjen Bilgisi"
            value={formData.allergen_info}
            onChange={(e) => setFormData({ ...formData, allergen_info: e.target.value })}
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label">
              Fotoğraf Yükle
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MenuManagement;
