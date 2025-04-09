const transporter = require("../config/nodemailer.js");
const dotenv = require("dotenv");

// email templates
const resetPasswordTemplate = require("../utils/email-templates/resetPassword");
const verifyEmailTemplate = require("../utils/email-templates/verifyEmail");
const inActivityEmailTemplate = require("../utils/email-templates/inactivityMail");
// templates for new notifications
const newPostTemplate = require("../utils/email-templates/newPost");
const newCommentTemplate = require("../utils/email-templates/newComment");
const mentorAssignedTemplate = require("../utils/email-templates/mentorAssigned");
const meetScheduledTemplate = require("../utils/email-templates/meetScheduled");
const offlineMessageTemplate = require("../utils/email-templates/offlineMessage");

dotenv.config();

module.exports = {

    sendPasswordResetMail: (token, email) => {
        const resetPasswordUrl = `${process.env.PUBLIC_URL}/resetPassword/${token}`;
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "Reset Password",
            html: resetPasswordTemplate(resetPasswordUrl)
        };

        return sendEmail(options);
    },

    sendEmailVerificationMail: (token, email) => {
        const verifyEmailLink = `${process.env.PUBLIC_URL}/verifyEmail/${token}`;
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "Email Verification",
            html: verifyEmailTemplate(verifyEmailLink)
        };

        return sendEmail(options);
    },

    sendInactivityEmail: (email) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "Less Activity Detected",
            html: inActivityEmailTemplate()
        };

        return sendEmail(options);
    },

    sendNewPostEmail: (email, postDetails) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "New Post Created",
            html: newPostTemplate(postDetails)
        };

        return sendEmail(options);
    },

    sendNewCommentEmail: (email, commentDetails) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "New Comment on Your Post",
            html: newCommentTemplate(commentDetails)
        };

        return sendEmail(options);
    },

    sendMentorAssignedEmail: (email, mentorDetails) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "Mentor Assigned",
            html: mentorAssignedTemplate(mentorDetails)
        };

        return sendEmail(options);
    },

    sendMeetScheduledEmail: (email, meetDetails) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "New Meeting Scheduled",
            html: meetScheduledTemplate(meetDetails)
        };

        return sendEmail(options);
    },

    sendOfflineMessageEmail: (email, messageDetails) => {
        if (!email) throw new Error("Email not provided");

        const options = {
            from: process.env.NODEMAILER_SENDER_EMAIL,
            to: email,
            subject: "New Message Received",
            html: offlineMessageTemplate(messageDetails)
        };

        return sendEmail(options);
    }
};

/**
 * Common function to send email
 * @param {Object} options 
 */
function sendEmail(options) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                reject(err);
            } else {
                console.log("Email sent:", info.response);
                resolve(info);
            }
        });
    });
}
