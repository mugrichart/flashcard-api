const { generateId } = require("./utils")

const avatars = [
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702185/Flashcards/avatars/brandon-zacharias-ITo4f_z3wNM-unsplash_dkbftg.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702184/Flashcards/avatars/oguz-yagiz-kara-uTlMt9o7SHE-unsplash_syoyny.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/oguz-yagiz-kara-p_cgt8XJ1W4-unsplash_m8juzj.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/fatane-rahimi-Agv-xPQBO60-unsplash_r1rjiy.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/alex-suprun-ZHvM3XIOHoE-unsplash_lgxi6w.jpg"
]

class Player {
    static ID = 0;
    constructor ({playerName, playerID, avatar}) {
        this.playerID = playerID;
        this.playerScore = 0;
        this.playerRank = 0;
        this.playerName = playerName || "anonymous"
        this.playerAvatar = avatar || Player.availableAvatars.pop() || avatars[0]
    }
    static availableAvatars = [...avatars]
}

class Game {
    static ID = 0
    static MAX_PLAYER_COUNT = 5
    constructor (typeOfGame, words) {
        this.gameID = generateId(Game.ID++)
        this.typeOfGame = typeOfGame
        this.creator = ""
        this.players = []
        this.words = words
        this.player_count = this.players.length
        this.state = {
            status: "waiting"
        }
    }

    addPlayer ({ playerID = "", isCreator = false }) {
        if (isCreator) this.creator = playerID
        this.players.push(playerID)
        this.player_count = this.players.length
    }

}

const games = {}

const connections = {}

const players = {}

module.exports = {
    Game, Player,
    games, players,
    connections,
}