const mongoose = require("mongoose");
const { DEFAULT_VALIDATION, URL } = require("../../../helpers/mongodb/mongooseValidators");
const { futureDate } = require("../../../helpers/time");

const bookSchema = new mongoose.Schema({
    title: DEFAULT_VALIDATION,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    // image: { ...URL, default: "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?t=st=1732100235~exp=1732103835~hmac=21e366c144bdedefd0d911459a2001ea8d506fa11e9b19f0a57e489ecceb1ea1&w=740" },
    image: URL,
    alt: {
        ...DEFAULT_VALIDATION,
        required: false,
        minLength: 0,
        default: ""
    },
    likes: [String],
    orders: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        userName: {
            ...DEFAULT_VALIDATION,
            required: false,
            minLength: 0,
        },
        orderDate: {
            type: Date,
            default: Date.now(),
        }
    }],
    inLibrary: { type: Boolean, default: true },
    bookInLibraryFrom: Date,
    borrowing: {
        borrowingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Borrowing',
        },
        finalDateToReturn: {
            type: Date,
            default: futureDate(14),
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

bookSchema.pre('save', function (next) {
    if (!this.alt) {
        this.alt = this.title;
    }
    next();
});

bookSchema.pre('save', function (next) {
    if (!this.image) {
        this.image = "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?t=st=1732100235~exp=1732103835~hmac=21e366c144bdedefd0d911459a2001ea8d506fa11e9b19f0a57e489ecceb1ea1&w=740";
    }
    next();
});

const Book = mongoose.model("book", bookSchema)
module.exports = Book;