const express = require('express');
const router = express.Router();

const { deleteDecks, getDeck, updateMastery, createStory, getStories, getDecks } = require('../controllers/deck')

router.route('/deck').get(getDeck).patch(updateMastery).delete(deleteDecks)
router.route('/decks').get(getDecks)
router.route('/story-time/:deckId').post(createStory).get(getStories);

module.exports = router