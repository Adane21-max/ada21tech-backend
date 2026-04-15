const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.MYSQLHOST || process.env.DB_HOST;
const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
const user = process.env.MYSQLUSER || process.env.DB_USER;
const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
const database = process.env.MYSQLDATABASE || process.env.DB_DATABASE;

const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  port: port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: host?.includes('proxy.rlwy.net')
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool.promise();