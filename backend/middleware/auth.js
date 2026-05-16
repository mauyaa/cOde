const { readStore } = require('../config/store');
const { verifyToken } = require('../config/token');

async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  try {
    const payload = verifyToken(token);
    const store = await readStore();
    const user = store.users.find((candidate) => candidate.id === payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'Authenticated user no longer exists.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication token is invalid.' });
  }
}

module.exports = {
  requireAuth,
};
