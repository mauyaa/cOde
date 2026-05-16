const bcrypt = require('bcryptjs');
const { mutateStore, readStore } = require('../config/store');
const { createToken } = require('../config/token');
const {
  normalizeEmail,
  sanitizeUser,
  validateRegistrationInput,
} = require('../models/userModel');

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildAuthPayload(user) {
  const safeUser = sanitizeUser(user);
  const token = createToken({ userId: user.id, role: user.role });

  return { token, user: safeUser };
}

async function register(req, res) {
  const errors = validateRegistrationInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const email = normalizeEmail(req.body.email);

  const response = await mutateStore(async (store) => {
    if (store.users.some((candidate) => candidate.email === email)) {
      return {
        status: 409,
        body: { message: 'An account with that email already exists.' },
      };
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = {
      id: createId('user'),
      fullName: String(req.body.fullName).trim(),
      email,
      passwordHash,
      role: req.body.role,
      location: String(req.body.location || '').trim(),
      phone: String(req.body.phone || '').trim(),
      bio: String(req.body.bio || '').trim(),
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);

    return {
      status: 201,
      body: buildAuthPayload(user),
    };
  });

  return res.status(response.status).json(response.body);
}

async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const store = await readStore();
  const user = store.users.find((candidate) => candidate.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json(buildAuthPayload(user));
}

function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

module.exports = {
  register,
  login,
  me,
};
