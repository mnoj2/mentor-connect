const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const roles = require("../utils/roles");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

// Importing controllers
const indexController = require("../controllers/index.controller");
const interactionsController = require("../controllers/interaction.controller");

// Importing multer config
const upload = require("../config/multer");

/**
 * This file contains all routes shared by all users (Mentor, Student, Admin).
 */

// Get user info by ID (Mentor/Student)
router.get(
    "/user/:id",
    Auth,
    Authorize([roles.Mentor, roles.Student]),
    indexController.userInfoHandler
);

// Email verification
router.get("/verifyEmail/:token", indexController.emailVerificationHandler);

// Forgot Password
router.post("/forgotPassword", indexController.forgotPassword);

// Reset Password - HTML page
router.get("/resetPassword/:token", indexController.resetPassword);

// Reset Password - Set new password
router.post("/resetPassword/:token", indexController.setNewPassword);

// Edit or Change Avatar
router.post(
    "/avatar",
    Auth,
    Authorize([roles.Mentor, roles.Student]),
    upload.single("avatar"),
    indexController.editAvatar,
    Logger(events.AVATAR_UPDATED)
);

// Remove Avatar/Profile Image
router.delete(
    "/avatar",
    Auth,
    Authorize([roles.Mentor, roles.Student]),
    indexController.deleteAvatar,
    Logger(events.AVATAR_UPDATED)
);

// Get all Holidays
router.get(
    "/holidays",
    Auth,
    Authorize([roles.Mentor, roles.Student]),
    indexController.getAllHolidays
);

// Get Stats (Admin/Mentor/Student)
router.get(
    "/getStats",
    Auth,
    Authorize([roles.Admin, roles.Mentor, roles.Student]),
    indexController.getStats
);

// Fetch all Logs
router.get(
    "/logs",
    Auth,
    Authorize([roles.Admin, roles.Mentor, roles.Student]),
    indexController.getAllLogs
);

// Fetch all Interactions
router.get(
    "/interactions",
    Auth,
    Authorize([roles.Admin, roles.Mentor, roles.Student]),
    interactionsController.getAllInteractions
);

// Get Interaction Summary
router.get(
    "/interactions/summary",
    Auth,
    Authorize([roles.Admin, roles.Mentor, roles.Student]),
    indexController.getInteractionsSummary_v2
);

// Verify CAPTCHA
router.post("/verifyCaptcha", indexController.verifyCaptcha);

module.exports = router;
