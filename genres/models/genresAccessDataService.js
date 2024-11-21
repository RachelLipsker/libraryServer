const config = require("config");
const Genre = require("./mongodb/Genre");
const { createError } = require("../../utils/handleErrors");
const Book = require("../../books/models/mongodb/Book");
const DB = config.get("DB");
const mongoose = require("mongoose");

const createGenre = async (newGenre) => {
    if (DB == "mongodb") {
        try {
            let genre = new Genre(newGenre);
            genre = await genre.save();
            return genre;
        } catch (error) {
            createError("mongoose", error);
        }
    }
};

const getGenres = async () => {
    if (DB == "mongodb") {
        try {
            let genres = await Genre.find();
            return genres;
        } catch (error) {
            createError("mongoose", error);
        }
    }
};

const updateGenre = async (genreId, newGenre) => {
    if (DB == "mongodb") {
        try {
            let genre = await Genre.findByIdAndUpdate(genreId, newGenre, { new: true });
            return genre;
        } catch (error) {
            createError("mongoose", error);
        }
    }
}

const deleteGenre = async (genreId) => {
    if (DB == "mongodb") {
        try {
            let genre = await Genre.findById(genreId);

            let genreObjectId = new mongoose.Types.ObjectId(genreId);

            let books = await Book.find({ genre: genreObjectId });
            if (books.length > 0) {
                createError("Mongoose", new Error("You cannot delete an genre in use"));
            };

            genre = await Genre.findByIdAndDelete(genreId);
            return genre;
        } catch (error) {
            createError("Mongoose", error);
        }
    }
};


module.exports = { createGenre, getGenres, updateGenre, deleteGenre }