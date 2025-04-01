function findMostLikelyWord(inputWord, outputWords) {
    try {
        const inputExampleSplitWordsList = inputWord.example.split(' ')

        const listOfOutputWordExampleAgainstInputWordExampleComparisons = outputWords.map(
            outputWord => ({
                outputWord,
                similarityCount: findSimilarityInExamples(inputExampleSplitWordsList, outputWord.example)
            })
        )

        const orderedComparisonResults = listOfOutputWordExampleAgainstInputWordExampleComparisons.sort((a, b) => a.similarityCount - b.similarityCount)

        const mostSimilarWord = orderedComparisonResults[orderedComparisonResults.length - 1]

        return mostSimilarWord.outputWord

        return overallClosest
    } catch (error) {
        throw error
    }
    
}

const findSimilarityInExamples = (inputExampleSplitWordsList, outputWordExample) => {
    const similarWordsList = inputExampleSplitWordsList.filter(word => outputWordExample?.includes(word))
    const similarityCount = similarWordsList.length / inputExampleSplitWordsList.length
    return similarityCount
}

export {
    findMostLikelyWord as matchingInputWordToProbableOuput
}
