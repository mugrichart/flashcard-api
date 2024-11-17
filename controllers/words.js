
const getWordModel = require('../models/word/word')
const { createNewDeck } = require('./deck')
const wordDefinition = require('../utils/openai-process/wordDefinition')
const Deck = require('../models/deck')

const { closestStringByLength } = require('../utils/stringCompare')


const getWords = async (req, res) => {
    try {
        const { language, word } = req.params;
        const WordModel = getWordModel(language);
        const searchWords = await WordModel.find({ word: new RegExp(`^${word}`, 'i') });

        // Return the found words as a response
        res.json({searchWords});

    } catch (error) {
        res.json({ message: 'Error', error: error.message})
    }
}

const updateWordMastery = async (req, res) => {

}

const addWordToDeck = async (body) => {
    try {
        console.log('........................add to word deck')
        const { deckName, deckId, userId, deckLang, words } = body
        const deck = await createNewDeck(deckId, deckName, userId, deckLang);
        if (!deck) throw new Error(`The deck with id: ${deckName} doesn't exist!`)
        const WordModel = getWordModel(deckLang);
        const wordsToSave = await WordModel.find({ word: {$in: words}})
        deck.words = deck.words.concat(wordsToSave)
        // deck.words = deck.words.concat(words)
        console.log(deck, '........different issue')
        await deck.save()
        console.log('......................success with add to word deck')
        return {msg: 'success', deck: {name: deck.deckName, id: deck._id}}
    } catch (error) {
        console.log(error.message)
        return { msg: 'error', error: error.message}
    }
}

const addToWishList = async (body, app) => {
    try {
        console.log('...................... add to wish')
        const { deckName, deckId, userId, deckLang, words } = body
        const deck = await createNewDeck(deckId, deckName, userId, deckLang);
        if (!deck) throw new Error(`The deck with id: ${deckName} doesn't exist!`)
        await deck.save()
        if (!app.new_words_to_add.has(deckLang)) app.new_words_to_add.set(deckLang, [])

        app.new_words_to_add.get(deckLang).push({ creator: userId, deck: deck._id, words: words })
        await app.save()
        console.log('....................success with add to wish')
        return {msg: 'success', deck: deck._id}
    } catch (error) {
        console.log(error.message)
        return {msg: 'error', error: error.message}
    }
}

//if (app.new_words_to_add.length >= app.max_wishes) 
const wordProcessing = async (app) => {
    try {
        const wordsToProcess = app.new_words_to_add.reduce((acc, currWordObj) => acc.concat(currWordObj.words), [])
        console.log('...........................openai process')
        const {msg, words: processedWords} = await wordDefinition(wordsToProcess, 'regular deck')
        const savedWords = await dictionaryPopulating(msg, processedWords, app.language)
        let rangeStart = 0
        const ranges = app.new_words_to_add.map(curr => { const rangeEnd = rangeStart + curr.words.length; const newRange = [rangeStart, rangeEnd]; rangeStart = rangeEnd; return newRange})

        const eachDeck = async (wordObj, savedWords, range) => {
            try {
                const deckNewWords = wordObj.words.map((inputWord, i) => {
                    const createdWords = savedWords[range[0] + i];
                    return closestStringByLength(inputWord, createdWords);
                });
        
                // Use $push with $each to add the new words
                await Deck.findByIdAndUpdate(
                    wordObj.deck,
                    { $push: { words: { $each: deckNewWords } } },
                    { new: true }
                );
            } catch (error) {
                console.log(`error with adding words to deck: ${wordObj.deck} \n${error}`);
            }
        };
        
        await Promise.all(app.new_words_to_add.map(async (wordObj, i) => eachDeck(wordObj, savedWords, ranges[i])))
        return {msg: 'success'}
    }
    catch (error) {
        console.log(error)
        return {msg: 'error', error: error.message}
    }
}

const dictionaryPopulating = async (msg, processedWords, language) => {
    console.log('........................................processing: saving words');
    try {
        const WordModel = getWordModel(language);
        const savedWords = await Promise.all(processedWords.map(async (wordBatch) => {
            return Promise.all(wordBatch.map(async (word) => {
                try {
                    const savedWord = await WordModel.create({...word, language});
                    return savedWord;
                } catch (error) {
                    if (error.name === 'MongoServerError' && error.code === 11000 && error.duplicatedDoc) {
                        // Handle the duplicate by using the duplicatedDoc attached in middleware
                        return error.duplicatedDoc;
                    } else {
                        console.log('An unexpected error occurred:', error.message);
                    }
                }
            }));
        }));
        
        return savedWords;
    } catch (error) {
        console.log('An error occurred during DB operation:', error.message);
    }
};


module.exports = {
    getWords,
    addWordToDeck,
    addToWishList,
    wordProcessing
}