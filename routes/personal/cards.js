import express from "express";
const router = express.Router();

// import {getDeckCards, createCard, deleteCards} from '../controllers/personal/cards.js'
import { updateTemporary, getTemporary, stealFromTemporary } from "../../controllers/personal/temporary.js"
router.route('/temporary').patch(updateTemporary).post(stealFromTemporary)
router.route('/temporary/:tempId').get(getTemporary)
// router.route('/:deckName').get(getDeckCards).post(createCard).delete(deleteCards)

export  default router