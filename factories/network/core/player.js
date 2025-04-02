
import Participant from "./participant.js";
import { avatars } from "../../../db/store.js";

class Player extends Participant {
    constructor ({username, userID, avatar}) {
        super({ username, userID, avatar})
        this.score = 0;
        this.rank = 0;
        this.isSpeaking = false;
    }

    static availableAvatars = [...avatars]
}

export default Player