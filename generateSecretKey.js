const fs = require('fs');
const crypto = require('crypto');

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomString(32);

// Write the key to the .env file
fs.writeFileSync('.env', `SESSION_SECRET=${secretKey}\n`);

console.log('Generated Secret Key:', secretKey);
