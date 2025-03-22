
const openaiRequest = require('../openaiRequest')

const {
    quizPrompt
} = require('../../openaiHelper')


const quizGen = async ({paragraphs, title}) => {
    try {
        const regrouped = regroupParagraphs(paragraphs)
        const prompt = quizPrompt(Object.values(regrouped), title);
        // console.log(prompt)
        const quiz = await openaiRequest("gpt-4o", 
            "You are teacher evaluating students' comprehension on articles"
            , prompt)
        console.log(quiz)
        const parsedQuiz = JSON.parse(quiz)
        const parQuiz = Object.values(parsedQuiz['individual'])
        const responseQuiz = {
            "individual" : Object.fromEntries(Object.keys(regrouped).map((key, index) => [key, parQuiz[index]]) ),
            "summary" : parsedQuiz["summary"]
        }

        console.log(responseQuiz)
        return responseQuiz
    } catch (error) {
        throw new Error(error.message)
    }
}

const regroupParagraphs = (paragraphs) => {
    const regrouped = {}
    const paragraphAgreedMinSize = 500;
    let aggregatedPar = "";
    paragraphs.forEach((par, index) => {
        aggregatedPar += par
        if (aggregatedPar.length >= paragraphAgreedMinSize || index === paragraphs.length - 1) {
            regrouped[index] = aggregatedPar; aggregatedPar = ""
        }
    })

    return regrouped
}

module.exports = {
    quizGen
}