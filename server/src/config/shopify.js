import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';
import dotenv from 'dotenv';

dotenv.config();

// Shopify API Configuration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_products',
    'read_orders',
    'write_draft_orders',
    'read_customers',
    'write_orders',
    'read_inventory',
    'write_inventory'
  ],
  hostName: process.env.APP_URL?.replace(/https?:\/\//, '') || 'localhost:3001',
  hostScheme: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'info'
  }
});

/**
 * Verify webhook HMAC signature
 * @param {string} hmac - HMAC from webhook header
 * @param {Buffer} body - Raw request body
 * @returns {boolean}
 */
function verifyWebhook(hmac, body) {
  try {
    return shopify.webhooks.validate({
      rawBody: body.toString('utf8'),
      rawHeader: hmac
    });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

/**
 * Create GraphQL client for a shop
 * @param {string} shop - Shop domain
 * @param {string} accessToken - Shop access token
 */
function createGraphQLClient(shop, accessToken) {
  return new shopify.clients.Graphql({
    session: {
      shop,
      accessToken
    }
  });
}

/**
 * Create REST client for a shop
 * @param {string} shop - Shop domain
 * @param {string} accessToken - Shop access token
 */
function createRestClient(shop, accessToken) {
  return new shopify.clients.Rest({
    session: {
      shop,
      accessToken
    }
  });
}

export {
  shopify,
  verifyWebhook,
  createGraphQLClient,
  createRestClient
};

export default shopify;
