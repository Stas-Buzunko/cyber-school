const env = process.env.NODE_ENV || 'development'

/* eslint camelcase: ["error", {properties: "never"}] */

const backend = {
  development: 'http://localhost:3001',
  production: 'https://server.cyber-academy.net/'
}

module.exports = backend[env]
