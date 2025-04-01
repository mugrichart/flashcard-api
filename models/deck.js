import mongoose from "mongoose";

const Deck = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'Must provide deck name']
    },

    deckLang: {
        type: String,
        required: [true, 'Must provide deck language']
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    words: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }
    ]
});

export default mongoose.model('Deck', Deck);
