import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
};

async function runMigrations() {
  console.log('🔄 Starting database migration...\n');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${dbConfig.database}@${dbConfig.host}\n`);

  let connection;

  try {
    // Connect to database
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

      // Split SQL file into individual statements (handling multi-line statements)
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let successCount = 0;
      for (const statement of statements) {
        try {
          await connection.query(statement);
          successCount++;
        } catch (error) {
          // Skip "table already exists" errors
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      }

      console.log(`  ✓ Executed ${successCount} statement(s)\n`);
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
