
const {
    fullScriptGen
}from "./openai-process/actingScriptGenerator")


async function runner () {
    const script = await fullScriptGen(
        undefined,
        undefined,
        ["scrutinize", "emerald", "lavender", "organic", "shake it off", "walk around"],
        [   
            {
                playerName: "Jayce",
                isKeyPlayer: false
            }, 
            {
                playerName: "Richmond",
                isKeyPlayer: false
            }, 
            {
                playerName: "Mugisha",
                isKeyPlayer: true
            }, 
        ]
    )

    //console.log(script)
}

runner()