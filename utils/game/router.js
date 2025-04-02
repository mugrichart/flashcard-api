
import dotenv from 'dotenv'

dotenv.config()

class Router {
    constructor ({ method, payload, games, players, Player, Game, connections, socket, io, balloCenter }) {
        this.method = method
        this.payload = payload
        this.games = games
        this.ballotCenter = balloCenter
        // this.players = players
        // this.Player = Player
        this.Game = Game
        // this.connections = connections
        this.io = io
        this.socket = socket
    }
    route = (route, callback) => {
        if (this.method === route) {
            if (process.env.ENV === "DEV") //console.log("===== METHOD: ", this.method)
            return callback({
                method: this.method, payload: this.payload, 
                games: this.games, 
                // players: this.players, 
                // Player: this.Player, 
                Game: this.Game, 
                // connections: this.connections, 
                socket: this.socket,
                io: this.io
            })
        }
    }
}

export default Router
