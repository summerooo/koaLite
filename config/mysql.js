const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host:     env.MYSQL_HOST,
  user:     env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
    console.log('The solution is: ', rows[0].solution);
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
}

module.exports = { pool, testConnection };
