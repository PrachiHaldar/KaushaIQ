module.exports = {
  secret: process.env.JWT_SECRET || 'kaushiq_sih2026_super_secret_jwt_key_987654321',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
