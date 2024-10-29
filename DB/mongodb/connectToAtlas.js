const mongoose = require("mongoose");
require("dotenv").config();

const connectionStringForAtlas = process.env.ATLAS_CONNECTION_STRING;

const connectToAtlaslDb = async () => {
    try {
        await mongoose.connect(connectionStringForAtlas);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
};
module.exports = connectToAtlaslDb;