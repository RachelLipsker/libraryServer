const config = require("config");
const addBookValidation = require("./joi/addBookValidation");
const editBookValidation = require("./joi/editBookValidation");
const validator = config.get("VALIDATOR");

const validateCreateBook = (book) => {
    if (validator === "joi") {
        const { error } = addBookValidation(book);
        if (error) return error.details[0].message;
        return "";
    }
};


const validateEditBook = (book) => {
    if (validator === "joi") {
        const { error } = editBookValidation(book);
        if (error) return error.details[0].message;
        return "";
    }
};

exports.validateCreateBook = validateCreateBook;
exports.validateEditBook = validateEditBook;