
import gameRouter from "./game.js"

import network from "./core/network.js"

network.use("game", gameRouter)
// network.use("story", storyRouter)
// network.use("chat", chatRouter)
 //! We are starting already but in the future, we need to start this only when at least one user heads to network // and closes

export default network