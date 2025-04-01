
import openaiRequest from './openaiRequest.js'

import { fullScriptPrompt,
        fullScriptSystemMsg,
} from '../openaiHelper.js'

const fullScriptGen = async (title, summary, words, players) => {
    try {
        const prompt = fullScriptPrompt(title, summary, words, players)
        //console.log(fullScriptSystemMsg, "full")
        //console.log(prompt)
        const script = await openaiRequest("gpt-4o", fullScriptSystemMsg, prompt)
        //console.log(script)
        return JSON.parse(script)
    } catch (error) {
        throw new Error(error.message)
    }
}



export {
    fullScriptGen,
}
