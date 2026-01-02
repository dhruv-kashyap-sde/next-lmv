import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '6h'; // 6 hours session

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in your environment variables');
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateVerificationToken() {
  return jwt.sign(
    { purpose: 'email_verification' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}
