
import openaiRequest from '../openaiRequest.js'

import {
    blanksPrompt
} from '../../openaiHelper.js'


const blanksGen = async (paragraphs) => {
    try {
        const prompt = blanksPrompt(paragraphs);
        // //console.log(prompt)
        const words = await openaiRequest("gpt-4o", 
            "You are a Language teaching assistant helping students practice vocabulary on articles"
            , prompt)

        return JSON.parse(words)
        
    } catch (error) {
        throw new Error(error.message)
    }
}

export {
    blanksGen
}