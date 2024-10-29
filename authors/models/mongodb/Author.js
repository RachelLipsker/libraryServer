const mongoose = require('mongoose');
const { DEFAULT_VALIDATION } = require('../../../helpers/mongodb/mongooseValidators');

const authorSchema = new mongoose.Schema({
    name: {
        ...DEFAULT_VALIDATION,
        unique: true,
        trim: false
    },
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;