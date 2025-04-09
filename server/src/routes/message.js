const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");

// Import message controller
const messageController = require("../controllers/message.controller");

/**
 * Message Routes
 * 
 * These routes allow mentors and students to send and retrieve messages.
 */

// Create a new message
router.post(
    "/",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    messageController.createNewMessage
);

// Fetch all messages from a specific chat
router.get(
    "/:chatId",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    messageController.fetchAllMessage
);

module.exports = router;
