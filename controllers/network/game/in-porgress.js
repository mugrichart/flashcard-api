import { sentenceLogger, castVote, handleBeginning } from "./utils/story.js"
import handleQuizRelated from "./utils/quiz.js"

export default ({ games, ballotCenter, gameScoreKeeper, socket, io, payload}) => {
    const { gameInfo, votedSentence, beginning, isCorrect, source} = payload

    if (gameInfo.type === "quiz") return handleQuizRelated(gameInfo, isCorrect, io, gameScoreKeeper, source)

    if (beginning) return handleBeginning(io, gameInfo)
    
    const [haveAllPlayersPlayed, sentences] = sentenceLogger(gameInfo, ballotCenter) || []

    const [isBallotDone, bestSentence] = castVote(gameInfo, votedSentence, ballotCenter) || []

    if (haveAllPlayersPlayed) io.to(gameInfo.id).emit(socket.requestPath + "/poll/on", { poll: { options: sentences }})
    
    if (isBallotDone) {
        ballotCenter.delete(gameInfo.id)
        io.to(gameInfo.id).emit(socket.requestPath + "/poll/done", { poll: { bestOption: bestSentence} }) 
    }
}
