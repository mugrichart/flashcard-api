const handleQuizRelated = (gameInfo, isCorrect, io, gameScoreKeeper, source) => {
    if (!source) return
    console.log("are we handling it")
    let thisGameScoreStore = gameScoreKeeper.get(gameInfo.id)
    if (!thisGameScoreStore) {
        gameScoreKeeper.set(gameInfo.id, {})
        thisGameScoreStore = gameScoreKeeper.get(gameInfo.id)
    }
    console.log(thisGameScoreStore)
    if (Object.keys(thisGameScoreStore).length < Object.keys(gameInfo.players).length) {
        console.log("----- registering the score", isCorrect, source, gameInfo.players[source])
        thisGameScoreStore[source] = gameInfo.players[source].score + isCorrect
    }

    if (Object.keys(thisGameScoreStore).length === Object.keys(gameInfo.players).length) {
        console.log('----------- all done')
        Object.keys(thisGameScoreStore).forEach(playerID => {
            gameInfo.players[playerID].score = thisGameScoreStore[playerID]
        })

        // Sort players by score and assign ranks
        const playerArray = Object.entries(gameInfo.players);
        playerArray.sort((a, b) => b[1].score - a[1].score);
        
        // Assign ranks
        playerArray.forEach(([playerID, playerData], index) => {
            gameInfo.players[playerID].rank = index + 1;
        });

        gameScoreKeeper.set(gameInfo.id, {})
        gameInfo.card = (gameInfo?.card || 0) + 1
        // Send updated game info to all players
        io.to(gameInfo.id).emit("game/in progress", gameInfo);

        sendToLobby(io, gameInfo)
    }

}

const sendToLobby = (io, gameInfo) => {
    console.log(gameInfo.data.deck.learning.words.length, gameInfo.card, gameInfo.data.deck.learning.words.length === gameInfo.card)
    if (gameInfo.data.deck.learning.words.length === gameInfo.card) {
        setTimeout(() => {
            gameInfo.status = "lobby"
            gameInfo.data.step = "onboarding"
            io.to(gameInfo.id).emit("game/in progress/redirect", gameInfo);
        }, 10000);

    }
}

export default handleQuizRelated