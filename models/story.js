
import mongoose from "mongoose"

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
    details: [
        {
            sentence: String,
            blanked: String,
        }
    ],
    title: String,
    words: [String]
})

export default mongoose.model('Story', StorySchema);
