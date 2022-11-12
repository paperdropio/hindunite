const { Sequelize } = require('sequelize')
const models = require('../models')
const { config } = require('./dbConn')

const sequelizeInstance = new Sequelize({
  database: config.database,
  username: config.user,
  password: config.password,
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: Number(config.connectionLimit),
    min: 1,
  }
})
models(sequelizeInstance);

module.exports = {
    seq: sequelizeInstance
}