// Update with your config settings.
const config = require('../private_configs');

module.exports = {
  development: {
    client: 'postgresql',
    connection: config.development.dbConfig,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/db/migrations',
    },
    seeds: {
      directory: './data/db/seeds',
    },
    debug: true,
  },
  production: {
    client: 'postgresql',
    connection: config.production.dbConfig, // process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    ssl: true,
  },
};
