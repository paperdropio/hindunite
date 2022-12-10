const mysql2 = require('mysql2/promise')

const config = {
  host: process.env.dbHost,
  user: process.env.dbUserName,
  password: process.env.dbPassword,
  database: process.env.dbName,
  connectionLimit: process.env.connectionLimit ?? 1,
}

const pool = mysql2.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit,
})

module.exports = {
    pool,
    config,
}