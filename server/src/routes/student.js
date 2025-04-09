const express = require("express");
const router = express.Router();

const Auth = require("../middlewares/auth");
const Authorize = require("../middlewares/authorize");
const Logger = require("../middlewares/logger");
const upload = require("../config/multer"); // multer config (if needed later)

const Role = require("../utils/roles");
const events = require("../utils/logEvents");
const studentController = require("../controllers/student.controller");

/**
 * Student Routes
 * 
 * Handles all student-related operations like profile management,
 * semester info, past education, and dashboard access.
 */

// Student login
router.post("/login", studentController.studentLoginHandler, Logger(events.LOGIN));

// Student signup
router.post("/signup", studentController.studentSignupHandler, Logger(events.SIGNUP));

// Student dashboard
router.get("/dashboard", Auth, Authorize(Role.Student), studentController.studentDashboardHandler);

// Get student profile
router.get("/profile", Auth, Authorize(Role.Student), studentController.getProfile);

// Edit student profile
router.patch(
    "/profile",
    Auth,
    Authorize(Role.Student),
    studentController.editProfile,
    Logger(events.PROFILE_UPDATED)
);

// Get all semester info
router.get("/semester", Auth, Authorize(Role.Student), studentController.getSemesterInfo);

// Add semester info
router.post(
    "/semester",
    Auth,
    Authorize(Role.Student),
    studentController.addSemesterInfo,
    Logger(events.UPDATED_SEMESTER)
);

// Delete semester info
router.delete(
    "/semester",
    Auth,
    Authorize(Role.Student),
    studentController.deleteSemesterInfo,
    Logger(events.DELETED_SEMESTER)
);

// Add or update past education info
router.post(
    "/pastEducation",
    Auth,
    Authorize(Role.Student),
    studentController.addPastEducation,
    Logger(events.UPDATED_PAST_EDUCATION)
);

// Get all past education info
router.get("/pastEducation", Auth, Authorize(Role.Student), studentController.getPastEducation);

// Get all students of a mentor
router.get(
    "/mentor/students",
    Auth,
    Authorize(Role.Student),
    studentController.getAllStudents
);

module.exports = router;
