require("custom-env").env('default');

CONFIG = {};

CONFIG.APP_PORT = process.env.APP_PORT;
CONFIG.DATABASE_URL = process.env.DATABASE_URL;
CONFIG.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
CONFIG.JWT_EXPIRATION = process.env.JWT_EXPIRATION;
CONFIG.COOKIE_EXPIRATION = process.env.COOKIE_EXPIRATION;

module.exports = CONFIG;