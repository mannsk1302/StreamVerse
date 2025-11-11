const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const Tweet = require('../models/tweet.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { userId } = req.user._id;

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: userId
    });

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            "Tweet created successfully",
            { tweet }
        ))
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User ID");
    }

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Tweets fetched successfully",
            { tweets }
        ));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if(!tweetId){
        throw new ApiError(400, "Tweet ID is required");
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet ID");
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    tweet.content = content;
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Tweet updated successfully",
            { tweet }
        ));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if(!tweetId){
        throw new ApiError(400, "Tweet ID is required");
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Tweet deleted successfully",
            {}
        ));
});

module.exports = {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};