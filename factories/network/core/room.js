
import { generateId } from "./utils.js"

class Room {
    static ID = 0
    static MAX_USERS = 5
    constructor (creator) {
        this.id = generateId(Room.ID++)
        this.creator = creator
        // this.users = [creator]
    }

    // update(newSetup) {
    //     Object.entries(newSetup).forEach(([settingKey, settingValue]) => {
    //         if (settingValue !== undefined) this[settingKey] = settingValue;
    //     });
    // }
}

export default Room