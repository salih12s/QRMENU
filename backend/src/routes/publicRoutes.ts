import { Router } from 'express';
import { getMenuByQRCode } from '../controllers/publicController';

const router = Router();

// QR kod ile menü görüntüleme (public)
router.get('/menu/:qrCode', getMenuByQRCode);

export default router;
