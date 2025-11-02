import express from 'express';
import { shopify } from '../config/shopify.js';
import { query } from '../config/database.js';

const router = express.Router();

// Mock data for development/testing
const mockOrders = [
  {
    id: '1001',
    orderNumber: '#1001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    amount: 299.99,
    currency: 'USD',
    status: 'paid',
    fulfillmentStatus: 'fulfilled',
    date: new Date().toISOString(),
    lineItems: [
      {
        id: '1',
        title: 'Premium Widget',
        quantity: 2,
        price: 99.99,
        total: 199.98,
        sku: 'WIDGET-001'
      },
      {
        id: '2',
        title: 'Deluxe Gadget',
        quantity: 1,
        price: 100.01,
        total: 100.01,
        sku: 'GADGET-002'
      }
    ],
    billingAddress: {
      address1: '123 Main Street',
      address2: 'Suite 100',
      city: 'San Francisco',
      province: 'CA',
      zip: '94102',
      country: 'United States'
    }
  },
  {
    id: '1002',
    orderNumber: '#1002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    amount: 599.50,
    currency: 'USD',
    status: 'pending',
    fulfillmentStatus: 'unfulfilled',
    date: new Date(Date.now() - 86400000).toISOString(),
    lineItems: [
      {
        id: '3',
        title: 'Enterprise Solution',
        quantity: 1,
        price: 599.50,
        total: 599.50,
        sku: 'ENT-001'
      }
    ],
    billingAddress: {
      address1: '456 Tech Ave',
      city: 'Austin',
      province: 'TX',
      zip: '78701',
      country: 'United States'
    }
  },
  {
    id: '1003',
    orderNumber: '#1003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    amount: 149.99,
    currency: 'USD',
    status: 'paid',
    fulfillmentStatus: 'fulfilled',
    date: new Date(Date.now() - 172800000).toISOString(),
    lineItems: [
      {
        id: '4',
        title: 'Standard Package',
        quantity: 3,
        price: 49.99,
        total: 149.97,
        sku: 'STD-PKG-001'
      }
    ],
    billingAddress: {
      address1: '789 Business Blvd',
      city: 'New York',
      province: 'NY',
      zip: '10001',
      country: 'United States'
    }
  }
];

// Middleware to verify shop exists and get access token (or use mock mode)
async function verifyShop(req, res, next) {
  // If mock data mode is enabled, skip shop verification
  if (process.env.USE_MOCK_DATA === 'true') {
    req.useMockData = true;
    return next();
  }

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

// Get orders from Shopify (or mock data)
router.get('/', verifyShop, async (req, res) => {
  // Return mock data if enabled
  if (req.useMockData) {
    return res.json({
      success: true,
      orders: mockOrders,
      count: mockOrders.length,
      mock: true
    });
  }
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
  // Return mock data if enabled
  if (req.useMockData) {
    const { orderId } = req.params;
    const order = mockOrders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({
      success: true,
      order,
      mock: true
    });
  }

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
