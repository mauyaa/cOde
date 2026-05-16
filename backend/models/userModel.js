const USER_ROLES = ['farmer', 'buyer'];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function validateRegistrationInput(payload = {}) {
  const errors = [];

  if (!payload.fullName || String(payload.fullName).trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  if (!normalizeEmail(payload.email)) {
    errors.push('Email is required.');
  }

  if (!payload.password || String(payload.password).length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (!USER_ROLES.includes(payload.role)) {
    errors.push('Role must be farmer or buyer.');
  }

  return errors;
}

module.exports = {
  USER_ROLES,
  normalizeEmail,
  sanitizeUser,
  validateRegistrationInput,
};
