
import { Router } from "./core/network.js"
import GameHandle from "../../controllers/network/game/index.js"

const gameRouter = new Router()

gameRouter.route("create", GameHandle.create);
gameRouter.route("join", GameHandle.join);
gameRouter.route("lobby", GameHandle.lobby)
gameRouter.route("in progress", GameHandle.inProgress)
gameRouter.route("post-game", GameHandle.postGame)

// gameRouter.route("game/command", commandReaction);
// gameRouter.route("playing/update", playingUpdate);
// gameRouter.route("play", playing);

export default gameRouter