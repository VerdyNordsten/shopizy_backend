const express = require("express");
const validation = require("../validations/productValidation");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const multipleUpload = require("../middleware/multipleUpload");
const { onlySeller, productOwner } = require("../middleware/authorization");
const { addProduct, listProduct, newProduct, disableProduct, listMyProduct, detailProduct, removeProductPhoto, editProduct, listProductByCategory } = require("../controllers/productController");

const router = express.Router();

router
	.get("/product", listProduct) // get semua product
	.get("/product/new", newProduct) // get 20 product terbaru
	.get("/product/my", jwtAuth, listMyProduct) // get semua product milik user yang sedang login
	.get("/product/:id", jwtAuth, detailProduct) // get detail product
	.get("/product/:id/category", jwtAuth, listProductByCategory) // get semua product by category
	.post("/product", jwtAuth, onlySeller, multipleUpload, validation.insert, runValidation, addProduct)
	.put("/product/:id", jwtAuth, onlySeller, productOwner, multipleUpload, validation.insert, runValidation, editProduct)
	.put("/product/:id/disable", jwtAuth, onlySeller, productOwner, disableProduct)
	.delete("/product/image/:id", jwtAuth, onlySeller, removeProductPhoto);

module.exports = router;
