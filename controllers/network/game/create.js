

export default ({ GameFactory, games, io, socket, payload }) => {

    //console.log(GameFactory, games, payload)

    const { userID, username, avatar, type, words } = payload

    const alreadyExisingGame = [...games.values()].find(game => game.creator === userID)
    if (alreadyExisingGame) {
        console.log("shocker")
        socket.join(alreadyExisingGame.id)
        return socket.emit(socket.requestPath, { ...alreadyExisingGame, data: {...newGame.data.metadata, ...newGame.data.state} })
    }

    const newGame = GameFactory.create({ type, data: { words } })
    newGame.data.words = words
    newGame.addPlayer({ userID, username, avatar })
    socket.join(newGame.id)
    games.set(newGame.id, newGame)

    console.log(io.sockets.adapter.rooms.get(newGame.id)); 

    //console.log({...newGame})
    socket.emit(socket.requestPath, { ...newGame, data: {...newGame.data.metadata, ...newGame.data.state} })
}