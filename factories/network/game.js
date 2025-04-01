
import Game from "./core/game.js";
import Story from "../core/story.js"

const GameFactory = {
    create (setup) {
        const game = new Game(setup)
        game.data = gameSelector(setup) // || { update: () => {} };  // ✅ Avoids `undefined.update()`
        return game
    }
}

const gameSelector = (setup) => {
    switch (setup.type) {
         case "story": return new Story(setup.data || {});
         default: return null;
    }
 }
 

export default GameFactory