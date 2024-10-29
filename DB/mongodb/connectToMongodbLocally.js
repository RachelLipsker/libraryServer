const mongoose = require("mongoose");

const connectToLocalDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/libraryServer");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
};

module.exports = connectToLocalDb;