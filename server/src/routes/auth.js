import express from 'express';
import { shopify, sessionStorage } from '../config/shopify.js';
import { query } from '../config/database.js';

const router = express.Router();

// OAuth initiation
router.get('/shopify', async (req, res) => {
  try {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Begin OAuth process
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/shopify/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res
    });

    res.redirect(authRoute);
  } catch (error) {
    console.error('Auth initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate authentication' });
  }
});

// OAuth callback
router.get('/shopify/callback', async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res
    });

    const { session } = callback;

    // Store session
    await sessionStorage.storeSession(session);

    // Store or update shop in database
    const existingShop = await query(
      'SELECT id FROM shops WHERE shop_domain = ?',
      [session.shop]
    );

    if (existingShop.length > 0) {
      // Update existing shop
      await query(
        'UPDATE shops SET access_token = ?, scope = ?, is_active = TRUE, updated_at = NOW() WHERE shop_domain = ?',
        [session.accessToken, session.scope, session.shop]
      );
    } else {
      // Create new shop
      await query(
        'INSERT INTO shops (shop_domain, access_token, scope, is_active) VALUES (?, ?, ?, TRUE)',
        [session.shop, session.accessToken, session.scope]
      );

      // Create default settings for new shop
      const shopResult = await query(
        'SELECT id FROM shops WHERE shop_domain = ?',
        [session.shop]
      );

      await query(
        'INSERT INTO shop_settings (shop_id) VALUES (?)',
        [shopResult[0].id]
      );
    }

    // Redirect to app with session token
    const host = req.query.host;
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${redirectUrl}?shop=${session.shop}&host=${host}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify session
router.get('/verify', async (req, res) => {
  try {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    const shopData = await query(
      'SELECT id, shop_domain, is_active FROM shops WHERE shop_domain = ? AND is_active = TRUE',
      [shop]
    );

    if (shopData.length === 0) {
      return res.json({ authenticated: false });
    }

    res.json({ authenticated: true, shop: shopData[0] });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

export default router;
