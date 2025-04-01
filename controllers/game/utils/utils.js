
const generateId = (number) => {
    // Ensure the number is within the valid range for 4 characters in base-36
    if (number < 0 || number > 1679615) { // 36^4 - 1 = 1679615
      throw new Error("Number out of range for 4-character ID.");
    }
    // Convert the number to base-36 and pad it to ensure 4 characters
    return number.toString(36).toUpperCase().padStart(4, '0');
  }
  
const gameBroadcast = (game, method, connections, payload) => {
    game.players.forEach(playerID => {
        const playerConnection = connections[playerID]
        playerConnection.send(JSON.stringify({ method, payload}))
    })
}


export {
    generateId,
    gameBroadcast
}