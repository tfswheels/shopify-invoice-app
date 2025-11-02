# Shopify Authentication Guide

## Overview
This app uses Shopify OAuth to securely access your store's order data. Follow these steps to authenticate your shop.

## Prerequisites
- Your Shopify store URL (e.g., `yourstore.myshopify.com`)
- The app must be installed on your Shopify store
- Backend and frontend servers running

## Method 1: Using the UI (Easiest)

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd admin
   npm run dev
   ```

2. **Open the app:**
   - Navigate to `http://localhost:5174`
   - You'll see the Shopify authentication page

3. **Enter your shop domain:**
   - Type your shop domain (e.g., `yourstore.myshopify.com`)
   - Click "Connect to Shopify"

4. **Authorize the app:**
   - You'll be redirected to Shopify
   - Review the permissions requested
   - Click "Install app" or "Authorize"

5. **Done!**
   - You'll be redirected back to the dashboard
   - Your orders will load automatically

## Method 2: Direct OAuth URL

If the UI method doesn't work, you can manually initiate OAuth:

1. **Get your shop domain** (e.g., `yourstore.myshopify.com`)

2. **Visit the OAuth URL:**
   ```
   http://localhost:3001/auth/shopify?shop=yourstore.myshopify.com
   ```
   Replace `yourstore.myshopify.com` with your actual shop domain

3. **Authorize on Shopify**

4. **You'll be redirected back to:**
   ```
   http://localhost:5174?shop=yourstore.myshopify.com&host=...
   ```

## Troubleshooting

### Error: "Shop not authenticated"
- You haven't completed the OAuth flow yet
- Go to: `http://localhost:3001/auth/shopify?shop=yourstore.myshopify.com`

### Error: "Missing shop parameter"
- The shop domain wasn't saved properly
- Click the logout button (top right) and authenticate again

### Error: "App not installed"
- Make sure the app is installed on your Shopify store first
- Check your Shopify Partners dashboard

### OAuth Redirect Mismatch
- Verify `SHOPIFY_REDIRECT_URI` in `.env` matches your app settings:
  ```
  SHOPIFY_REDIRECT_URI=http://localhost:3001/auth/shopify/callback
  ```
- Update your app's "Allowed redirection URL(s)" in Shopify Partners

### Can't See Orders
1. Make sure you have orders in your Shopify store
2. Check backend logs for errors
3. Verify your API credentials in `server/.env`:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
4. Ensure the app has the correct scopes:
   - `read_products`
   - `read_orders`
   - `read_customers`

## Testing with Mock Data

If you just want to test the UI without connecting to Shopify:

1. Edit `server/.env`:
   ```env
   USE_MOCK_DATA=true
   ```

2. Restart the backend server

3. The app will show 3 sample orders for testing

## App Scopes

The app requests these permissions:
- **read_products** - View product information
- **write_draft_orders** - Create draft orders for invoices
- **read_orders** - View order details
- **read_customers** - View customer information
- **write_customers** - Update customer records

## Security Notes

- Access tokens are stored securely in the database
- All API calls use HTTPS in production
- Tokens are never exposed to the frontend
- Session data is stored server-side

## Next Steps

After authentication:
1. View orders from your store
2. Click any order to preview the invoice
3. Customize invoice templates (coming soon)
4. Send invoices to customers (coming soon)

## Need Help?

Check the logs:
```bash
# Backend logs
cd server && npm run dev

# Frontend console
Open browser DevTools → Console tab
```

Common issues are usually:
- Missing environment variables
- Incorrect shop domain format
- App not installed on store
- Redirect URI mismatch
