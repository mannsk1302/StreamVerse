const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const Playlist = require('../models/playlist.model.js');
const Video = require('../models/video.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videos } = req.body;
    const { userId } = req.user._id;

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId,
        videos: []
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            "Playlist created successfully",
            { playlist }
        ));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
    const { userId } = req.user._id;

    const playlists = await Playlist.find({
        owner: userId
    }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "User playlists fetched successfully",
            { playlists }
        ));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail")
        .populate("owner", "name profilePicture")

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Playlist fetched successfully",
            { playlist }
        ));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Playlist ID or Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to edit this playlist");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    if(playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video added to playlist successfully",
            { playlist }
        ));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Playlist ID or Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to edit this playlist");
    }

    playlist.videos = playlist.videos.filter(
        id => id.toString() !== videoId
    );

    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video removed from playlist successfully",
            { playlist }
        ));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Playlist deleted successfully",
            {}
        ));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description, videos } = req.body;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to edit this playlist");
    }

    if(name && name.trim() !== ""){
        playlist.name = name;
    }

    if(description && description.trim() !== ""){
        playlist.description = description;
    }

    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Playlist updated successfully",
            { playlist }
        ));
});

module.exports = {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};