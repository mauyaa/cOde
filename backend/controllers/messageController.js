const { mutateStore, readStore } = require('../config/store');
const { buildConversationId, validateMessageInput } = require('../models/messageModel');
const { sanitizeUser } = require('../models/userModel');

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildConversationSummary(conversationId, messages, store, currentUserId) {
  const sorted = messages.slice().sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
  const latestMessage = sorted[sorted.length - 1];
  const otherParticipantId = latestMessage.participants.find((participantId) => participantId !== currentUserId);
  const otherParticipant = store.users.find((user) => user.id === otherParticipantId);

  return {
    conversationId,
    participant: otherParticipant ? sanitizeUser(otherParticipant) : null,
    latestMessage,
    messageCount: sorted.length,
  };
}

async function listConversations(req, res) {
  const store = await readStore();
  const groupedMessages = store.messages
    .filter((message) => message.participants.includes(req.user.id))
    .reduce((conversations, message) => {
      if (!conversations[message.conversationId]) {
        conversations[message.conversationId] = [];
      }
      conversations[message.conversationId].push(message);
      return conversations;
    }, {});

  const conversations = Object.entries(groupedMessages)
    .map(([conversationId, messages]) =>
      buildConversationSummary(conversationId, messages, store, req.user.id)
    )
    .sort(
      (left, right) =>
        new Date(right.latestMessage.createdAt) - new Date(left.latestMessage.createdAt)
    );

  return res.json({ conversations });
}

async function listMessages(req, res) {
  const store = await readStore();
  const messages = store.messages
    .filter(
      (message) =>
        message.conversationId === req.params.conversationId &&
        message.participants.includes(req.user.id)
    )
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));

  return res.json({ messages });
}

async function sendMessage(req, res) {
  const errors = validateMessageInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  if (req.body.receiverId === req.user.id) {
    return res.status(400).json({ message: 'You cannot message yourself.' });
  }

  const response = await mutateStore(async (store) => {
    const receiver = store.users.find((user) => user.id === req.body.receiverId);

    if (!receiver) {
      return { status: 404, body: { message: 'Receiver not found.' } };
    }

    const conversationId = buildConversationId(req.user.id, receiver.id);
    const message = {
      id: createId('message'),
      conversationId,
      participants: [req.user.id, receiver.id].sort(),
      senderId: req.user.id,
      receiverId: receiver.id,
      body: String(req.body.body).trim(),
      createdAt: new Date().toISOString(),
    };

    store.messages.push(message);

    return { status: 201, body: { message } };
  });

  return res.status(response.status).json(response.body);
}

module.exports = {
  listConversations,
  listMessages,
  sendMessage,
};
