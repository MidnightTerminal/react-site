// =============================================
// MySQL Database Connection Pool
// =============================================
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopvibe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME || 'shopvibe'}`);
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    console.error('   Make sure MySQL is running and .env is configured correctly.');
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
