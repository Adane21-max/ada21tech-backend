const mysql = require('mysql2');

// Hardcode the correct database name to override any Render environment variable issue
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = 'defaultdb';   // <-- FORCE defaultdb

console.log('🔄 Attempting MySQL connection (TiDB):');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   User: ${user}`);
console.log(`   Database: ${database}`);
console.log(`   Password: ${password ? '***' : 'NOT SET'}`);

if (!host || !user || !password) {
  console.error('❌ Missing required database environment variables.');
  console.error('   DB_HOST, DB_USER, DB_PASSWORD must be set on Render.');
  process.exit(1);
}

const pool = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:');
    console.error('   Code:', err.code);
    console.error('   Message:', err.message);
  } else {
    console.log('✅ MySQL Connected successfully (TiDB)');
    connection.release();
  }
});

module.exports = pool.promise();