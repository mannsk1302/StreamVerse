const { Router } = require("express");

const {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} = require("../controllers/subscription.controller.js");

const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/toggle/:channelId")
    .patch(verifyJWT, toggleSubscription);

router.route("/subscribers/:channelId")
    .get(verifyJWT, getUserChannelSubscribers);

router.route("/subscribed")
    .get(verifyJWT, getSubscribedChannels);

module.exports = router;