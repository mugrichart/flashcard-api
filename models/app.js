import mongoose from 'mongoose';

const AppSchema = new mongoose.Schema({
    max_wishes: { type: Number, default: 1 },
    new_words_to_add: {
        type: Map,
        of: [
            {
                creator: { type: mongoose.Types.ObjectId, ref: 'User' },
                deck: { type: mongoose.Types.ObjectId, ref: 'Deck' },
                words: { 
                    type: [{
                        word: String,
                        example: String
                    }], 
                    default: [] 
                } // Array of words as strings
            }
        ],
        default: {}
    }
});

export default mongoose.model('App', AppSchema);
