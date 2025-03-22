
const openaiRequest = require('../openaiRequest')

const {
    blanksPrompt
} = require('../../openaiHelper')


const blanksGen = async (paragraphs) => {
    try {
        const prompt = blanksPrompt(paragraphs);
        // console.log(prompt)
        const words = await openaiRequest("gpt-4o", 
            "You are a Language teaching assistant helping students practice vocabulary on articles"
            , prompt)

        return JSON.parse(words)
        
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    blanksGen
}