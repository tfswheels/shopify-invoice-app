# Production Database Setup (Railway)

This guide walks you through setting up the production database on Railway.

## Railway Database Credentials

Your Railway MySQL database connection details:
- **Host**: shinkansen.proxy.rlwy.net
- **Port**: 11011
- **User**: root
- **Password**: EZKJAIMcdIsWFnYmTuWggWHyYzhqKDeC
- **Database**: railway

## Option 1: Automated Migration (Recommended)

Run the production migration script from your local machine:

```bash
cd server
npm run migrate:prod
```

This will:
1. Connect to your Railway database
2. Execute all migration files
3. Create all 13 tables
4. Display the list of created tables

## Option 2: Manual MySQL Client

If you prefer to run migrations manually:

```bash
# Connect to Railway database
mysql -h shinkansen.proxy.rlwy.net \
  -u root \
  -pEZKJAIMcdIsWFnYmTuWggWHyYzhqKDeC \
  --port 11011 \
  --protocol=TCP \
  railway

# Once connected, run the migration file
mysql> source /path/to/server/database/migrations/001_initial_schema.sql
```

## Verify Tables Were Created

After migration, verify all tables exist:

```bash
# Using the migration script (automatically shows tables)
npm run migrate:prod

# Or connect manually and check
mysql -h shinkansen.proxy.rlwy.net -u root -pEZKJAIMcdIsWFnYmTuWggWHyYzhqKDeC --port 11011 railway -e "SHOW TABLES;"
```

Expected tables (13 total):
- shops
- shop_settings
- customers
- invoices
- invoice_line_items
- invoice_templates
- email_templates
- email_logs
- invoice_numbers
- draft_orders
- subscriptions
- gdpr_requests
- template_assignment_rules

## Update Production Environment Variables

Once the database is set up, update your Railway backend environment variables:

```env
DB_HOST=shinkansen.proxy.rlwy.net
DB_PORT=11011
DB_USER=root
DB_PASSWORD=EZKJAIMcdIsWFnYmTuWggWHyYzhqKDeC
DB_NAME=railway
NODE_ENV=production
USE_MOCK_DATA=false
```

## Troubleshooting

### Connection Timeout
If you get a timeout error, Railway might have firewall restrictions. Try:
1. Check Railway dashboard for database status
2. Ensure you're using the latest connection details
3. Try connecting from a different network

### Tables Already Exist
If you see "table already exists" errors, that's normal - the migration script will skip those and continue.

### Permission Denied
Ensure you're using the root user credentials provided by Railway.

## Next Steps

After successful migration:
1. Deploy your backend to Railway
2. Configure Shopify OAuth credentials
3. Set `USE_MOCK_DATA=false` in production
4. Test with real Shopify data
