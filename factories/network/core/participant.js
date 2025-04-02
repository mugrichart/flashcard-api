
import { avatars } from "../../../db/store.js";

class Participant {
    constructor ({ username, userID, avatar }) {
        this.id = userID;
        this.username = username || "anonymous"
        this.avatar = avatar || Participant.availableAvatars.pop() || avatars[0]
    }

    static availableAvatars = [...avatars]
}

export default Participant