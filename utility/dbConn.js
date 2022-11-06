const mysql = require('mysql')

const config = {
  host: process.env.dbHost,
  user: process.env.dbUserName,
  password: process.env.dbPassword,
  database: process.env.dbName,
  connectionLimit: process.env.connectionLimit ?? 1,
}

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit,
})

const closeConnection = async () => {
    await pool.closeConnection();
}

module.exports = {
    pool,
    closeConnection,
    config,
}