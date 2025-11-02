import readline from 'readline';
import { query } from '../src/config/database.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function addShop() {
  console.log('🔧 Shopify Shop Setup\n');
  console.log('This script will add your shop to the database for testing.\n');

  const shopDomain = await askQuestion('Enter your shop domain (e.g., yourstore.myshopify.com): ');
  const accessToken = await askQuestion('Enter your shop access token (leave empty for now): ');

  try {
    // Check if shop already exists
    const existing = await query(
      'SELECT id FROM shops WHERE shop_domain = ?',
      [shopDomain]
    );

    if (existing.length > 0) {
      console.log('\n⚠️  Shop already exists. Updating...');

      if (accessToken) {
        await query(
          'UPDATE shops SET access_token = ?, is_active = TRUE WHERE shop_domain = ?',
          [accessToken, shopDomain]
        );
      }

      console.log('✅ Shop updated successfully!');
    } else {
      console.log('\n📝 Creating new shop entry...');

      const token = accessToken || 'temp_token_' + Date.now();
      await query(
        'INSERT INTO shops (shop_domain, access_token, scope, is_active) VALUES (?, ?, ?, TRUE)',
        [shopDomain, token, process.env.SHOPIFY_SCOPES]
      );

      // Get the shop ID
      const [shop] = await query(
        'SELECT id FROM shops WHERE shop_domain = ?',
        [shopDomain]
      );

      // Create default settings
      await query(
        'INSERT INTO shop_settings (shop_id) VALUES (?)',
        [shop.id]
      );

      console.log('✅ Shop created successfully!');
    }

    console.log(`\n🎉 Done! You can now use shop parameter: ?shop=${shopDomain}\n`);
    console.log('To fetch orders, make sure to authenticate via OAuth first:');
    console.log(`http://localhost:3001/auth/shopify?shop=${shopDomain}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

addShop();
