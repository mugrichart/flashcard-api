
export default ({ games, socket, io, payload}) => {
    const { id, userID, username, avatar} = payload
    let gameToJoin;
    if (!id) {
        const gamePool = [...games.values()]
        if (gamePool?.length) {
            gameToJoin = gamePool[0]
        }
        else return socket.emit(socket.requestPath, {status: 404})
    }
    else {
        gameToJoin = games.get(id)
    }
    if (!gameToJoin) return socket.emit(socket.requestPath, { status: 404, message: 'Game not found' })
    
    gameToJoin.addPlayer({ userID, username, avatar })

    socket.join(gameToJoin.id)

    console.log(io.sockets.adapter.rooms.get(gameToJoin.id)); 

    const res = gameToJoin.type === "story" ? 
                    { ...gameToJoin, data: {...gameToJoin.data.metadata, ...gameToJoin.data.state} } :
                    gameToJoin
    // console.log(res)
    
    io.to(gameToJoin.id).emit("game/lobby", res ) 

    // optionally send game details to this individual as with 'join' method
}