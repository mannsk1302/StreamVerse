const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const Comment = require('../models/comment.model.js');
const ApiResponse = require('../utils/ApiResponse.js');

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { content } = req.body;

    if(!videoId){
        throw new ApiError(400, "Video ID is required");
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        video: videoId,
        content,
        owner: req.user._id
    });

    if(!comment){
        throw new ApiError(500, "Failed to add comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Comment added successfully",
            { comment }
        ));
});

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if(!videoId){
        throw new ApiError(400, "Video ID is required");
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video ID");
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "name profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalComments = await Comment.countDocuments({ video: videoId });

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalComments / limitNumber)
        }, "Comments fetched successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const { content } = req.body;

    if(!commentId){
        throw new ApiError(400, "Comment ID is required");
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment ID");
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content;
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Comment updated successfully",
            { comment }
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if(!commentId){
        throw new ApiError(400, "Comment ID is required");
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment ID");
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Comment deleted successfully",
            {}
        )
    );
});

module.exports = {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
};