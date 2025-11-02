# Shopify Invoice App - Setup Guide

## Overview
This guide will help you set up and run the Shopify Invoice App locally for development.

## Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ database
- Shopify Partner account (for API credentials - optional for testing)

## Quick Start (Mock Data Mode)

Want to test the dashboard immediately without Shopify setup? We've got you covered!

The app includes a **mock data mode** that lets you see the dashboard with sample orders:

```bash
# Backend
cd server
npm install
# .env file is already created with USE_MOCK_DATA=true
npm run dev

# Frontend (in another terminal)
cd admin
npm install
# .env file is already created
npm run dev
```

Visit http://localhost:5173 and you'll see 3 sample orders with invoice preview!

To switch to real Shopify data later, just set `USE_MOCK_DATA=false` in `server/.env` and add your Shopify credentials.

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE shopify_invoice_app;
```

### 2. Configure Environment Variables
Copy the example files and update with your database credentials:

**Server:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and update:
- `DB_HOST` - Your MySQL host (e.g., localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - Your MySQL username
- `DB_PASSWORD` - Your MySQL password
- `DB_NAME` - Database name (shopify_invoice_app)

**Frontend:**
```bash
cd admin
cp .env.example .env
```

Edit `admin/.env` with your configuration.

### 3. Run Database Migrations

**Local/Development Database:**
```bash
cd server
npm run migrate
```

**Production Database (Railway):**
```bash
cd server
npm run migrate:prod
```

See [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for detailed production database setup instructions.

This will create all required tables (13 total).

## Shopify App Setup

### 1. Create Shopify App
1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Create a new app
3. Set the following URLs:
   - App URL: `http://localhost:5173`
   - Allowed redirection URLs: `http://localhost:3001/auth/shopify/callback`
4. Configure the following scopes:
   - `read_products`
   - `write_draft_orders`
   - `read_orders`
   - `read_customers`
   - `write_customers`

### 2. Update Environment Variables
Update `server/.env` with your Shopify credentials:
```env
SHOPIFY_API_KEY=your_api_key_from_shopify
SHOPIFY_API_SECRET=your_api_secret_from_shopify
```

Update `admin/.env`:
```env
VITE_SHOPIFY_API_KEY=your_api_key_from_shopify
```

## Installation

### Backend (Server)
```bash
cd server
npm install
```

### Frontend (Admin)
```bash
cd admin
npm install
```

## Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on http://localhost:3001

### Start Frontend
```bash
cd admin
npm run dev
```
Frontend runs on http://localhost:5173

## Features Implemented

### ✅ Database Schema
- Complete schema with all tables for invoices, orders, customers, templates
- Migration script for easy deployment
- Connection pooling configured

### ✅ Shopify Integration
- OAuth authentication flow
- Orders API integration
- Session management
- Secure token storage

### ✅ Dashboard
- Professional UI with Tailwind CSS
- Real-time order viewing
- Stats cards (orders, revenue, customers)
- Responsive design

### ✅ Invoice Preview
- Basic invoice template
- Order details display
- Line items breakdown
- Customer billing information
- Download PDF button (to be implemented)
- Send email button (to be implemented)

## API Endpoints

### Authentication
- `GET /auth/shopify` - Initiate OAuth
- `GET /auth/shopify/callback` - OAuth callback
- `GET /auth/verify` - Verify session

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get single order

### Health Check
- `GET /health` - Server health status

## Next Steps

### Phase 2: PDF Generation
- Implement Puppeteer-based PDF generation
- Create customizable invoice templates
- Add download functionality

### Phase 3: Email Integration
- SendGrid integration
- Email templates
- Automated invoice sending
- Email tracking

### Phase 4: Advanced Features
- Multiple invoice templates
- Template builder
- Automated invoice creation
- Payment tracking
- GDPR compliance

## Troubleshooting

### Database Connection Failed
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Shopify OAuth Error
- Verify API credentials
- Check redirect URLs match exactly
- Ensure app is not in test mode

### Port Already in Use
- Kill process using port 3001: `lsof -ti:3001 | xargs kill`
- Or change PORT in server/.env

## Support
For issues or questions, please check the main README.md or create an issue in the repository.
