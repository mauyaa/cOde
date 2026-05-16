const crypto = require('crypto');

function getTokenSecret() {
  return process.env.JWT_SECRET || 'local-development-secret';
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf-8');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
}

function createToken(payload, expiresInDays = 7) {
  const tokenPayload = {
    ...payload,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const [encodedPayload, signature] = String(token || '').split('.');

  if (!encodedPayload || !signature) {
    throw new Error('Malformed token.');
  }

  const expectedSignature = signPayload(encodedPayload);
  if (signature !== expectedSignature) {
    throw new Error('Signature mismatch.');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error('Token expired.');
  }

  return payload;
}

module.exports = {
  createToken,
  getTokenSecret,
  verifyToken,
};
