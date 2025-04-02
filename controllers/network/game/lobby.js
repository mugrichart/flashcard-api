
export default ({ games, socket, io, payload}) => {
    const gameInfo = payload
    console.log(payload)
    console.log(io.sockets.adapter.rooms.get(gameInfo.id)); 
    socket.to(gameInfo.id).emit("game/lobby", payload) 
}