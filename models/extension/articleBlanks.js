
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BlankSchema = new Schema({
    word: String,
    fools: [String]
})

const ArticleBlanksSchema = mongoose.Schema({
    href: {
        type: String,
        required: [true, "href required to identify the url of the article"]
    },
    blanks: {
        type: Map,
        of: [BlankSchema]
    }
})

module.exports = mongoose.model("ArticleBlanks", ArticleBlanksSchema)