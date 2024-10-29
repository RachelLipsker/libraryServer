const mongoose = require("mongoose");
const { DEFAULT_VALIDATION, PHONE, EMAIL, URL } = require("../../../helpers/mongodb/mongooseValidators");
const { futureDate } = require("../../../helpers/time");

const schema = new mongoose.Schema({
    firstName: DEFAULT_VALIDATION,
    lastName: DEFAULT_VALIDATION,
    phone: PHONE,
    email: EMAIL,
    password: {
        type: String,
        required: true,
        trim: true,
    },
    image: { ...URL, default: "https://drive.google.com/file/d/15ZkAXpCUoQrvYhshN-6loEzbsopIGD0f/view?usp=sharing" },
    alt: {
        ...DEFAULT_VALIDATION,
        required: false,
        minLength: 0,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    booksToBorrowing: {
        type: Number,
        default: 2
    },
    booksToOrder: {
        type: Number,
        default: 2
    },
    openBorrowings: [{
        borrowingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Borrowing',
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
        bookTitle: DEFAULT_VALIDATION,
        bookImage: URL,
        bookAlt: {
            ...DEFAULT_VALIDATION,
            required: false,
            minLength: 0,
            default: ""
        },
        finalDateToReturn: {
            type: Date,
            default: futureDate(14)
        }
    }],
    orders: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
        bookTitle: DEFAULT_VALIDATION,
        bookImage: URL,
        bookAlt: {
            ...DEFAULT_VALIDATION,
            required: false,
            minLength: 0,
            default: ""
        },
        orderDate: {
            type: Date,
            default: Date.now(),
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

schema.pre('save', function (next) {
    if (!this.alt) {
        this.alt = this.firstName + " " + this.lastName;
    }
    next();
});

const User = mongoose.model("user", schema);

module.exports = User;


