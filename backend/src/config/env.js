require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vaultody_demo',
  jwtSecret: process.env.JWT_SECRET || 'supersecretvaultodydemo',
  vaultody: {
    apiKey: process.env.VAULTODY_API_KEY,
    apiSecret: process.env.VAULTODY_API_SECRET,
    passphrase: process.env.VAULTODY_PASSPHRASE,
    baseUrl: process.env.VAULTODY_BASE_URL || 'https://rest.vaultody.com'
  }
};
