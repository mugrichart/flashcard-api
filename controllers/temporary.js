const Temporary = require('../models/temporary');
const Deck = require('../models/deck');
const Card = require('../models/card');

const wordDefinition = require('../utils/openai-process/wordDefinition')

const updateTemporary = async (req, res) => {
    try {
        const { userId, words } = req.body;
        let thisUserTemporaryDeck = await Temporary.findOne({ creator: userId });
        if (!thisUserTemporaryDeck) {
            thisUserTemporaryDeck = new Temporary({ 
                creator: userId, 
                cardNumber: 0
            });
        } 

        const unprocessed = [...words, ...thisUserTemporaryDeck.unprocessed]
        thisUserTemporaryDeck.unprocessed = unprocessed;
        await thisUserTemporaryDeck.save()
        
        const userTempCards = await Card.find({ deck: thisUserTemporaryDeck._id });
        res.status(200).json({ unprocessed: thisUserTemporaryDeck.unprocessed, processed: userTempCards, tempId: thisUserTemporaryDeck._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTemporary = async(req, res) => {
    const { tempId } = req.params;
    console.log(tempId)
    const thisUserTemporaryDeck = await Temporary.findById(tempId);
    try {
        const parseData = await wordDefinition(thisUserTemporaryDeck.unprocessed, 'temporary deck')
        const cards = parseData.map(card => ({...card, deck: tempId }))
        await Card.insertMany(cards)
        thisUserTemporaryDeck.cardNumber += thisUserTemporaryDeck.unprocessed.length
        thisUserTemporaryDeck.unprocessed = [];
        await thisUserTemporaryDeck.save()
        const userTempCards = await Card.find({ deck: thisUserTemporaryDeck._id });
        
        res.status(200).json({ unprocessed: thisUserTemporaryDeck.unprocessed, processed: userTempCards, tempId });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

const stealFromTemporary = async (req, res) => {
    let { userId, idType, id, selected, deckLang } = req.body;

    const tempDeck = await Temporary.findOne({ creator: userId })

    const deck = idType === 'deckId' ? await Deck.findById(id) : 
        new Deck({
            deckName: id,
            deckLang,
            creator: userId,
            cardNumber: 0,
            performance: {
                correct: [0],
                performance: [0],
                time: [0]
            }
        });
    
    id = deck._id
    
    try {
        // Update the deck field for all selected card ids
        await Card.updateMany(
            { _id: { $in: selected } }, // Find cards whose _id is in the selected array
            { $set: { deck: id } } // Set the deck field to the new id
        );
        deck.cardNumber += selected.length;
        tempDeck.cardNumber -= selected.length;
        await deck.save();
        await tempDeck.save()

        res.status(200).json({ message: 'Cards updated successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    updateTemporary,
    getTemporary,
    stealFromTemporary
};
