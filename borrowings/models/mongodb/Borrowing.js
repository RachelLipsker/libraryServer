const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../../helpers/mongodb/mongooseValidators");
const { futureDate } = require("../../../helpers/time");

const schema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    bookName: DEFAULT_VALIDATION,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: DEFAULT_VALIDATION,
    borrowingDate: {
        type: Date,
        default: Date.now()
    },
    finalDateToReturn: {
        type: Date,
        default: futureDate(14)
    },
    returnDate: { type: Date, default: null }
});

const Borrowing = mongoose.model("borrowing", schema);

module.exports = Borrowing;