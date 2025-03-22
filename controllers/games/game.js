
const { getWebSocketServer } = require("../../websocket")
const { createGame, joinGame, 
    commandReaction, playingUpdate,
    playing
} = require("./general/general")

const {
    titleAndSummary,
    addNewSentence,
    votingBestSentence,
    switchActivity
} = require("./story/story")

const Router = require("../../utils/game/router")

const { Game, Player, games, players, connections } = require("./utils/store")

const wss = getWebSocketServer()

wss.on("connection", (ws) => {
    ws.on("message", async(message) => {
        const response = JSON.parse(message)
        const { method, payload } = response
        const router = new Router({ method, payload, games, players, Player, Game, connections, ws })

        router.route("create", createGame)
        router.route("join", joinGame)
        router.route("command", commandReaction)
        router.route("playing-update", playingUpdate)
        router.route("play", playing)

        router.route("title-and-summary", titleAndSummary)
        router.route("add-new-sentence", addNewSentence)
        router.route("voting-best-sentence", votingBestSentence)
        router.route("switch-activity", switchActivity)
        router.route("disconnect", () => null) // !Todo  Handling this later. removing the player when disconnected

        // switch (method) {
        //     case "create": createGame({Game, Player, games, players, ws, connections, payload})
        //     case "join" : joinGame({Player, games, players, ws, connections, payload})
        //     case "command": commandReaction({ games, ws, connections, payload})
        //     case "playing-update": playingUpdate({games, ws, payload})
        //     case "play": playing({ games, players, ws, connections, payload})
            
        //     case "title-and-summary": titleAndSummary({ games, ws, payload, payload})
        //     case "add-new-sentence": addNewSentence({ games, players, ws, payload})
        //     case "voting-best-sentence": votingBestSentence({ games, players, ws, payload})
        //     case "switch-activity": switchActivity({ games, ws, payload})
        //     case "disconnect": 
        // }
    })

    ws.on("close", () => {
        console.log('Client disconnected')
    })
})
