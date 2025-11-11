require('dotenv').config({ path: './.env' });
const connectDB = require('./db/index.js');
const app = require('./app.js');

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
    })
    .catch((error) => {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    });





























/*
const express = require('express');

const app = express();

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("Error", (error) => {
            console.log("Error: ", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log("Server is running on port: ", process.env.PORT);
        })


    } catch (error) {
        console.error("ERROR: ", error);
        throw error;
    }
})()


 */