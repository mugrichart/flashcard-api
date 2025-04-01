
import { createStoryHandler } from "../../personal/deck.js"

export default async({ games, socket, io, payload}) => {
    const gameInfo = payload
    if (gameInfo.data?.step === "uploading") {
        console.log(gameInfo.data)
        const { title, summary, details, words } = gameInfo.data;
        const createdStory = await createStoryHandler(
            null, 
            { title, summary, details, leadAuthor: gameInfo.creator, 
            coAuthors: Object.keys(gameInfo.players).filter(playerID => playerID !== gameInfo.creator), words: words || []
            }
        )
        console.log(createdStory)

        gameInfo.stories = gameInfo.stories || []
        gameInfo.data.step = "catalog"
        gameInfo.stories.push(createdStory) 
    }
    io.to(gameInfo.id).emit(socket.requestPath, {...gameInfo, source: null}) 
}