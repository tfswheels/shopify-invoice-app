import express from 'express';
import { shopify } from '../config/shopify.js';
import { query } from '../config/database.js';

const router = express.Router();

// Middleware to verify shop exists and get access token
async function verifyShop(req, res, next) {
  try {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    const shopData = await query(
      'SELECT id, shop_domain, access_token FROM shops WHERE shop_domain = ? AND is_active = TRUE',
      [shop]
    );

    if (shopData.length === 0) {
      return res.status(401).json({ error: 'Shop not authenticated' });
    }

    req.shopData = shopData[0];
    next();
  } catch (error) {
    console.error('Shop verification error:', error);
    res.status(500).json({ error: 'Failed to verify shop' });
  }
}

// Get orders from Shopify
router.get('/', verifyShop, async (req, res) => {
  try {
    const { shop_domain, access_token } = req.shopData;
    const { limit = 50, status = 'any', created_at_min } = req.query;

    // Create Shopify REST client
    const client = new shopify.clients.Rest({
      session: {
        shop: shop_domain,
        accessToken: access_token
      }
    });

    // Fetch orders from Shopify
    const response = await client.get({
      path: 'orders',
      query: {
        limit: parseInt(limit),
        status,
        created_at_min,
        fields: 'id,name,email,created_at,updated_at,total_price,currency,financial_status,fulfillment_status,customer,line_items,billing_address,shipping_address'
      }
    });

    const orders = response.body.orders;

    // Transform orders for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id.toString(),
      orderNumber: order.name,
      customerName: order.customer
        ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
        : 'Guest',
      customerEmail: order.email || order.customer?.email || '',
      amount: parseFloat(order.total_price),
      currency: order.currency,
      status: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      date: order.created_at,
      lineItems: order.line_items?.map(item => ({
        id: item.id.toString(),
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total: parseFloat(item.price) * item.quantity,
        sku: item.sku
      })) || [],
      billingAddress: order.billing_address,
      shippingAddress: order.shipping_address,
      customer: order.customer
    }));

    res.json({
      success: true,
      orders: transformedOrders,
      count: transformedOrders.length
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Get single order by ID
router.get('/:orderId', verifyShop, async (req, res) => {
  try {
    const { shop_domain, access_token } = req.shopData;
    const { orderId } = req.params;

    const client = new shopify.clients.Rest({
      session: {
        shop: shop_domain,
        accessToken: access_token
      }
    });

    const response = await client.get({
      path: `orders/${orderId}`
    });

    const order = response.body.order;

    res.json({
      success: true,
      order: {
        id: order.id.toString(),
        orderNumber: order.name,
        customerName: order.customer
          ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
          : 'Guest',
        customerEmail: order.email || order.customer?.email || '',
        amount: parseFloat(order.total_price),
        currency: order.currency,
        status: order.financial_status,
        fulfillmentStatus: order.fulfillment_status,
        date: order.created_at,
        lineItems: order.line_items?.map(item => ({
          id: item.id.toString(),
          title: item.title,
          quantity: item.quantity,
          price: parseFloat(item.price),
          total: parseFloat(item.price) * item.quantity,
          sku: item.sku
        })) || [],
        billingAddress: order.billing_address,
        shippingAddress: order.shipping_address,
        customer: order.customer,
        subtotalPrice: parseFloat(order.subtotal_price || order.total_price),
        totalTax: parseFloat(order.total_tax || 0),
        totalDiscounts: parseFloat(order.total_discounts || 0),
        shippingLines: order.shipping_lines
      }
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

export default router;
