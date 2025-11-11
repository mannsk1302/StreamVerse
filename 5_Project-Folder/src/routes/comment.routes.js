const { Router } = require('express');
const {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
} = require("../controllers/comment.controller.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const router = Router();

router.route("/:videoId").post(verifyJWT, addComment);
router.route("/:videoId").get(verifyJWT, getVideoComments);
router.route("/:commentId").patch(verifyJWT, updateComment);
router.route("/:commentId").delete(verifyJWT, deleteComment);

module.exports = router;