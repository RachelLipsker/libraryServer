const Joi = require("joi");

const editBookValidation = (book) => {
    const schema = Joi.object({
        author: Joi.string().min(2).max(256).required(),
        genre: Joi.string().min(2).max(256).required(),
        image: Joi.string()
            .ruleset.regex(
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
            )
            .rule({ message: "user image mast be a valid url" })
            .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
    });
    return schema.validate(book);
};

module.exports = editBookValidation;
