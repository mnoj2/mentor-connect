module.exports = function newCommentTemplate(data) {
  return `
    <h1>New Comment Added</h1>
    <p>Post Title: ${data.postTitle}</p>
    <p>Comment: ${data.comment}</p>
  `;
};
