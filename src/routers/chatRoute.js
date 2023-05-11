const express = require("express");
const { insertInitialChat } = require("../controllers/chatController");
const jwtAuth = require("../middleware/jwtAuth");

const router = express.Router();

router.post("/chat", jwtAuth, insertInitialChat);

module.exports = router;
