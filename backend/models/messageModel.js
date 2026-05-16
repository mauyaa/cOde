function buildConversationId(firstUserId, secondUserId) {
  return `conversation_${[firstUserId, secondUserId].sort().join('_')}`;
}

function validateMessageInput(payload = {}) {
  const errors = [];

  if (!payload.receiverId) {
    errors.push('Receiver is required.');
  }

  if (!payload.body || String(payload.body).trim().length < 2) {
    errors.push('Message must be at least 2 characters.');
  }

  return errors;
}

module.exports = {
  buildConversationId,
  validateMessageInput,
};
