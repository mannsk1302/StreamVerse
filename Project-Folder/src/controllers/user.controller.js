const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary.js');
const ApiResponse = require('../utils/ApiResponse.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require("path")

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh token.");
    }
};

const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    const { fullName, email, username, password } = req.body;
    // console.log("email: ", email);

    // validation - not empty
    if(
        [ fullName, email, username, password ].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "User Details are required");
    }

    // check if user already exist?: username, email
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path
        ? path.resolve(req.files.avatar[0].path)
        : null;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath = null;

    if (req.files?.coverImage?.[0]?.path) {
        coverImageLocalPath = path.resolve(req.files.coverImage[0].path);
    }

    if(!avatarLocalPath){
        throw new ApiError(403, "No avatar local path");
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(403, "No avatar local path");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    });

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while retrieving this user.");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
             200,
            "User registered successfully",
            { user: createdUser }
        ));
});

const loginUser = asyncHandler( async (req, res) => {

    // req body -> data
    const { email, username, password } = req.body;

    // username or email
    if(!(username || email)){
        throw new ApiError(403, "Username or email is required");
    }

    // find the user
    const user = await User.findOne({
        $or: [
            { email }, { username }
        ]
    });

    if(!user){
        throw new ApiError(403, "No user found");
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    // access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    // send cookie
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                "Success",
                {
                    user: loggedInUser, accessToken, refreshToken
                }
            )
        );
});

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            200,
            "User logged out Successfully",
            {}
        ));
});

const refreshAccessToken = asyncHandler( async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(403, "Invalid refresh token");
        }

        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(403, "Refresh token is expired or used!");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    "Success",
                    {
                        accessToken: accessToken,
                        refreshToken: newRefreshToken
                    }
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(403, "Incorrect old password");
    }

    user.password = newPassword;

    await user.save({
        validateBeforeSave: false
    });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Your password has been changed successfully",
            {}
        ));
});

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Current user fetched successfully",
            {user: req.user}
        ));
});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const updates = {};

    const { fullName, email } = req.body;

    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No fields provided for update");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updates },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Details updated successfully",
            { user: user }
        ));
});

const updateUserAvatar = asyncHandler( async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(403, "Invalid avatar local path");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(403, "Error while uploading avatar");
    }

    const currentUser = await User.findById(req.user?._id);

    const oldAvatarUrl = currentUser?.avatar;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    if (!oldAvatarUrl){
        try {
            const urlParts = oldAvatarUrl.split("/");
            const fileName = urlParts.pop();
            const folder = urlParts.pop();
            const publicId = `${folder}/${fileName.split(".")[0]}`;
            await deleteFromCloudinary(folder);
        } catch (error) {
            console.log("Failed to delete old avatar: ", error.message);
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Avatar updated successfully",
            { user: user }
        ));
});

const updateUserCoverImage = asyncHandler( async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(403, "Cover image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(403, "An error occurred while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Cover image updated successfully",
            { user: user }
        ));
});

const getUserChannelProfile = asyncHandler( async (req, res) => {

    const { username } = req.params;

    if(!username?.trim()){
        throw new ApiError(403, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "subscribedTo",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                coverImage: 1,
                avatar: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    if(!channel?.length){
        throw new ApiError(403, "No channel found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "User channel fetched successfully",
            {
                user: channel[0]
            }
        ));
});

const getWatchHistory = asyncHandler( async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "Video",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Watch history fetched successfully",
            { user: user[0].watchHistory }
        ));
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};