import express from "express"
const router = express.Router();

import {getWords, addWordToDeck, addToWishList} from'../../controllers/personal/words.js';

router.route('/search').get(getWords)
router.route('/add-to-deck').post(addWordToDeck)
router.route('/add-to-wish-list').post(addToWishList)

export default router