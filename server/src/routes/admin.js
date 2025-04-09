const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Logger = require("../middlewares/logger");

const adminController = require("../controllers/admin.controller");
const Role = require("../utils/roles");
const events = require("../utils/logEvents");

/**
 * All admin routes are defined here.
 * 
 * Protected routes use Auth and Authorize middlewares to ensure that
 * only admins can perform specific actions on the admin dashboard.
 */

// Admin login
router.post("/login", adminController.adminLoginHandler, Logger(events.LOGIN));

// Admin dashboard
router.get("/dashboard", Auth, Authorize(Role.Admin), adminController.adminDashboardHandler);

// Get all mentors and students
router.get("/getAllUsers", Auth, Authorize(Role.Admin), adminController.getAllUsers);

// Save student-mentor groups
router.post(
    "/saveGroup",
    Auth,
    Authorize(Role.Admin),
    adminController.saveGroup,
    Logger(events.GROUP_UPDATE)
);

// Assign mentees
router.post(
    "/assignMentees",
    Auth,
    Authorize(Role.Admin),
    adminController.assignMentees,
    Logger(events.GROUP_UPDATE)
);

// Remove mentees
router.post(
    "/removeMentees",
    Auth,
    Authorize(Role.Admin),
    adminController.removeMentees,
    Logger(events.GROUP_UPDATE)
);

// Admin profile
router.get("/profile", Auth, Authorize(Role.Admin), adminController.getProfile);

// Update admin profile
router.post("/profile", Auth, Authorize(Role.Admin), adminController.updateProfile);

// Ban a user
router.patch("/banUser", Auth, Authorize(Role.Admin), adminController.banUser);

// Get all interactions
router.get("/interactions", Auth, Authorize(Role.Admin), adminController.getAllInteractions);

module.exports = router;
