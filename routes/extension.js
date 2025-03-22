
const express = require('express')
const router = express.Router();

const { getBlanks } = require("../controllers/extension/getBlanks")

router.route("/blanks")
    .post(getBlanks)

module.exports = router