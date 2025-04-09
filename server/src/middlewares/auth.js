const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const response = require("../utils/responses.utils");
const Admin = require("../models/Admin");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Role = require("../utils/roles");

dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 *  Auth Middleware
 *  Verifies JWT token and loads user into request object.
 */
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.unauthorize(res, "Authorization token missing or invalid");
        }

        const token = authHeader.split(" ")[1];
        const decodedData = jwt.verify(token, secret);

        const { _id, role } = decodedData;
        let user;

        switch (role) {
            case Role.Admin:
                user = await Admin.findOne({ _id, "tokens.token": token });
                break;
            case Role.Mentor:
                user = await Mentor.findOne({ _id, "tokens.token": token });
                break;
            case Role.Student:
                user = await Student.findOne({ _id, "tokens.token": token });
                break;
            default:
                return response.unauthorize(res, "Invalid role");
        }

        if (!user) {
            return response.notfound(res, "User not found", {});
        }

        if (user.isBanned) {
            return response.unauthorize(res, "Your account has been suspended");
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);
        response.unauthorize(res, "Unauthorized Access", {});
    }
};

module.exports = auth;
