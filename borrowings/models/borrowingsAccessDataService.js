const mongoose = require("mongoose");
const config = require("config");
const Borrowing = require("./mongodb/Borrowing");
const Book = require("../../books/models/mongodb/Book");
const User = require("../../users/models/mongodb/User");
const { createError } = require("../../utils/handleErrors");
const { isMoreThanDays } = require("../../helpers/time");
const DB = config.get("DB");


const toBorrwing = async (userId, bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId);
            let user = await User.findById(userId);

            let newBorrowing = {
                bookId: new mongoose.Types.ObjectId(bookId),
                bookName: book.title,
                userId: new mongoose.Types.ObjectId(userId),
                userName: user.firstName + " " + user.lastName
            };
            let borrowing = new Borrowing(newBorrowing)
            borrowing = await borrowing.save();

            book.inLibrary = false;
            book.borrowing = { borrowingId: borrowing._id };
            await book.save();

            let borrowingToUser = {
                borrowingId: borrowing._id,
                bookId: new mongoose.Types.ObjectId(bookId),
                bookTitle: book.title,
                bookImage: book.image,
                bookAlt: book.alt,
            };
            user.openBorrowings.push(borrowingToUser)
            await user.save();

            return { user, book, borrowing }
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const createBorrwing = async (userId, bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId);
            let user = await User.findById(userId);

            if (!book.inLibrary) {
                createError("Mongoose", new Error("the book is not in library"))
            }
            if (user.booksToBorrowing <= user.openBorrowings.length) {
                createError("Mongoose", new Error("user can't borrow"))
            }

            //טיפול בהזמנות
            // for (let i = 0; i < book.orders.length; i++) {
            //     if (book.orders[i].userId.toString() == userId.toString() ||
            //         (isMoreThanDays(book.bookInLibraryFrom, 2) && isMoreThanDays(book.orders[i].orderDate, 2))) {
            //         //הסרת הההזמנה
            //         book.orders.splice(i, 1);
            //  await book.save();
            //         for (let j = 0; j < user.orders.length; j++) {
            //             if (user.orders[j].bookId.toString() == bookId.toString()) {
            //                 user.orders.splice(j, 1);
            //                 await user.save();
            //                 break;
            //             };
            //         }
            //         return toBorrwing(userId, bookId);
            //     } else {
            //         createError("Mongoose", new Error("the book is ordered"))
            //     }
            // }

            if (book.orders?.length == 0) {
                return toBorrwing(userId, bookId);
            }

            if (book.orders[0].userId.toString() == userId) {
                book.orders.shift();
                await book.save();
                for (let j = 0; j < user.orders.length; j++) {
                    if (user.orders[j].bookId.toString() == bookId.toString()) {
                        user.orders.splice(j, 1);
                        await user.save();
                        return toBorrwing(userId, bookId);
                    };
                }
            } else {
                createError("Mongoose", new Error("the book is ordered"))
            }

            //return toBorrwing(userId, bookId);
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const returnbook = async (userId, bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId);
            let user = await User.findById(userId);
            if (book.inLibrary) {
                createError("Mongoose", new Error("the book in library"))
            }

            let borrowingIdFromBook = book.borrowing.borrowingId;

            let ableToReturn = false;
            for (let i = 0; i < user.openBorrowings.length; i++) {
                if (user.openBorrowings[i].bookId.toString() == book._id.toString() && user.openBorrowings[i].borrowingId.toString() == borrowingIdFromBook.toString()) {
                    ableToReturn = true;
                    user.openBorrowings.splice(i, 1);
                    break;
                }
            }
            await user.save()

            if (!ableToReturn) {
                createError("Mongoose", new Error("the user didnt borrow this book"))
            }

            let borrowing = await Borrowing.findById(borrowingIdFromBook);
            borrowing.returnDate = Date.now();
            await borrowing.save();


            book.inLibrary = true;
            book.bookInLibraryFrom = Date.now();
            await book.save();

            return { user, book, borrowing }
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const getBorrowing = async (borrowingId) => {
    if (DB == "mongodb") {
        try {
            let borrowing = await Borrowing.findById(borrowingId);
            return borrowing;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const getUserBorrowings = async (userId) => {
    if (DB == "mongodb") {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            let borrowings = await Borrowing.find({ userId });
            return borrowings;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const getLastUserBorrowings = async (userId) => {
    if (DB == "mongodb") {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            let borrowings = await Borrowing.find({ userId })
                .sort({ borrowingDate: -1 })
                .limit(10);

            return borrowings;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const getBorrowings = async () => {
    if (DB == "mongodb") {
        try {
            let borrowings = await Borrowing.find();
            return borrowings;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const getOpenBorrowings = async () => {
    if (DB == "mongodb") {
        try {
            let borrowings = await Borrowing.find({ returnDate: null });
            return borrowings;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const getLateBorrowings = async () => {
    if (DB == "mongodb") {
        try {
            let borrowings = await Borrowing.find({ returnDate: null });
            let lateBorrowings = borrowings.filter((borrowing) => {
                return isMoreThanDays(borrowing.borrowingDate, 14)
            });
            return lateBorrowings;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

module.exports = { createBorrwing, returnbook, getBorrowing, getUserBorrowings, getBorrowings, getOpenBorrowings, getLastUserBorrowings, getLateBorrowings }