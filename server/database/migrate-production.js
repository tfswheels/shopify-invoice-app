import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Railway Production Database configuration
const dbConfig = {
  host: 'shinkansen.proxy.rlwy.net',
  port: 11011,
  user: 'root',
  password: 'EZKJAIMcdIsWFnYmTuWggWHyYzhqKDeC',
  database: 'railway',
  multipleStatements: true
};

async function runMigrations() {
  console.log('🔄 Starting PRODUCTION database migration...\n');
  console.log(`Environment: PRODUCTION`);
  console.log(`Database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}\n`);

  let connection;

  try {
    // Connect to database
    console.log('Connecting to Railway database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to database\n');

    // Read all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠ No migration files found');
      return;
    }

    console.log(`Found ${files.length} migration file(s):\n`);

    // Execute each migration file
    for (const file of files) {
      console.log(`Running: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        // Execute entire SQL file (multipleStatements is enabled)
        await connection.query(sql);
        console.log(`  ✓ Migration executed successfully\n`);
      } catch (error) {
        // Check if error is about table already existing
        if (error.message.includes('already exists')) {
          console.log(`  ⚠ Some tables already exist (skipped)\n`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully!');

    // Display created tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\nCreated tables (${tables.length}):`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

// Run migrations
runMigrations();
