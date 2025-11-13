const mongoose = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const { isValidObjectId } = mongoose;
const Video = require('../models/video.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

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

const getVideoDuration = (filePath) => {
    return new Promise((res, rej) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return rej(err);
            res(metadata.format.duration);
        });
    });
};

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    // Local file paths
    const localVideoPath = req.files.videoFile[0].path;
    const localThumbnailPath = req.files.thumbnail[0].path;

    // Get duration
    const duration = await getVideoDuration(localVideoPath);

    // Upload to cloudinary
    const uploadedVideo = await uploadOnCloudinary(localVideoPath);
    const uploadedThumbnail = await uploadOnCloudinary(localThumbnailPath);

    if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
        throw new ApiError(500, "Failed to upload media to Cloudinary");
    }

    // Create DB entry
    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration,
        owner: req.user._id,
        isPublished: true,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { video },
            "Video published successfully"
        )
    );
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