
const ballotCenter = new Map()

export default ({ games, socket, io, payload}) => {
    const { gameInfo, votedSentence, beginning} = payload

    if (beginning) return handleBeginning(io, gameInfo)
    
    const [haveAllPlayersPlayed, sentences] = sentenceLogger(gameInfo) || []

    const [isBallotDone, bestSentence] = castVote(gameInfo, votedSentence) || []

    if (haveAllPlayersPlayed) io.to(gameInfo.id).emit(socket.requestPath + "/poll/on", { poll: { options: sentences }})
    
    if (isBallotDone) {
        io.to(gameInfo.id).emit(socket.requestPath + "/poll/done", { poll: { bestOption: bestSentence} }) 
    }
}

const handleBeginning = (io, gameInfo) => {
    console.log("sending back")
    io.to(gameInfo.id).emit("game/in progress", {...gameInfo, source: null})
}

const sentenceLogger = (gameInfo) => {
    const sentence = gameInfo.data.details[gameInfo.data.sentenceIndex - 1]
    const playerCount = Object.keys(gameInfo.players).length
    const registeredSentenceCount = (ballotCenter.get(gameInfo.id)?.sentences || []).length
    
    const canRegisterSentence = playerCount > registeredSentenceCount

    if (!canRegisterSentence) return
        
    let gameBallotObj = ballotCenter.get(gameInfo.id)
    if (gameBallotObj) {
        gameBallotObj.sentences.push(sentence)
    } else {
        ballotCenter.set(gameInfo.id, {
            sentences: [sentence],
            ballots: []
        })
    }
    gameBallotObj = ballotCenter.get(gameInfo.id)

    if (playerCount === gameBallotObj.sentences.length) {
        gameBallotObj.start = true
        return [true, gameBallotObj.sentences]
    }

}

const castVote = (gameInfo, sentence) => {
    if (!sentence) return
    const gameBallotObj = ballotCenter.get(gameInfo.id)
    if (!gameBallotObj?.start) return
    
    gameBallotObj.ballots.push(sentence)

    if (gameBallotObj.ballots.length === Object.keys(gameInfo.players).length) {
        const bestSentence = findMode(gameBallotObj.ballots)
        console.info("bestie: ", bestSentence)
        ballotCenter.delete(gameInfo.id)
        return [true, bestSentence]
    }
}

const findMode = (words) => {
    const freq = words.reduce((acc, obj) => {
        acc.set(obj, (acc.get(obj) || 0) + 1);
        return acc;
    }, new Map());

    const max = Math.max(...freq.values());

    return [...freq.entries()].find(([obj, count]) => count === max)?.[0]; // Return the most voted object
};