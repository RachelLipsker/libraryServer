const Joi = require("joi");

const editValidation = (user) => {
    const schema = Joi.object({
        phone: Joi.string()
            .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)

            .rule({ message: 'user "phone" mast be a valid phone number' })
            .required(),

        image: Joi.string()
            .ruleset.regex(
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
            )
            .rule({ message: "user image mast be a valid url" })
            .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
    });
    return schema.validate(user);
};

module.exports = editValidation;