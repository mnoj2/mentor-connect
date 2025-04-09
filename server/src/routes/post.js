const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Roles = require("../utils/roles");
const GroupChecker = require("../middlewares/groupChecker");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

// Importing controllers
const postController = require("../controllers/post.controller");

/**
 * Post Routes
 * 
 * This file manages all post and comment operations
 */

// Create a new post
router.post(
    "/",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.createNewPost,
    Logger(events.POST_CREATED)
);

// Get all posts
router.get(
    "/",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.fetchAllPosts
);

// Edit a post by ID
router.patch(
    "/:id",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.editPostById,
    Logger(events.POST_UPDATED)
);

// Delete a post by ID
router.delete(
    "/:id",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.deletePostById,
    Logger(events.POST_DELETED)
);

// Add a new comment to a post
router.post(
    "/:id/comment",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.addNewComment,
    Logger(events.COMMENT_CREATED)
);

// Fetch all comments on a post
router.get(
    "/:id/comments",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.fetchAllComments
);

// Delete a comment by comment ID
router.delete(
    "/comment/:id",
    Auth,
    Authorize([Roles.Mentor, Roles.Student]),
    GroupChecker,
    postController.deleteCommentById,
    Logger(events.COMMENT_DELETED)
);

module.exports = router;
