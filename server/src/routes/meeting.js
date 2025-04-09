const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const roles = require("../utils/roles");

// Import controller
const meetingController = require("../controllers/meeting.controller");

/**
 * Meeting routes for Mentors and Students
 */

// Get all meetings
router.get(
    "/",
    Auth,
    Authorize([roles.Mentor, roles.Student]),
    meetingController.getAllMeetings
);

// Create a new meeting (Mentors only)
router.post(
    "/",
    Auth,
    Authorize([roles.Mentor]),
    meetingController.createMeeting
);

// Update a meeting (Mentors only)
router.patch(
    "/:id",
    Auth,
    Authorize([roles.Mentor]),
    meetingController.updateMeeting
);

// Update meeting minutes (Mentors only)
router.patch(
    "/:id/minutes",
    Auth,
    Authorize([roles.Mentor]),
    meetingController.updateMinutes
);

module.exports = router;
