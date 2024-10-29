const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_WORD = process.env.JWT_SECRET;

const generationAuthToken = (user) => {
    const payload = {
        _id: user._id,
        isAdmin: user.isAdmin
    }
    const token = jwt.sign(payload, SECRET_WORD);
    return token;
};

const verifyToken = (tokenFromClient) => {
    try {
        const payload = jwt.verify(tokenFromClient, SECRET_WORD);
        return payload;
    } catch (err) {
        return null;
    }
};

module.exports = { generationAuthToken, verifyToken };