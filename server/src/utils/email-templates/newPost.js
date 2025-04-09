module.exports = function newPostTemplate(data) {
  return `
    <h1>New Post Created</h1>
    <p>Title: ${data.title}</p>
    <p>Description: ${data.description}</p>
  `;
};
