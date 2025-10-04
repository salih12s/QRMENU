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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';

interface Props {
  restaurantId: number;
}

function CategoriesManagement({ restaurantId }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCategories();
  }, [restaurantId]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getByRestaurant(restaurantId);
      setCategories(data);
    } catch (error) {
      enqueueSnackbar('Kategoriler yüklenemedi', { variant: 'error' });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode && editId) {
        await categoryService.update(editId, formData);
        enqueueSnackbar('Kategori güncellendi', { variant: 'success' });
      } else {
        await categoryService.create({ ...formData, restaurant_id: restaurantId });
        enqueueSnackbar('Kategori oluşturuldu', { variant: 'success' });
      }
      setOpen(false);
      loadCategories();
      setFormData({ name: '', description: '' });
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      enqueueSnackbar('Hata oluştu', { variant: 'error' });
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditId(category.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await categoryService.delete(id);
        enqueueSnackbar('Kategori silindi', { variant: 'success' });
        loadCategories();
      } catch (error) {
        enqueueSnackbar('Hata oluştu', { variant: 'error' });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kategoriler</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Yeni Kategori
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(category)} sx={{ mr: 1 }}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(category.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={category.name} secondary={category.description} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Kategori Düzenle' : 'Yeni Kategori'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Kategori Adı"
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
          />
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

export default CategoriesManagement;
