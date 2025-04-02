
class Quiz {
    constructor(setup) {
        this.step = "onboarding"
        this.deck = setup.deck || {}
    }
}

export default Quiz