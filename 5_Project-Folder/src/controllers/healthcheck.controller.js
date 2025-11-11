const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');
const mongoose = require("mongoose");

const healthcheck = asyncHandler( async (req, res) => {

    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Healthcheck successful",
            {
                status: "OK",
                server: "Running",
                database: dbStatus,
                timestamp: new Date(),
            }
        ));
});

module.exports = { healthcheck };