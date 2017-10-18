var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: process.env.DB_POOL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

module.exports = pool;
