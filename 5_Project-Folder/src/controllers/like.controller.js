const mongoose = require('mongoose');
const {isValidObjectId} = mongoose;
const Like = require('../models/like.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {userId} = req.user._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Video unliked successfully",
                {}
            )
        );
    }

    const like = await Like.create({
        video: videoId,
        likedBy: userId
    });

    return res
        .status(200)
        .json(new ApiResponse(
                200,
                "Video liked successfully",
                {like}
            )
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    const userId = req.user._id;

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, {}, "Comment unliked successfully")
        );
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            "Comment liked successfully",
            {like}
        ));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const userId = req.user._id;

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, {}, "Tweet unliked successfully")
        );
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(
                201,
                "Tweet liked successfully",
                {like}
            )
        );
});

const getVideoLikes = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const likes = await Like.find({video: videoId})
        .populate("likedBy", "name profilePicture");

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video likes fetched successfully",
            {
                totalLikes: likes.length,
                users: likes
            }
        ));
});

module.exports = {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getVideoLikes
};