const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");

// Import notification controller
const notificationController = require("../controllers/notification.controller");

/**
 * Notification Routes
 * 
 * These routes allow mentors and students to manage notifications.
 */

// Get all notifications
router.get(
    "/",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    notificationController.getAllNotifications
);

// Get notification by ID
router.get(
    "/:id",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    notificationController.getNotificationById
);

// Mark notifications as read
router.post(
    "/read",
    Auth,
    Authorize([Role.Mentor, Role.Student]),
    notificationController.setNotificationAsRead
);

module.exports = router;
