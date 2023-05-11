const express = require("express");
const { isVerified } = require("../middleware/authorization");
const validation = require("../validations/authValidation");
const runValidation = require("../middleware/runValidation");
const { registerBuyer, registerSeller, activation, login, forgot, reset } = require("../controllers/authController");

const router = express.Router();

router
	.post("/auth/register/buyer", validation.register, runValidation, registerBuyer)
	.post("/auth/register/seller", validation.registerSeller, runValidation, registerSeller)
	.get("/auth/activation/:token", activation)
	.post("/auth/login", isVerified, validation.login, runValidation, login)
	.post("/auth/forgot", isVerified, validation.forgot, runValidation, forgot)
	.post("/auth/reset/:token", validation.reset, runValidation, reset);

module.exports = router;