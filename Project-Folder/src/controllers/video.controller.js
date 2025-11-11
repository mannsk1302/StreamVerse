const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const Video = require('../models/video.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};

    if(query){
        filter.title = {
            $regex: query,
            $options: "i"
        };
    }

    const videos = await Video.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate("owner", "username avatar");

    const totalVideos = await Video.countDocuments(filter);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Videos fetched successfully",
            {
                videos,
                totalVideos,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalVideos / limitNumber)
            }
        ));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if(!title || title.trim() === ""){
        throw new ApiError(400, "Title is required");
    }

    if(!req.files || req.files.video || req.files.thumbnail){
        throw new ApiError(400, "Video and thumbnail are required");
    }

    const videoFilePath = req.files.video[0].path;
    const thumbnailFilePath = req.files.thumbnail[0].path;

    const video = await Video.create({
        title,
        description,
        owner: req.user._id,
        video: videoFilePath,
        thumbnail: thumbnailFilePath,
        isPublished: true
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            "Video published successfully",
            { video }
        ));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username avatar");

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video fetched successfully",
            { video }
        ))
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to edit this video");
    }

    if(title && title.trim() !== ""){
        video.title = title;
    }

    if(description && description.trim() !== ""){
        video.description = description;
    }

    if(req.file){
        video.thumbnail = req.file.path;
    }

    await video.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video updated successfully",
            { video }
        ));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video deleted successfully",
            {}
        ));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You do not have permission to toggle publish status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Publish status toggled successfully",
            { video }
        ));
});

module.exports = {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};