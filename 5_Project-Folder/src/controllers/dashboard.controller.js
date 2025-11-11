const mongoose = require('mongoose');
const Video = require('../models/video.model.js');
const User = require('../models/user.model.js');
const Subscription = require('../models/subscription.model.js');
const Like = require('../models/like.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "Channel not found");
    }

    const videos = await Video.find({
        owner: userId
    });

    const totalVideos = videos.length;
    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

    const totalLikes = await Like.countDocuments({
        like: userId
    });

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    const totalSubscribedTo = await Subscription.countDocuments({
        subscriber: userId
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
                totalSubscribers,
                totalSubscribedTo
            },
            "Channel stats fetched successfully"
        ));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalVideos = await Video.countDocuments({
        owner: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVideos / limitNumber)
        }, "Channel videos fetched successfully")
    );
});

module.exports = {
    getChannelStats,
    getChannelVideos
};