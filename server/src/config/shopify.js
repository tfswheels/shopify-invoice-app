import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, LATEST_API_VERSION } from '@shopify/shopify-api';
import dotenv from 'dotenv';

dotenv.config();

// Shopify API configuration
export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_SCOPES || 'read_products,write_draft_orders,read_orders,read_customers,write_customers').split(','),
  hostName: process.env.APP_URL?.replace(/https?:\/\//, '') || 'localhost:3001',
  hostScheme: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
  }
});

// Session storage configuration (in-memory for now, should be database in production)
const sessions = new Map();

export const sessionStorage = {
  async storeSession(session) {
    sessions.set(session.id, session);
    return true;
  },

  async loadSession(id) {
    return sessions.get(id) || null;
  },

  async deleteSession(id) {
    return sessions.delete(id);
  },

  async deleteSessions(ids) {
    ids.forEach(id => sessions.delete(id));
    return true;
  },

  async findSessionsByShop(shop) {
    const result = [];
    for (const [id, session] of sessions) {
      if (session.shop === shop) {
        result.push(session);
      }
    }
    return result;
  }
};

export default shopify;
