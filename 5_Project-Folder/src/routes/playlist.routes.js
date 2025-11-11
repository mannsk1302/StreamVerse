const { Router } = require("express");

const {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} = require("../controllers/playlist.controller.js");

const verifyJWT = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/")
    .post(verifyJWT, createPlaylist)
    .get(verifyJWT, getUserPlaylist);

router.route("/:playlistId")
    .get(verifyJWT, getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);

router.route("/:playlistId/video/:videoId")
    .post(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);

module.exports = router;