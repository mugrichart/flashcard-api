require('dotenv').config()

const OpenAI = require('openai') 

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); 

const openaiRequest = async (MODEL, systemMsg, prompt) => {
    try {
        const chatCompletion = await openai.chat.completions.create(
            {
                model: MODEL,
                messages: [
                    { role: "system", content: systemMsg},
                    { role: "user", content: prompt}
                ],
                ...(MODEL === 'gpt-4o' && { response_format: { type: "json_object" } })
            }
    )

        
        return chatCompletion.choices[0].message.content
    } catch (error) {
        throw new Error(`\n-----Error with openai itself: ${error}`)
    }
}

module.exports = openaiRequest