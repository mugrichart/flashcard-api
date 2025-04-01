
import Room from "./room.js";
import Player from "./player.js";
import { generateId } from "./utils.js";

class Game {
    static ID = 0
    constructor(setup) {
        this.id = generateId(Game.ID++)
        this.type = setup.type;
        this.status = "lobby"; // lobby | starting | in progress | post-game
        this.statusHistory = ["lobby"]
        this.room = new Room(setup.room)
        this.creator = setup.creator
        this.players = {}
    }

    update(newSetup) {
        this.room.update(newSetup.room || {})
        this.data.update(newSetup.data || {})
    }

    addPlayer ({username, userID, avatar}) {
        if (!(userID in this.players))
            if (!this.creator) this.creator = userID
            if (!this.room.creator) this.room.creator = userID
            this.players[userID] = new Player({ username, userID, avatar })
    }
}

export default Game