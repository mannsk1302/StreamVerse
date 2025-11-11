const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const Subscription = require('../models/subscription.model.js');
const User = require('../models/user.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.user._id;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID");
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User ID");
    }

    if(channelId === userId.toString()){
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existingSubscriber = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    });

    if(existingSubscriber){
        await Subscription.findByIdAndDelete(existingSubscriber._id);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                "Channel unsubscribed successfully",
                {}
            ));
    }

    const subscription = await Subscription.create({
        channel: channelId,
        subscriber: userId
    });

    return res
        .json(new ApiResponse(
            200,
            "Channel subscribed successfully",
            { subscription }
        ));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID");
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "name profilePicture");

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Subscribers fetched successfully",
            {
                totalSubscribers: subscribers.length,
                subscribers
            }
        ));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User ID");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: userId
    }).populate("channel", "name profilePicture");

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Subscribed channels fetched successfully",
            {
                totalSubscribedChannels: subscribedChannels.length,
                channels: subscribedChannels
            }
        ));
});

module.exports = {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};