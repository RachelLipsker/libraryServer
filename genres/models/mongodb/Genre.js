const mongoose = require('mongoose');
const { DEFAULT_VALIDATION } = require('../../../helpers/mongodb/mongooseValidators');

const genreSchema = new mongoose.Schema({
    name: {
        ...DEFAULT_VALIDATION,
        unique: true,
    },
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;