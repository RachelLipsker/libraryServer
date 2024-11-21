const config = require("config");
const _ = require("lodash");
const { generateUserPassword, comparePasswords } = require("../helpers/bcrypt");
const User = require("./mongodb/User");
const { createError } = require("../../utils/handleErrors");
const { generationAuthToken } = require("../../auth/providers/jwt");
const Book = require("../../books/models/mongodb/Book");
const DB = config.get("DB");


const registerUser = async (newUser) => {
    if (DB == "mongodb") {
        try {
            newUser.password = generateUserPassword(newUser.password);
            let user = new User(newUser);
            user = await user.save();
            return _.pick(user, ["_id", "firstName", "lastName", "email", "phone", "isAdmin"]);
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const loginUser = async (email, password) => {
    if (DB == "mongodb") {
        try {
            const userFromDb = await User.findOne({ email });
            if (!userFromDb) {
                createError("Authentication Error", new Error("Invalid email or password"));
            }
            if (!comparePasswords(password, userFromDb.password)) {
                createError("Authentication Error", new Error("Invalid email or password"));
            };
            const token = generationAuthToken(userFromDb);
            return token;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const getUser = async (userId) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const getUsers = async () => {
    if (DB == "mongodb") {
        try {
            let users = await User.find();
            return users;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const updateUser = async (userId, newUser) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findByIdAndUpdate(userId, newUser, { new: true });
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


const deleteUserOrders = async (userId) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            for (let i = 0; i < user.orders.length; i++) {
                let book = await Book.findById(user.orders[i].bookId);
                for (let j = 0; j < book.orders.length; j++) {
                    if (book.orders[j].userId == userId) {
                        book.orders.splice(j, 1);
                        await book.save();
                        break;
                    }
                }
            }
            user.orders = [];
            await user.save();
        } catch (error) {
            createError("Mongoose", error);
        }
    }
}

const deleteUser = async (userId) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            if (user.openBorrowings?.length > 0) {
                createError("Mongoose", new Error("user must return books before delete account"))
            }
            if (user.orders?.length > 0) {
                await deleteUserOrders();
            }
            user = await User.findByIdAndDelete(userId);
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const isAdminUser = async (userId) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            user.isAdmin = !user.isAdmin;
            await user.save();
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const changeBorrowingsNumber = async (userId, number) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            user.booksToBorrowing = number;
            await user.save();
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

const changeOrdersNumber = async (userId, number) => {
    if (DB == "mongodb") {
        try {
            let user = await User.findById(userId);
            user.booksToOrder = number;
            await user.save();
            return user;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

module.exports = { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, isAdminUser, changeBorrowingsNumber, changeOrdersNumber };