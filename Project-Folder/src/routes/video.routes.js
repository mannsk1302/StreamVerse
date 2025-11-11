const { Router } = require('express');

const {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} = require("../controllers/video.controller.js");

const { upload } = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/")
    .get(verifyJWT, getAllVideos)
    .post(verifyJWT, upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]), publishAVideo);

router.route("/:videoId")
    .get(verifyJWT, getVideoById)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .delete(verifyJWT, deleteVideo);

router.route("/toggle/publish/:videoId")
    .patch(verifyJWT, togglePublishStatus);

module.exports = router;