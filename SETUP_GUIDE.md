# Complete Setup Guide - Shopify Invoice Generator

This guide will walk you through setting up the entire application infrastructure including GitHub, Shopify Partner account, Railway (backend), and Vercel (frontend).

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Shopify Partner account
- [ ] Railway account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] SendGrid account for emails (free tier available)

---

## 1️⃣ GitHub Repository Setup

### Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `shopify-invoice-app`
   - **Description**: `Professional invoice generation and email automation system for Shopify stores`
   - **Visibility**: Public or Private
   - **DO NOT** check "Initialize with README"

3. Click "Create repository"

### Push Local Code to GitHub

After creating the repository, run these commands:

```bash
cd /Users/jeremiah/Desktop/shopify-invoice-app

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shopify-invoice-app.git

# Push to GitHub
git push -u origin main
```

**Alternative with SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/shopify-invoice-app.git
git push -u origin main
```

✅ **Checkpoint**: Your code should now be visible on GitHub

---

## 2️⃣ Railway Setup (Backend + Database)

### Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Verify your email

### Create New Project

1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select `shopify-invoice-app` repository

### Add MySQL Database

1. In your Railway project, click "+ New"
2. Select "Database"
3. Choose "MySQL"
4. Wait for deployment (takes ~1-2 minutes)

### Configure Backend Service

1. Click "+ New" → "GitHub Repo"
2. Select your `shopify-invoice-app` repository
3. Click on the service settings (⚙️ icon)
4. Configure:
   - **Name**: `invoice-backend`
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   - **Install Command**: `npm install`

### Set Environment Variables for Backend

1. Click on your `invoice-backend` service
2. Go to "Variables" tab
3. Click "Raw Editor"
4. Paste the following (update values):

```env
# Server
PORT=3001
NODE_ENV=production
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
FRONTEND_URL=https://your-app.vercel.app

# Database (Railway provides these automatically)
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}

# Shopify (will fill these after creating Shopify app)
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_SCOPES=read_products,read_orders,write_draft_orders,read_customers,write_orders
SHOPIFY_REDIRECT_URI=${{RAILWAY_PUBLIC_DOMAIN}}/auth/callback

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Invoice Generator
ADMIN_EMAIL=admin@yourdomain.com

# Security
SESSION_SECRET=generate_random_string_here
ENCRYPTION_KEY=generate_random_string_here
```

### Generate Public URL

1. In backend service settings, go to "Settings"
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy the URL (e.g., `invoice-backend-production.railway.app`)

### Run Database Migrations

1. After backend deploys successfully
2. Go to "Deployments" tab
3. Click on the latest deployment
4. Click "View Logs"
5. Or run migrations manually via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run npm run migrate
```

✅ **Checkpoint**: Backend should be running at `https://your-backend.railway.app/health`

---

## 3️⃣ Shopify Partner Account & App Setup

### Create Partner Account

1. Go to https://partners.shopify.com/signup
2. Create account or log in
3. Complete partner profile

### Create Development Store

1. In Partner Dashboard, go to "Stores"
2. Click "Add store" → "Development store"
3. Fill in details:
   - **Store name**: `your-store-name`
   - **Password**: Create a password
   - **Purpose**: Test app or theme
4. Click "Save"
5. Note your store URL: `your-store-name.myshopify.com`

### Create Shopify App

1. In Partner Dashboard, go to "Apps"
2. Click "Create app"
3. Choose "Create app manually"
4. Fill in:
   - **App name**: `Invoice Generator`
   - **App URL**: `https://your-backend.railway.app` (from Railway)
   - **Allowed redirection URL(s)**:
     ```
     https://your-backend.railway.app/auth/callback
     https://your-backend.railway.app/auth/shopify/callback
     ```

5. Click "Create app"

### Configure App Settings

1. Go to "App setup" tab
2. Under "App URL", set:
   - **App URL**: `https://your-backend.railway.app`
   - **Allowed redirection URLs**: (same as above)

3. Under "Embedded app", enable:
   - ✅ **Embed your app in Shopify admin**

4. Under "API scopes", select:
   - `read_products`
   - `read_orders`
   - `write_draft_orders`
   - `read_customers`
   - `write_orders`
   - `read_inventory`
   - `write_inventory`

### Get API Credentials

1. Go to "App setup" → "API credentials"
2. Copy **API key** and **API secret**
3. Keep these safe!

### Update Railway Environment Variables

1. Go back to Railway dashboard
2. Open `invoice-backend` service
3. Go to "Variables"
4. Update:
   ```env
   SHOPIFY_API_KEY=your_api_key_from_shopify
   SHOPIFY_API_SECRET=your_api_secret_from_shopify
   ```

5. Click "Save" and redeploy

### Update shopify.app.toml

1. Edit `/Users/jeremiah/Desktop/shopify-invoice-app/shopify.app.toml`
2. Update:
   ```toml
   client_id = "your_shopify_api_key"
   application_url = "https://your-backend.railway.app"

   [build]
   dev_store_url = "your-store-name.myshopify.com"
   ```

✅ **Checkpoint**: Shopify app is configured with Railway backend

---

## 4️⃣ Vercel Setup (Frontend)

### Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)

### Import Project

1. Click "Add New..." → "Project"
2. Import `shopify-invoice-app` from GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Set Environment Variables

1. In project settings, go to "Environment Variables"
2. Add:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_SHOPIFY_API_KEY=your_shopify_api_key
   ```

3. Apply to: Production, Preview, Development

### Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Copy your Vercel URL (e.g., `your-app.vercel.app`)

### Update Railway Backend with Frontend URL

1. Go to Railway dashboard
2. Open `invoice-backend` service
3. Update `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Update Shopify App URL

1. Go to Shopify Partner Dashboard
2. Open your Invoice Generator app
3. Update **App URL**:
   ```
   https://your-app.vercel.app
   ```

✅ **Checkpoint**: Frontend is deployed and connected to backend

---

## 5️⃣ SendGrid Email Setup

### Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Create free account (100 emails/day)
3. Verify email address

### Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: `Invoice Generator`
4. Permissions: Full Access
5. Copy API key immediately (can't view again!)

### Verify Sender Identity

1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in your email details
4. Verify email

### Update Railway Variables

1. Go to Railway → `invoice-backend`
2. Update:
   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=your_verified_email@domain.com
   FROM_NAME=Invoice Generator
   ```

✅ **Checkpoint**: Email service is configured

---

## 6️⃣ Configure Webhooks

### Register Webhooks in Shopify

1. Go to Shopify Partner Dashboard
2. Open your app → "App setup"
3. Scroll to "Webhooks"
4. Add webhooks:

   **Order webhooks:**
   - Topic: `orders/create`
   - URL: `https://your-backend.railway.app/webhooks/orders/create`

   - Topic: `orders/paid`
   - URL: `https://your-backend.railway.app/webhooks/orders/paid`

   **GDPR webhooks (required):**
   - Topic: `customers/data_request`
   - URL: `https://your-backend.railway.app/webhooks/gdpr/customers_data_request`

   - Topic: `customers/redact`
   - URL: `https://your-backend.railway.app/webhooks/gdpr/customers_redact`

   - Topic: `shop/redact`
   - URL: `https://your-backend.railway.app/webhooks/gdpr/shop_redact`

✅ **Checkpoint**: Webhooks are registered

---

## 7️⃣ Install App on Development Store

### Install the App

1. In Partner Dashboard, go to your app
2. Click "Test on development store"
3. Select your development store
4. Click "Install app"
5. Review permissions and click "Install"

### Verify Installation

1. Go to your development store admin
2. You should see "Invoice Generator" in the apps section
3. Click to open the app

✅ **Checkpoint**: App is installed and accessible

---

## 8️⃣ Local Development Setup (Optional)

### Install Dependencies

```bash
cd /Users/jeremiah/Desktop/shopify-invoice-app

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../admin
npm install
```

### Set Up Local Environment Variables

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your values

# Frontend
cp admin/.env.example admin/.env
# Edit admin/.env with your values
```

### Run Local Database (Optional)

If you want to run MySQL locally instead of Railway:

```bash
# Install MySQL
brew install mysql  # macOS
# or use Docker:
docker run --name mysql-invoice -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=invoice_app -p 3306:3306 -d mysql:8

# Run migrations
cd server
npm run migrate
```

### Start Development Servers

```bash
# Backend (terminal 1)
cd server
npm run dev

# Frontend (terminal 2)
cd admin
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 🎯 Next Steps

After setup is complete:

1. **Test the app** in your development store
2. **Create invoice templates** in the app
3. **Configure settings** (numbering, email, etc.)
4. **Test invoice generation** with test orders
5. **Review email delivery** functionality

---

## 🆘 Troubleshooting

### Backend won't deploy on Railway
- Check build logs for errors
- Verify all environment variables are set
- Ensure `server/package.json` has correct start script

### Frontend won't build on Vercel
- Verify root directory is set to `admin`
- Check build logs for missing dependencies
- Ensure environment variables are set

### Database connection fails
- Check Railway MySQL service is running
- Verify environment variables reference correct service
- Try restarting backend service

### Shopify app won't install
- Verify App URL matches Railway backend URL
- Check redirect URLs are configured correctly
- Ensure all required scopes are selected

### Emails not sending
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Review email logs in app for errors

---

## 📚 Additional Resources

- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [SendGrid API Docs](https://docs.sendgrid.com/)

---

**Questions or issues?** Create an issue on GitHub!
