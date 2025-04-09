module.exports = function meetScheduledTemplate(data) {
  return `
    <h1>Meeting Scheduled</h1>
    <p>A new meeting has been scheduled.</p>
    <p>Date: ${data.date}</p>
    <p>Time: ${data.time}</p>
    <p>With: ${data.withWhom}</p>
  `;
};
