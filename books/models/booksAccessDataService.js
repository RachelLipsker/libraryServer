const config = require("config");
const _ = require("lodash");
const { createError } = require("../../utils/handleErrors");
const Book = require("./mongodb/Book");
const User = require("../../users/models/mongodb/User");
const DB = config.get("DB");
const mongoose = require("mongoose")

const createBook = async (newBook) => {
    if (DB == "mongodb") {
        try {
            let book = new Book(newBook);
            book = await book.save();
            return _.pick(book, ["title", "author", "genre"]);
        } catch (error) {
            createError("mongoose", error);
        }
    }
}

const getBooks = async () => {
    if (DB == "mongodb") {
        try {
            let books = await Book.find().populate([{ path: 'author' }, { path: 'genre' }]);
            return books;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const getBook = async (bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId).populate([{ path: 'author' }, { path: 'genre' }]);
            return book;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
}


const updateBook = async (bookId, newBook) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findByIdAndUpdate(bookId, newBook, { new: true }).populate([{ path: 'author' }, { path: 'genre' }]);
            return book;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const deleteBookOrders = async (bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId);

            for (let i = 0; i < book.orders.length; i++) {
                let user = await User.findById(book.orders[i].userId);
                for (let j = 0; j < user.orders.length; j++) {
                    if (user.orders[j].bookId == bookId) {
                        user.orders.splice(j, 1);
                        await user.save();
                        break;
                    };
                };
            };
            book.orders = [];
            await book.save();
        } catch (error) {
            createError("Mongoose", error);
        }
    }
}

const deleteBook = async (bookId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId);
            if (!book.inLibrary) {
                createError("Mongoose", new Error("book must return to library before delete"))
            }
            if (book.orders.length > 0) {
                await deleteBookOrders();
            }
            book = await Book.findByIdAndDelete(bookId);
            return book;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const orderBook = async (bookId, userId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId).populate([{ path: 'author' }, { path: 'genre' }]);
            if (!book) {
                createError("Mongoose", new Error("the book not found"))
            }
            let user = await User.findById(userId);

            if (user.orders.length >= user.booksToOrder && !(!!book.orders.find(order => order.userId == userId))) {
                createError("Mongoose", new Error("user cant order more books"))
            }
            //אם הספר מוזמן -  להסיר את ההזמנה
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].bookId == bookId) {
                    user.orders.splice(i, 1);
                    await user.save();
                    for (let j = 0; j < book.orders.length; j++) {
                        if (book.orders[j].userId == userId) {
                            book.orders.splice(j, 1);
                            await book.save();
                            return book;
                        }
                    }
                }
            }
            // אחרת - להזמין
            let bookOrder = {
                userId: new mongoose.Types.ObjectId(userId),
                userName: user.firstName + " " + user.lastName
            };
            let userOrder = {
                bookId: new mongoose.Types.ObjectId(bookId),
                bookTitle: book.title,
                bookImage: book.image,
                bookAlt: book.alt
            };

            book.orders.push(bookOrder);
            await book.save();
            user.orders.push(userOrder);
            await user.save();

            return book;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const likeBook = async (bookId, userId) => {
    if (DB == "mongodb") {
        try {
            let book = await Book.findById(bookId).populate([{ path: 'author' }, { path: 'genre' }]);
            if (book.likes.includes(userId)) {
                let newLikesArray = book.likes.filter((id) => id != userId);
                book.likes = newLikesArray;
            } else {
                book.likes.push(userId);
            }
            await book.save();
            return book;
        } catch (error) {
            createError("mongoose", error);
        }
    }
};

const resetOrders = async () => {
    if (DB === "mongodb") {
        try {
            let books = await Book.find();
            let users = await User.find();
            await Promise.all([
                ...books.map(book => {
                    book.orders = [];
                    return book.save();
                }),
                ...users.map(user => {
                    user.orders = [];
                    return user.save();
                })
            ]);

        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


module.exports = { createBook, getBooks, getBook, updateBook, deleteBook, orderBook, likeBook, resetOrders }