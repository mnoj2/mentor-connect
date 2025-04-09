/**
 * This module handles all the socket-related code
 */
const { Types: { ObjectId } } = require("mongoose");
const roles = require("../utils/roles");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// env config
dotenv.config();

module.exports = {
    start: function (io) {
        // Optional: Socket Authentication Middleware
        // io.use(async (socket, next) => {
        //     try {
        //         const token = socket.handshake.auth.token || socket.handshake.query.auth;
        //         if (!token) {
        //             throw new Error("Auth token not provided");
        //         }

        //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //         let user = null;

        //         if (decoded.role === roles.Mentor) {
        //             user = await Mentor.findOne({
        //                 _id: decoded._id,
        //                 "tokens.token": token,
        //             });
        //         }

        //         if (decoded.role === roles.Student) {
        //             user = await Student.findOne({
        //                 _id: decoded._id,
        //                 "tokens.token": token,
        //             });
        //         }

        //         if (!user) {
        //             throw new Error("Authentication failed");
        //         }

        //         socket.user = user;
        //         next();
        //     } catch (err) {
        //         console.log("Socket Authentication Error:", err.message);
        //         next(new Error("Authentication error"));
        //     }
        // });

        io.on("connection", (socket) => {
            console.log("Connected to socket:", socket.id);

            // On disconnect
            socket.on("disconnect", () => {
                if (socket.user?._id) {
                    delete msgSocketMap[socket.user._id];
                    delete notifySocketMap[socket.user._id];
                }
                console.log("Socket disconnected:", socket.id);
            });

            // Setup message socket
            socket.on("setup", (userId) => {
                if (userId) {
                    socket.join(userId);
                    msgSocketMap[String(userId)] = socket.id;
                    socket.emit("connected");
                    console.log("User setup complete, msgSocketMap:", msgSocketMap);
                }
            });

            // New Message Event
            socket.on("newMessage", async (newMessage) => {
                try {
                    if (!newMessage?.data?.chat?._id) {
                        console.error("Chat ID missing in newMessage");
                        return;
                    }

                    const users = newMessage.data.chat.users;
                    const receiver = users.find(
                        (item) => item.user._id.toString() !== newMessage.data.sender._id.toString()
                    );

                    if (receiver && msgSocketMap[receiver.user._id]) {
                        io.to(msgSocketMap[receiver.user._id]).emit("message received", newMessage);
                    }
                } catch (error) {
                    console.error("Error in newMessage socket event:", error);
                }
            });

            // New Notification Event
            socket.on("newNotification", async (content) => {
                try {
                    const notification = await Notification.findOne({ content: content._id })
                        .populate(["content", "creator", "receivers.user"]);

                    if (notification) {
                        notification.receivers.forEach((receiver) => {
                            if (receiver.user._id.toString() === notification.creator._id.toString()) {
                                return; // Don't notify creator
                            }

                            const receiverSocketId = msgSocketMap[receiver.user._id];
                            if (receiverSocketId) {
                                io.to(receiverSocketId).emit("new Notification", notification);
                            }
                        });
                    }
                } catch (err) {
                    console.error("Error sending newNotification:", err);
                }
            });

            // (Optional) Notify setup event
            // socket.on("notify setup", (userId) => {
            //     if (userId) {
            //         socket.join(userId);
            //         notifySocketMap[String(userId)] = socket.id;
            //         console.log("Notification socket map updated:", notifySocketMap);
            //     }
            // });
        });
    },
};
