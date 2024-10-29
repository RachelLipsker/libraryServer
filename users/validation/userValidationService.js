const config = require("config");
const registerValidation = require("./joi/registerValidation");
const editValidation = require("./joi/editValidation");
const validator = config.get("VALIDATOR");

const validateRegistration = (user) => {
    if (validator === "joi") {
        const { error } = registerValidation(user);
        if (error) return error.details[0].message;
        return "";
    }
};


const validateEdit = (user) => {
    if (validator === "joi") {
        const { error } = editValidation(user);
        if (error) return error.details[0].message;
        return "";
    }
};

exports.validateRegistration = validateRegistration;
exports.validateEdit = validateEdit;