const { Router } = require("express");

const {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getVideoLikes
} = require("../controllers/like.controller.js");

const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/video/:videoId")
    .patch(verifyJWT, toggleVideoLike)
    .get(verifyJWT, getVideoLikes);

router.route("/comment/:commentId")
    .patch(verifyJWT, toggleCommentLike);

router.route("/tweet/:tweetId")
    .patch(verifyJWT, toggleTweetLike);

module.exports = router;