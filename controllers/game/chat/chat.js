const { gameBroadcast }from "../utils/utils")

const switchActivity = async ({ games, ws, payload, connections}) => {
    const { gameID, playerID, activity } = payload;
    //console.log("activity: ", activity, playerID)
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
    
    if (activity === "next-line") {
        // const { title, summary, story, words, leadAuthor, coAuthors} = payload;
        //console.log("updated script index: ", gameToJoin.script.scriptIndex)
        return gameBroadcast(gameToJoin, "switch-activity", connections, { scriptIndex: ++gameToJoin.script.scriptIndex, activity: "next-line", direction: "client" })
    }
    // gameBroadcast(gameToJoin, "switch-activity", connections, {activity})
}

const shareSignal = ({ games, ws, payload, connections}) => {

    //console.log("📡 Forwarding signal from:", playerID, "to", targetID);
    //console.log("🔍 Signal Content:", signal);

    const { gameID, playerID, targetID, signal } = payload;

    const game = games[gameID];  
    if (!game) return ws.send(JSON.stringify({ method: "error", message: "Game not found" }));

    const targetSocket = connections[targetID];  // Find the target player's WebSocket connection
    if (!targetSocket) return ws.send(JSON.stringify({ method: "error", message: "Target player not connected" }));

    targetSocket.send(JSON.stringify({ method: "signal", payload: { sender: playerID, signal } }));
}
export {
    switchActivity,
    shareSignal
}