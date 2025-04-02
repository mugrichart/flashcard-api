

export default ({ GameFactory, games, io, socket, payload }) => {

    //console.log(GameFactory, games, payload)

    const { userID, username, avatar, type, words, deck } = payload

    const alreadyExisingGame = [...games.values()].find(game => game.creator === userID && game.type === type)
    if (alreadyExisingGame) {
        console.log("shocker")
        socket.join(alreadyExisingGame.id)
        return socket.emit(socket.requestPath, { ...alreadyExisingGame, data: {...alreadyExisingGame.data.metadata, ...alreadyExisingGame.data.state} })
    }

    const newGame = GameFactory.create({ type, data: { words } })
    newGame.data.words = words || []
    newGame.addPlayer({ userID, username, avatar })
    socket.join(newGame.id)
    games.set(newGame.id, newGame)

    console.log(io.sockets.adapter.rooms.get(newGame.id)); 

    const res = newGame.type === "story" ? 
                { ...newGame, data: {...newGame.data.metadata, ...newGame.data.state} } :
                newGame
    // console.log(res)
    socket.emit(socket.requestPath, res)
}