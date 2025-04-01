import webSocketServer from "../../websocket"
const { create, join, 
    commandReaction, playingUpdate,
    playing
}from "./general/general")

const {
    titleAndSummary,
    addNewSentence,
    votingBestSentence,
    switchActivity
}from "./story/story")

const {
    shareSignal
}from "./chat/chat")

const Routerfrom "../../utils/game/router")
const { Game, Player, games, players }from "./utils/store")

// Get the Socket.IO instance
const io = webSocketServer.getIO()

// Replace raw WebSocket connection handling with Socket.IO
io.on("connection", (socket) => {
    // Handle incoming events
    socket.on("message", async(message) => {
        const { method, payload } = message
        
        const router = new Router({ 
            method, 
            payload, 
            games, 
            players, 
            Player, 
            Game, 
            socket,
            io
        })

        router.route("game/create", create)
        router.route("game/join", join)
        router.route("game/command", commandReaction)
        router.route("playing-update", playingUpdate)
        router.route("play", playing)

        router.route("title-and-summary", titleAndSummary)
        router.route("add-new-sentence", addNewSentence)
        router.route("voting-best-sentence", votingBestSentence)
        router.route("switch-activity", switchActivity)

        router.route("signal", shareSignal)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
        //console.log('Client disconnected')
        // TODO: Handle player cleanup on disconnect
    })
})
