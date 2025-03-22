const express = require('express');
const router = express.Router();

require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.OPENAI_API_KEY});

const openaiTest = async (req, res) => {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Tell me a random good story" }],
            stream: true,
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ msg: error.message})
    }
}

router.route('/').post(openaiTest)

module.exports = router
