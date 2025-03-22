
const mongoose = require('mongoose')

const wordMastery = new mongoose.Schema({
    wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
        unique: true
    },
    level: {
        type: Number,
        default: 0
    }
})

const learning = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    decks: [
        {
            deckId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Deck'
            },
            words: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Word'
                }
            ],
            chunkIndex: {
                type: Number,
                default: 0
            },
            level: {
                type: Number,
                default: 0
            }
        }
    ],
    unifiedDeck: {
        words: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }],
        level: {
            type: Number,
            default: 0
        } 
    }
})

const WordMastery = mongoose.model('WordMastery', wordMastery)
const Learning = mongoose.model('Learning', learning)

const masteryUpdation = async (wordMasteries) => {
    try {
        return await WordMastery.insertMany(wordMasteries, { ordered: false }); // ordered: false allows continuing on duplicates
    } catch (error) {
        if (error.code === 11000) {
            console.log("Duplicate wordId found and skipped.");
        } else {
            throw error;
        }
    }

}

const newLearning = async (deckId, user, wordIds) => {
    const createdLearning = await Learning.create(
        {
            user, 
            decks: [{deckId, chunkIndex: 0, level: 0, words: wordIds.slice(0, 10)}],
            unifiedDeck: {
                words: wordIds.slice(0, 10),
                level: 0
            }
        }
    )

    let wordMasteries = wordIds.slice(0, 10)?.map(wordId => ({wordId, level: 0}))
    wordMasteries = await masteryUpdation(wordMasteries)
    // console.log(createdLearning, wordMasteries, '............')

    return {createdLearning: createdLearning.toObject(), wordMasteries}
}

const pushNewDeck = async (deckId, user, wordIds) => {
    const updatedLearning = await Learning.findOneAndUpdate(
        {user}, 
        {$push: { decks: [{deckId, chunkIndex: 0, level: 0, words: wordIds.slice(0, 10)}] } },
        { new: true}
    )

    let wordMasteries = wordIds.slice(0, 10)?.map(wordId => ({wordId, level: 0}))
    wordMasteries = await masteryUpdation(wordMasteries)

    return { updatedLearning: updatedLearning.toObject(), wordMasteries }
}

const wordMasteryUpdate = async (wordMasteryList) => {
    const updatePromises = wordMasteryList.map(word => WordMastery.findByIdAndUpdate(word._id, {$set: {level: word.level}}, {new: true} ) )
    const updatedWordMasteries = await Promise.all(updatePromises)
    return updatedWordMasteries
}


const patchLearningDeck = async (userId, updateData) => {
    // Find the specific deck in the decks array by userId and deckId
    const updatedLearning = await Learning.findOneAndUpdate(
        { user: userId, "decks._id": updateData._id }, // Match user and deckId
        { 
            $set: { 
                "decks.$.words": updateData.words, // Updates the words array in the specified deck
                "decks.$.chunkIndex": updateData.chunkIndex, // Updates the chunkIndex in the specified deck
                "decks.$.level": updateData.level // Updates the level in the specified deck
            } 
        },
        { new: true } // Return the updated document
    );

    if (!updatedLearning) {
        throw new Error("Learning document or specified deck not found.");
    }

    let wordMasteries;
    if (updateData.levelUp) {
        wordMasteries = updateData.words.slice(0, 10)?.map(wordId => ({wordId, level: 0}))
        wordMasteries = await masteryUpdation(wordMasteries)
    }
    return { updatedLearning, newWordMasteries: wordMasteries } ;
};

module.exports = {
    WordMastery,
    Learning,
    newLearning,
    wordMasteryUpdate,
    patchLearningDeck,
    pushNewDeck
}

