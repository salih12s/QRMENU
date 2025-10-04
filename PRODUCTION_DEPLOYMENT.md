# 🚀 Railway Production Environment Variables

Railway Dashboard → QRMENU Service → Variables sekmesinde bu değerleri ekleyin:

## Required Variables

```env
# Database (Otomatik PostgreSQL bağlantısından gelir, kontrol edin)
DATABASE_URL=postgresql://postgres:rmqlueVKPBRSJwNxZezqsvrnCZvMjKth@postgres-mmmt.railway.internal:5432/railway

# Alternatif olarak ayrı ayrı:
DB_HOST=ballast.proxy.rlwy.net
DB_PORT=17619
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=rmqlueVKPBRSJwNxZezqsvrnCZvMjKth

# JWT Secret (ÖNEMLİ: Production'da güçlü olmalı)
JWT_SECRET=Pp65KS6wRyD0dEFfaro4gz7NbT-IdZACZeqDU3GRDlfjyD42y3tAndG2M6qLLaTB

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (CORS için gerekli)
FRONTEND_URL=https://menuben.com
ALLOWED_ORIGIN=https://menuben.com
```

## 🔧 Deployment Steps

### 1. Railway Backend Setup

✅ **GitHub'dan Deploy Et:**
- Repository: `salih12s/QRMENU`
- Branch: `main`
- Root Directory: Boş bırak (nixpacks.toml otomatik kullanılacak)

✅ **Environment Variables:**
Yukarıdaki tüm variables'ları ekleyin

✅ **Database Initialization:**
Deploy edildikten sonra tek seferlik çalıştırın:
```bash
npm run db:init
```

Railway CLI ile:
```bash
railway run npm run db:init
```

Ya da Railway Dashboard → Deployments → ⋮ → Run Command:
```
cd backend && npm run db:init
```

### 2. Vercel/Netlify Frontend Setup

**Vercel (Önerilen):**

1. https://vercel.com → New Project
2. Import `salih12s/QRMENU`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Environment Variables:
   ```
   VITE_API_URL=https://qrmenu-production-857b.up.railway.app/api
   ```

5. Deploy!

6. Custom Domain:
   - Settings → Domains → Add Domain
   - Domain: `menuben.com`
   - DNS ayarlarını yapın (Vercel size gösterecek)

**Netlify (Alternatif):**

1. https://app.netlify.com → New site from Git
2. GitHub repo seçin: `QRMENU`
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. Environment Variables:
   ```
   VITE_API_URL=https://qrmenu-production-857b.up.railway.app/api
   ```

5. Deploy!

6. Custom Domain:
   - Domain settings → Add custom domain → `menuben.com`

### 3. DNS Configuration (menuben.com)

Domain sağlayıcınızda (GoDaddy, Namecheap, vb.) DNS ayarları:

**Vercel için:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Netlify için:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: [your-site].netlify.app
```

### 4. SSL Certificate

- Vercel: Otomatik SSL (Let's Encrypt)
- Netlify: Otomatik SSL (Let's Encrypt)
- Railway: Otomatik SSL (backend için)

### 5. Test Checklist

Backend Test:
```bash
curl https://qrmenu-production-857b.up.railway.app/api/health
```

Frontend Test:
```bash
# Browser'da açın
https://menuben.com
```

Login Test:
- Email: admin@system.com
- Password: admin123

## 🔐 Security Checklist

- [ ] `.env` dosyaları GitHub'a push edilmedi (.gitignore'da)
- [ ] JWT_SECRET production'da güçlü
- [ ] Database password güçlü
- [ ] Super admin şifresi değiştirildi (admin123 → güçlü şifre)
- [ ] CORS sadece menuben.com'a izin veriyor
- [ ] SSL/HTTPS aktif
- [ ] Environment variables Railway/Vercel'de güvenli

## 📊 Monitoring

**Railway:**
- Metrics: CPU, Memory, Network
- Logs: Real-time application logs
- Deployments: Auto-deploy on git push

**Vercel:**
- Analytics: Visitor statistics
- Speed Insights: Performance monitoring
- Deployment logs

## 🔄 CI/CD Pipeline

**Otomatik Deployment:**
1. Code push to `main` branch
2. Railway auto-deploys backend
3. Vercel auto-deploys frontend
4. ✅ Live in ~2-3 minutes

## 📝 Post-Deployment

1. **Database seed:**
   ```bash
   railway run npm run db:init
   ```

2. **Login as super admin:**
   - URL: https://menuben.com
   - Email: admin@system.com
   - Password: admin123

3. **Create first restaurant:**
   - Add restaurant details
   - Upload logo and cover image
   - Get QR code

4. **Create restaurant admin:**
   - Add user with restaurant_admin role
   - Assign to restaurant

5. **Build menu:**
   - Create categories
   - Add menu items with photos
   - Set prices

6. **Test QR code:**
   - Open QR code URL
   - Verify public menu displays correctly
   - Test on mobile device

## 🎯 Production URLs

- **Frontend**: https://menuben.com
- **Backend API**: https://qrmenu-production-857b.up.railway.app/api
- **Database**: Railway PostgreSQL (internal)
- **Public Menu Example**: https://menuben.com/menu/[QR_CODE]

## ⚡ Performance Tips

1. **Image Optimization:**
   - Logo: 512x512px, PNG/JPG
   - Cover: 1200x400px, JPG (optimize for web)
   - Menu items: 800x600px, JPG (compress)

2. **Caching:**
   - Vercel CDN: Automatic
   - API responses: Consider Redis cache (future)

3. **Database:**
   - Indexes already configured
   - Connection pooling active

## 🆘 Troubleshooting

**Backend won't start:**
```bash
# Check logs
railway logs

# Restart service
railway up
```

**Frontend build fails:**
```bash
# Local test
cd frontend
npm run build
npm run preview
```

**CORS errors:**
- Check ALLOWED_ORIGIN in Railway variables
- Verify FRONTEND_URL is correct

**Database connection fails:**
- Check DATABASE_URL in Railway
- Verify PostgreSQL service is running

## 📞 Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/salih12s/QRMENU/issues
