
import mongoose from "mongoose"

const TemporarySchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardNumber: {
        type: Number,
        required: [true, 'How many cards are in this deck']
    },
    unprocessed: {
        type: [{
            word: String,
            context: String,
        }],
        required: [true, 'Provide words to process']
    }
})

export default mongoose.model('Temporary', TemporarySchema);
