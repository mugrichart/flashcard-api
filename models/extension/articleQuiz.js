
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParagraphSchema = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    false_answers: {type: [String], required: true}
})


const ArticleQuizSchema = new Schema({
    href: {
        type: String,
        required: [true, "href is missing and is required to identify the url of the article"]
    },
    individual: {
        type: Map,
        of: ParagraphSchema
    },
    summary: ParagraphSchema
})

module.exports = mongoose.model("ArticleQuiz", ArticleQuizSchema)