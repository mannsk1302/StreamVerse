const { Router } = require("express");

const {
    getChannelStats,
    getChannelVideos
} = require("../controllers/dashboard.controller.js");

const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/stats")
    .get(verifyJWT, getChannelStats);

router.route("/videos/:channelId")
    .get(verifyJWT, getChannelVideos);

module.exports = router;
