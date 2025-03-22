const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    language: String,
    type: String,
    word: String,
    "language style": String,
    meaning: String,
    example: String,
    "blanked example": String,
    synonym: String,
    antonym: String,
    'related words': [String]
});

// Add a unique compound index on (type, word, "language style")
wordSchema.index({ type: 1, word: 1, "language style": 1 }, { unique: true });

// Error handling middleware
wordSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        //next(new Error('A word with this type, word, and language style combination already exists.'));
        error.duplicatedDoc = doc;
        next(error);  // Passes the original error, triggering the catch block
    } else {
        next(error);
    }
});

// Optionally, handle duplicate key errors on update operations too
wordSchema.post('updateOne', function (error, res, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('A word with this type, word, and language style combination already exists.'));
    } else {
        next(error);
    }
});

function getWordModel(language) {
    const collectionName = `${language.toLowerCase()}_words`;
    return mongoose.model('Word', wordSchema, collectionName);
}

module.exports = getWordModel;
