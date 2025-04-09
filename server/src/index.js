const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { Server } = require("socket.io");
const socket = require("./socket/socket");
const dotenv = require("dotenv");
const Chat = require("./models/Chat"); 

// middlewares
const { rateLimiter } = require("./middlewares/rateLimiter"); 

// mongoose config
require("./config/mongoose");

// env config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allows cross-origin requests
app.use(cors({
    origin: process.env.CLIENT_PUBLIC_URL,
    methods: ["GET", "POST"],
    credentials: true,
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// trust proxy (needed if hosted behind proxies like Render)
app.set("trust proxy", true);
app.set("view engine", "hbs");

// HTTP request logging
if (process.env.NODE_ENV !== "production") {
    app.use(
        morgan("combined", {
            stream: fs.createWriteStream("./logs/access.log", { flags: "a" }),
        })
    );
}
app.use(morgan("dev"));

// apply rate limiter middleware
app.use(rateLimiter);

// serve static files
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

// import routes
const adminRoutes = require("./routes/admin");
const mentorRoutes = require("./routes/mentor");
const studentRoutes = require("./routes/student");
const indexRoutes = require("./routes/index");
const postRoutes = require("./routes/post");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const notificationRoutes = require("./routes/notification");
const meetingRoutes = require("./routes/meeting");

// use routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/mentor", mentorRoutes);
app.use("/student", studentRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/meetings", meetingRoutes);

// 404 fallback
app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// start server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// setup socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_PUBLIC_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// global socket maps
global.msgSocketMap = {};
global.notifySocketMap = {};

// start socket handling
socket.start(io);

// load cron jobs
require("./crons/interaction.cron");
