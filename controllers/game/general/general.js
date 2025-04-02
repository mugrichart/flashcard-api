import { gameBroadcast } from "../utils/utils"

const create = ({ Game, games, players, io, socket, connections, payload }) => {
    const { userID, username, avatar, type, words } = payload
    const alreadyExisingGame = Object.values(games).find(game => game.creator === userID)
    if (alreadyExisingGame) {
        socket.emit("create", { isCreator: true, playerID, gameID: alreadyExisingGame.gameID, players: alreadyExisingGame.players.map(playerID => players[playerID]) })
    }
    const newGame = new Game({ type, creator: userID})
    const creatorPlayer = new Player({ playerID: userID, playerName: username, typeOfGame })
    newGame.addPlayer({playerID: creatorPlayer.playerID, isCreator: true})
    games[newGame.gameID] = newGame
    //console.log(newGame)

    players[playerID] = creatorPlayer
    connections[creatorPlayer.playerID] = socket
    socket.emit("create", { 
        settings: {
            room: {
                roomID: newGame.gameID,
                roomUsers: newGame.players.map(playerID => players[playerID]),
                creator: userID
            } 
        }
    })
}

const joinGame = ({ games, Player, players, socket, connections, payload}) => {
    if (!payload) return
    const { gameID, playerID, playerName, mode, avatar} = payload
    let gameToJoin;
    if (mode === "random") {
        const gamePool = Object.values(games)
        if (gamePool?.length) {gameToJoin = gamePool[0]}
        else return socket.emit("join", {status: 404})
    }
    else {
        gameToJoin = games[gameID]
    }
    if (!gameToJoin) return socket.emit("join", { status: 404, message: 'Game not found' })
    if (!gameToJoin.players.find(player_id => player_id === playerID)) {
        const newPlayer = new Player({playerID, playerName})
        gameToJoin.addPlayer({playerID : newPlayer.playerID, isCreator: false } )
        players[playerID] = newPlayer
    }

    const connectionID = playerID
    connections[connectionID] = socket
    socket.emit("join", { playerID, gameID: gameToJoin.gameID, words: gameToJoin.words, players: gameToJoin.players, typeOfGame: gameToJoin.typeOfGame})
    gameBroadcast(gameToJoin, "waiting-room-update", connections, {players: gameToJoin.players.map(playerID => players[playerID]), gameID: gameToJoin.gameID, playerID })
}

const commandReaction = async ({ games, socket, connections, payload}) => {
    if (payload?.command === "start") {
        const { gameID, words, players, typeOfGame, title, summary } = payload
        const gameToJoin = games[gameID]
        if (!gameToJoin) return socket.emit("start", { status: 404, message: 'Game not found' })
        gameToJoin.state.status = "on"
        
        const script = typeOfGame === "chat" && scriptObj() // await fullScriptGen(title, summary, gameToJoin.words.map(wordObj => wordObj.word), players.map((player, idx) => ({...player, isKeyPlayer: idx % 2})))
        
        gameToJoin.script = { ...script, scriptIndex: 0, direction: "client"}
        // //console.log(script)
        gameBroadcast(gameToJoin, "command", connections, {command: "start", script: gameToJoin.script})
    }
    else if (payload?.command === "waiting-room-update") {
        const { gameID, playerID } = payload
        const gameToJoin = games[gameID]
        if (!gameToJoin) return socket.emit("waiting-room-update", { status: 404, message: 'Game not found' })
        
        const playerConnection = connections[playerID]
        playerConnection.emit("waiting-room-update", {players: gameToJoin.players})
    }
}

const playingUpdate = ({ games, socket, payload, players, connections}) => {
    const { gameID } = payload
    const gameToJoin = games[gameID]
    if (!gameToJoin) return socket.emit("playing-update", { status: 404, message: 'Game not found' })
    
    const playersUpdate = gameToJoin.players.map(playerID => players[playerID])
    gameBroadcast(gameToJoin, "playing-update", connections, {players: playersUpdate})
}

const playing = ({ games, players, socket, connections, payload}) => {
    const { gameID, playerID, isCorrect } = payload
    const gameToJoin = games[gameID]
    if (!gameToJoin) return socket.emit("play", { status: 404, message: 'Game not found' })
    
    const player = players[playerID]
    player.playerScore += isCorrect
    player.played = true

    const connection = connections[playerID]
    // connection.send(JSON.stringify({ method: "play", payload: {}}))

    const playersUpdate = gameToJoin.players.map(playerID => players[playerID])
    const allPlayed = playersUpdate.every(player => player.played === true)
    allPlayed && console.log('all played')
    if (!allPlayed) return
    
    playersUpdate.sort((playerA, playerB) => playerA.playerScore - playerB.playerScore).reverse()
    playersUpdate.forEach((player, index) => {player.playerRank = index + 1})
    //console.log("---------- all players played", playersUpdate)
    
    gameBroadcast(gameToJoin, "playing-update", connections, {players: playersUpdate})

    Object.values(players).forEach(player => { player.played = false })
}

export {
    createGame,
    joinGame,
    commandReaction,
    playingUpdate,
    playing
}

const scriptObj = () => ({
    title: 'The Curious Caper of Captain Catnip',
    summary: 'Richie, a budding detective with a wild imagination, teams up with his best friend Mugisha to solve the mystery of why Captain Catnip is acting strangely. As they explore, they stumble upon a curious device that alters behaviors, leading them on a zany adventure full of unexpected twists.',
    words: [ 'device', 'curious', 'imagination', 'explore', 'unexpected' ],
    script: [
      {
        type: 'narration',
        actor: null,
        line: "The scene opens in Richie and Mugisha's cozy clubhouse, filled with an assortment of detective tools and toys."
      },
      {
        type: 'line',
        actor: 'mugisha',
        line: "Richie, have you seen Captain Catnip today? He's acting... peculiar."
      },
      {
        type: 'line',
        actor: 'richie',
        line: "I think he's been intrigued by a curious device I found yesterday.",
        rephrased: "I believe he's interested because of a strange gadget I found yesterday."
      },
      {
        type: 'line',
        actor: 'mugisha',
        line: 'A peculiar device? Tell me more!'
      },
      {
        type: 'line',
        actor: 'richie',
        line: 'I uncovered it while letting my imagination roam during a walk in the park.',
        rephrased: 'I found it during a stroll in the park when I was creatively thinking.'
      },
      {
        type: 'line',
        actor: 'mugisha',
        line: 'Your imagination never fails to lead us to adventures. What does this device do?'
      },
      {
        type: 'line',
        actor: 'richie',
        line: "I'm not sure yet, but Captain Catnip's actions have been quite unexpected lately!",
        rephrased: "I'm not sure yet, but Captain Catnip's behavior has been very surprising recently!"
      },
      {
        type: 'line',
        actor: 'mugisha',
        line: "There's only one way to find out—let's explore and solve this mystery!"
      },
      {
        type: 'narration',
        actor: null,
        line: 'Mugisha and Richie grab magnifying glasses and hats, ready to embark on their investigative journey.'
      },
      {
        type: 'line',
        actor: 'richie',
        line: 'Every detective story needs a twist, and this definitely has potential for a thrilling one!',
        rephrased: 'Every detective story needs an unexpected turn, and this could be quite exciting!'
      }
    ]
  })