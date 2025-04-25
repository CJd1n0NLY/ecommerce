const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.database.logging || false,
  }
);

module.exports = sequelize;
