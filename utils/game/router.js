const { gameBroadcast } = require("../../controllers/games/utils/utils")

class Router {
    constructor ({ method, payload, games, players, Player, Game, connections, ws }) {
        this.method = method
        this.payload = payload
        this.games = games
        this.players = players
        this.Player = Player
        this.Game = Game
        this.connections = connections
        this.ws = ws
    }
    route = (route, callback) => {
        if (this.method === route) return callback({
            method: this.method, payload: this.payload, 
            games: this.games, players: this.players, 
            Player: this.Player, Game: this.Game, 
            connections: this.connections, ws: this.ws
        })
    }
}

module.exports = Router