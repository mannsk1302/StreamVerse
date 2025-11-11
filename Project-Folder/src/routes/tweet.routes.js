const { Router } = require("express");

const {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} = require("../controllers/tweet.controller.js");

const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/")
    .post(verifyJWT, createTweet);

router.route("/:userId")
    .get(verifyJWT, getUserTweets);

router.route("/t/:tweetId")
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet);

module.exports = router;