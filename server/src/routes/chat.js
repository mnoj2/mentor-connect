const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");

const chatController = require("../controllers/chat.controller");

/**
 * All chat-related routes are defined here.
 * 
 * Only Mentors and Students are authorized to access these routes.
 */

// Create a new chat
router.post(
    "/",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    chatController.createNewChat
);

// Fetch all chats
router.get(
    "/",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    chatController.fetchAllChats
);

module.exports = router;
