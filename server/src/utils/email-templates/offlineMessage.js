module.exports = function offlineMessageTemplate(data) {
  return `
    <h1>Offline Message Received</h1>
    <p>${data.name} has left you a message while you were offline.</p>
    <p>Message: ${data.message}</p>
    <p>Contact: ${data.contactInfo}</p>
  `;
};
