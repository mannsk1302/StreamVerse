const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://stream-verse-bice.vercel.app", // ✅ your frontend URL
    "http://localhost:5173"] || '*', // Allow your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options("*", cors());

app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

app.use(express.static('public'));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("StreamVerse Backend is Running Successfully on Render!");
});

// Routes import
const userRouter = require('./routes/user.routes.js');
const commentRouter = require('./routes/comment.routes.js');
const videoRouter = require('./routes/video.routes.js');
const likeRouter = require('./routes/like.routes.js');
const tweetRouter = require('./routes/tweet.routes.js');
const subscriptionRouter = require('./routes/subscription.routes.js');
const playlistRouter = require('./routes/playlist.routes.js');
const healthcheckRouter = require('./routes/healthcheck.routes.js');
const dashboardRouter = require('./routes/dashboard.routes.js');

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/dashboard", dashboardRouter);

module.exports = app;