
const mongoose = require('mongoose')

const StorySchema = mongoose.Schema({
    leadAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    coAuthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck' 
    },
    story: [
        {
            sentence: String,
            blanked: String,
        }
    ],
    title: String,
    words: [String]
})

module.exports = mongoose.model('Story', StorySchema);
