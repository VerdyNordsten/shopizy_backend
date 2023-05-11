/* eslint-disable no-unused-vars */
const express = require("express");

// import controller
const { addCategory, allCategory, detailCategory, allCategoryActive, updateCategory, statusCategory, deleteCategory } = require("../controllers/categoryController");

// import middlewares
const upload = require("../middleware/upload");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyAdmin, onlyBuyer, onlySeller, buyerOrSeller } = require("../middleware/authorization");
// import validation rules
const { createValidation, updateValidation, statusValidation } = require("../validations/categoryValidation");

const router = express.Router();

router
	.get("/category", jwtAuth, onlyAdmin, allCategory) // get all category admin only
	.get("/category-active", allCategoryActive) // get category activ only buyer seller
	.get("/category/:id", detailCategory) // get detail category admin only
	.post("/category", jwtAuth, onlyAdmin, upload, createValidation, runValidation, addCategory) // add category admin only
	.put("/category/:id", upload, updateValidation, runValidation, updateCategory) // update category admin only
	.put("/category-status/:id", jwtAuth, onlyAdmin, statusValidation, runValidation, statusCategory) // admin only
	.delete("/category/:id", jwtAuth, onlyAdmin, deleteCategory); // delete category only admin

module.exports = router;
