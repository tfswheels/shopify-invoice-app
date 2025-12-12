# Quick Start - Invoice Generator Setup

## ✅ Completed Setup

1. ✅ Project folder structure created
2. ✅ Git repository initialized
3. ✅ Backend dependencies configured
4. ✅ Frontend dependencies configured
5. ✅ Database schema created (10 tables)
6. ✅ Shopify app configuration ready
7. ✅ Environment examples created
8. ✅ Migration scripts ready

## 🎯 Next Steps (In Order)

### 1. Create GitHub Repository (5 minutes)

```bash
# Go to: https://github.com/new
# - Repository name: shopify-invoice-app
# - Description: Professional invoice generation for Shopify
# - Visibility: Public or Private
# - DO NOT initialize with README

# Then run:
cd /Users/jeremiah/Desktop/shopify-invoice-app
git remote add origin https://github.com/YOUR_USERNAME/shopify-invoice-app.git
git push -u origin main
```

### 2. Set Up Railway (Backend + Database) (10 minutes)

1. **Go to**: https://railway.app
2. **Create account** with GitHub
3. **New Project** → Deploy from GitHub → Select `shopify-invoice-app`
4. **Add MySQL**:
   - Click "+ New" → Database → MySQL
5. **Configure Backend Service**:
   - Root Directory: `server`
   - Start Command: `npm start`
6. **Add Environment Variables** (see SETUP_GUIDE.md section 2)
7. **Generate Public Domain** in Networking settings
8. **Copy Backend URL** (e.g., `https://your-app.railway.app`)

### 3. Create Shopify Partner App (15 minutes)

1. **Go to**: https://partners.shopify.com
2. **Create development store** (Stores → Add store)
3. **Create app** (Apps → Create app → Manual)
4. **Configure**:
   - App URL: `https://your-backend.railway.app` (from Railway)
   - Redirect URLs:
     ```
     https://your-backend.railway.app/auth/callback
     https://your-backend.railway.app/auth/shopify/callback
     ```
   - Scopes: `read_products`, `read_orders`, `write_draft_orders`, `read_customers`, `write_orders`
5. **Copy API credentials** (API key & API secret)
6. **Update Railway variables**:
   ```env
   SHOPIFY_API_KEY=your_key
   SHOPIFY_API_SECRET=your_secret
   ```

### 4. Deploy Frontend on Vercel (5 minutes)

1. **Go to**: https://vercel.com
2. **Import project** from GitHub
3. **Configure**:
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variables**:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_SHOPIFY_API_KEY=your_shopify_api_key
   ```
5. **Deploy** and copy Vercel URL
6. **Update Shopify app URL** to Vercel URL

### 5. Set Up SendGrid (10 minutes)

1. **Go to**: https://signup.sendgrid.com
2. **Create free account** (100 emails/day)
3. **Create API key** (Settings → API Keys)
4. **Verify sender** (Settings → Sender Authentication)
5. **Update Railway**:
   ```env
   SENDGRID_API_KEY=your_key
   FROM_EMAIL=your_verified@email.com
   ```

### 6. Run Database Migrations (2 minutes)

```bash
# Option 1: Via Railway CLI
railway login
railway link
railway run npm run migrate

# Option 2: Via Railway Dashboard
# Go to backend service → Deployments → View Logs
# Migrations run automatically on first deploy
```

### 7. Install App on Development Store (2 minutes)

1. **In Partner Dashboard**: Your App → Test on development store
2. **Select** your development store
3. **Install app** and approve permissions
4. **Open app** from store admin

## 🎉 You're Done!

Your app should now be:
- ✅ Running on Railway (backend)
- ✅ Running on Vercel (frontend)
- ✅ Connected to Shopify
- ✅ Ready to generate invoices

## 🔍 Verify Everything Works

1. **Backend health check**: `https://your-backend.railway.app/health`
2. **Frontend**: `https://your-app.vercel.app`
3. **Shopify app**: Open from development store admin
4. **Database**: Check Railway MySQL service is running

## 📖 Detailed Instructions

For detailed step-by-step instructions with screenshots and troubleshooting, see:
- **SETUP_GUIDE.md** - Complete setup guide
- **README.md** - Project overview and features

## 🆘 Quick Troubleshooting

**Backend won't deploy?**
- Check Railway logs for errors
- Verify environment variables are set
- Ensure MySQL service is running

**Frontend won't build?**
- Check Vercel build logs
- Verify root directory is `admin`
- Ensure environment variables are set

**Can't install Shopify app?**
- Verify App URL matches your Vercel URL
- Check redirect URLs include Railway backend
- Ensure all scopes are selected

**Database connection failed?**
- Check Railway MySQL is running
- Verify DB_HOST, DB_USER, DB_PASSWORD are set correctly
- Try restarting backend service

---

## 📚 What's Next After Setup?

Once everything is running, you can:

1. **Create invoice templates** (visual editor coming in Phase 4)
2. **Configure settings** (numbering format, defaults)
3. **Test invoice generation** with sample orders
4. **Set up email templates** for delivery
5. **Configure automation rules** (auto-send on order)

---

**Total Setup Time**: ~45 minutes

**Questions?** Check SETUP_GUIDE.md or create an issue on GitHub!
