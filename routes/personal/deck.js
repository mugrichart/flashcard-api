import express from "express"
const router = express.Router();

import  { deleteDecks, getDeck, updateMastery, createStory, getStories, getDecks } from "../../controllers/personal/deck.js"

router.route('/deck').get(getDeck).patch(updateMastery).delete(deleteDecks)
router.route('/decks').get(getDecks)
router.route('/story-time/:deckId').post(createStory).get(getStories);

export default router