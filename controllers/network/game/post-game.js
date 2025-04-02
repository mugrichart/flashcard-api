
import { createStoryHandler } from "../../personal/deck.js"

export default async({ games, socket, io, payload}) => {
    const gameInfo = payload
    if (gameInfo.data?.step === "uploading") {
        console.log(gameInfo.data)
        const { title, summary, details, words } = gameInfo.data;
        createStoryHandler(
            null, 
            { title, summary, details, leadAuthor: gameInfo.creator, 
            coAuthors: Object.keys(gameInfo.players).filter(playerID => playerID !== gameInfo.creator), words: words || []
            }
        ).then(console.log)
        .catch( e =>
            console.log(e.message)
        )

        gameInfo.stories = gameInfo.stories || []
        gameInfo.data.step = "catalog"
        gameInfo.stories.push(gameInfo.data) 
    }
    io.to(gameInfo.id).emit(socket.requestPath, {...gameInfo, source: null}) 
}