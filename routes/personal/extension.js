
import express from "express"
const router = express.Router();

import { getBlanks } from "../../controllers/extension/getBlanks.js"

router.route("/blanks")
    .post(getBlanks)

export  default router