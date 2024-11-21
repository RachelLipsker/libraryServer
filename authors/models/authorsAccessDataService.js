const config = require("config");
const { createError } = require("../../utils/handleErrors");
const Author = require("./mongodb/Author");
const Book = require("../../books/models/mongodb/Book");
const DB = config.get("DB");
const mongoose = require("mongoose")


const createAuthor = async (newAuthor) => {
    if (DB == "mongodb") {
        try {
            let author = new Author(newAuthor);
            ahthor = await author.save();
            return author;
        } catch (error) {
            createError("mongoose", error);
        }
    }
}

const getAuthors = async () => {
    if (DB == "mongodb") {
        try {
            let authors = await Author.find();
            return authors;
        } catch (error) {
            createError("mongoose", error);
        }
    }
};

const updateAuthor = async (authorId, newAuthor) => {
    if (DB == "mongodb") {
        try {
            let author = await Author.findByIdAndUpdate(authorId, newAuthor, { new: true });
            return author;
        } catch (error) {
            createError("mongoose", error);
        }
    }
}


const deleteAuthor = async (authorId) => {
    if (DB == "mongodb") {
        try {
            let author = await Author.findById(authorId);

            let authorObjectId = new mongoose.Types.ObjectId(authorId);

            let books = await Book.find({ author: authorObjectId });
            if (books.length > 0) {
                createError("Mongoose", new Error("You cannot delete an author in use"));
            };
            author = await Author.findByIdAndDelete(authorId);
            return author;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};

module.exports = { createAuthor, getAuthors, updateAuthor, deleteAuthor }
