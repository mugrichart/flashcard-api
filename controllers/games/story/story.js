const { createStoryHandler } = require("../../deck")
const { gameBroadcast } = require("../utils/utils")

const titleAndSummary = ({ games, ws, payload, connections}) => {
    console.log("....coming", payload)
    const {gameID, playerID, storyGameUtils, players} = payload
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.emit(JSON.stringify({method:"play", payload: { status: 404, message: 'Game not found' }}))
    gameBroadcast(gameToJoin, "waiting-room-update", connections, {storyGameUtils, players})
}


const addNewSentence = ({ games, players, ws, payload, connections}) => {
    const { gameID, playerID, storyGameUtils } = payload;
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
    
    if (!gameToJoin.currSentences) gameToJoin.currSentences = [];
    gameToJoin.currSentences.push(storyGameUtils.currSentence)
    const player = players[playerID]
    player.addedNewSentence = true
    const playersUpdate = gameToJoin.players.map( playerID => players[playerID] )
    const allPlayed = playersUpdate.every(player => player.addedNewSentence === true)
    allPlayed && console.log('all wrote')
    if (!allPlayed) return

    gameBroadcast(gameToJoin, "all-players-wrote", connections, {currSentences: gameToJoin.currSentences})

    Object.values(players).forEach(player => { player.addedNewSentence = false })
}

const votingBestSentence = ({ games, players, ws, payload, connections}) => {
    const { gameID, playerID, bestSentence } = payload;
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
    
    const player = players[playerID]
    player.voted = true

    if (!gameToJoin.votedSentences) gameToJoin.votedSentences = {}
    const previousVote = gameToJoin.votedSentences[bestSentence]
    gameToJoin.votedSentences[bestSentence] = previousVote ? previousVote + 1 : 1

    const playersUpdate = gameToJoin.players.map( playerID => players[playerID] )
    const allPlayed = playersUpdate.every(player => player.voted === true)
    allPlayed && console.log('all voted')
    if (!allPlayed) return

    const highestVote = Object.entries(gameToJoin.votedSentences).sort((a, b) => b[1] - a[1])[0]

    gameBroadcast(gameToJoin, "voted-sentence", connections, {votedSentence: gameToJoin.currSentences[highestVote[0]]})

    Object.values(players).forEach(player => { player.voted = false })
    delete gameToJoin.currSentences
    delete gameToJoin.votedSentences
}

const switchActivity = async ({ games, ws, payload, connections}) => {
    const { gameID, playerID, activity } = payload;
    console.log("activity: ", activity, playerID)
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
    
    if (activity === "uploading") {
        const { title, summary, story, words, leadAuthor, coAuthors} = payload;
        const createdStory = await createStoryHandler(
            null, 
            { title, summary, story, leadAuthor: gameToJoin.creator, 
            coAuthors: gameToJoin.players.filter(player => player !== gameToJoin.creator), words: words || []
            }
        )
        console.log(createdStory)
        return gameBroadcast(gameToJoin, "switch-activity", connections, {activity: "", story: createdStory})
    }
    gameBroadcast(gameToJoin, "switch-activity", connections, {activity})
}

module.exports = {
    titleAndSummary,
    addNewSentence,
    votingBestSentence, 
    switchActivity
}