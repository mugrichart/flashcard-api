
import GameFactory from "../../../factories/network/game.js";
import { games, ballotCenter, gameScoreKeeper } from "../../../db/store.js"
import create from "./create.js"
import join from "./join.js"
import lobbyUpdate from "./lobby.js";
import inPorgressUpdate from "./in-porgress.js";
import postGame from "./post-game.js";

export default class GameHandle {
    
    static create (resources) {
        create({ GameFactory, games, ...resources })
    }

    static join (resources) {
        join({ GameFactory, games, ...resources })
    }
    
    static lobby (resources) {
        lobbyUpdate({ games, ...resources})
    }

    static inProgress (resources) {
        inPorgressUpdate({ games, ballotCenter, gameScoreKeeper, ...resources })
    }

    static postGame (resources) {
        postGame({ games, ...resources})
    }
}