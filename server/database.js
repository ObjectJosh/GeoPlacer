require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', (err, client) => {
  if (err) console.error(err);
  console.log(client);
  console.log('Successfully connected to postgres.');
});

const { Sequelize } = require('sequelize');

const devConfig = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

const proConfig = process.env.DATABASE_URL;

const config = process.env.NODE_ENV === "production" ? proConfig : devConfig;

const sequelize = new Sequelize(config, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  }
});

module.exports = sequelize;
