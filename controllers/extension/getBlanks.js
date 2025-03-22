
const { blanksGen } = require("../../utils/openai-process/extension/blanksGen")
const { quizGen } = require("../../utils/openai-process/extension/quizGen")

const ArticleBlanks = require("../../models/extension/articleBlanks");
const ArticleQuiz = require("../../models/extension/articleQuiz");

const getBlanks = async (req, res) => {
    try {
        const { paragraphs, title, href } = req.body
        const [ blanks, quiz] = await Promise.all([fetchArticleBlanks(href, paragraphs), fetchArticleQuiz({paragraphs, title, href})])
        
        return res.json({ blanks, quiz })

    } catch (error) {
        return res.status(500).json({ msg: 'something went wrong'})
    }
}


module.exports = {
    getBlanks
}

const fetchArticleBlanks = async (href, paragraphs) => {
        const article = await ArticleBlanks.find({ href })
        if (article.length) return article[0].blanks;
        const { words } = await blanksGen(paragraphs);
        const blanks = removingInvalids(words, paragraphs);
        ArticleBlanks.create({
            href, blanks
        }).catch(console.log)

        return blanks
    
}

const fetchArticleQuiz = async ({ paragraphs, title, href}) => {
        const article = await ArticleQuiz.find({ href })
        if (article.length) return article[0];
        const quiz = await quizGen({paragraphs, title});
        ArticleQuiz.create({ href, individual: quiz.individual, summary: quiz.summary }).catch(console.log)
        return quiz
}

const removingInvalids = (words, paragraphs) => {
    if (!words)  return;

    const blanks = {}

    paragraphs.forEach( (p, index) => {
        words.forEach( (wordObj, i) => {
            if (p.includes(wordObj.word)) {
                if (blanks[index]) blanks[index].push(wordObj)
                else blanks[index] = [wordObj]
            }
        })
    })

    return blanks
}