module.exports = function mentorAssignedTemplate(data) {
  return `
    <h1>Mentor Assigned</h1>
    <p>You have been assigned a mentor!</p>
    <p>Mentor Name: ${data.mentorName}</p>
  `;
};
