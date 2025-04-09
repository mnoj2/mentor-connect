const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");
const mentorController = require("../controllers/mentor.controller");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

/**
 * All Mentor routes are in this file.
 * 
 * Protected routes use the Authorize middleware to ensure only Mentors access them.
 * 
 * This prevents unauthorized users from accessing Mentor-specific functionalities.
 */

// Mentor login
router.post(
    "/login",
    mentorController.mentorLoginHandler,
    Logger(events.LOGIN)
);

// Mentor signup
router.post(
    "/signup",
    mentorController.mentorSignupHandler,
    Logger(events.SIGNUP)
);

// Mentor dashboard
router.get(
    "/dashboard",
    Auth,
    Authorize(Role.Mentor),
    mentorController.mentorDashboardHandler
);

// Get all mentees (students assigned to mentor)
router.get(
    "/getAllMentees",
    Auth,
    Authorize(Role.Mentor),
    mentorController.fetchAllMentees
);

// Get all semester information of a mentee
router.get(
    "/getSemesters/:id",
    Auth,
    Authorize(Role.Mentor),
    mentorController.fetchStudentSemesters
);

// Update mentor profile
router.post(
    "/profile",
    Auth,
    Authorize(Role.Mentor),
    mentorController.updateProfile
);

// Get mentor profile
router.get(
    "/profile",
    Auth,
    Authorize(Role.Mentor),
    mentorController.getProfile
);

module.exports = router;
