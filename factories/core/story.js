
class Story {
    constructor({ title, summary, author, step, mode, details, sentenceIndex, sentenceInProgress, words }) {
        this.metadata = { title, summary, author };
        this.state = { 
            step: step || "onboarding", 
            mode, details: details || [], 
            sentenceIndex: sentenceIndex || 0, sentenceInProgress: sentenceInProgress || {},
            words: words || []
        };
    }

    get title() { return this.metadata.title}
    get summary() { return this.metadata.summary}
    get author() { return this.metadata.author}

    get step() { return this.state.step}
    get mode() { return this.state.mode}
    get details() { return this.state.details}
    get sentenceIndex() { return this.state.sentenceIndex}
    get sentenceInPractice() {  return this.details?.[this.sentenceIndex] }
    get sentenceInProgress() { return this.state.sentenceInProgress}

    nextSentence () {
        const newState = {...this.state, sentenceIndex: this.sentenceIndex + 1}
        return new StorySetup({ ...this.metadata, ...newState })
    }

    update(updates = {}) {
        const newMetadata = { ...this.metadata };
        const newState = { ...this.state };

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key in newMetadata) newMetadata[key] = value;
                else if (key in newState) newState[key] = value;
            }
        });

        return { ...newMetadata, ...newState };
    }

    rebuild(updates = {}) {
        const newSetup = this.update(updates)
        return new StorySetup(newSetup)
    }
}

export default Story
