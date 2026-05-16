const express = require('express');
const {
  listConversations,
  listMessages,
  sendMessage,
} = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/conversations', listConversations);
router.get('/conversations/:conversationId', listMessages);
router.post('/', sendMessage);

module.exports = router;
