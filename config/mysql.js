const mysql = require('mysql2/promise');

// 使用环境变量配置 MySQL，默认回退到本地默认
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123456',
  database: process.env.MYSQL_DATABASE || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 示例查询函数，可在业务代码中直接使用 pool
async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
    console.log('The solution is: ', rows[0].solution);
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
}

module.exports = { pool, testConnection };