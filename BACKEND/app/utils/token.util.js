const crypto = require('crypto');

exports.createToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
