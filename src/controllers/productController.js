const { v4: uuidv4 } = require("uuid");
const { success, failed } = require("../helpers/response");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const deleteFile = require("../helpers/deleteFile");
const uploadGoogleDrive = require("../helpers/uploadGoogleDrive");
const deleteGoogleDrive = require("../helpers/deleteGoogleDrive");
const createPagination = require("../helpers/createPagination");

module.exports = {
	listProduct: async (req, res) => {
		try {
			const { page, limit, search = "", sort = "", categoryFilter, colorFilter, sizeFilter } = req.query;
			const count = await productModel.countProduct(search);
			const countNumber = count.rows.length ? count.rows[0].count : 0;
			const paging = createPagination(countNumber, page, limit);
			let products = await productModel.selectListProduct(paging, search, sort, categoryFilter);
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(products.rows[i].id);
				const productSizes = await productModel.selectAllProductSize(products.rows[i].id);
				const productColors = await productModel.selectAllProductColor(products.rows[i].id);
				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}
			if (colorFilter) {
				products.rows = products.rows.filter((product) => {
					const colorArray = [];
					product.product_color.forEach((item) => {
						colorArray.push(item.color_name);
					});
					return colorArray.includes(colorFilter);
				});
			}
			if (sizeFilter) {
				products.rows = products.rows.filter((product) => {
					const sizeArray = [];
					product.product_sizes.forEach((item) => {
						sizeArray.push(item.size);
					});
					return sizeArray.includes(parseInt(sizeFilter));
				});
			}
			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List Product Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	listProductByCategory: async (req, res) => {
		try {
			const { id: categoryId } = req.params;
			const { page, limit, search = "", sort = "" } = req.query;
			const count = await productModel.countProductByCategory(categoryId, search);
			const countNumber = count.rows.length ? count.rows[0].count : 0;
			const paging = createPagination(countNumber, page, limit);
			const products = await productModel.selectListProductByCategory(categoryId, paging, search, sort);
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(products.rows[i].id);
				const productSizes = await productModel.selectAllProductSize(products.rows[i].id);
				const productColors = await productModel.selectAllProductColor(products.rows[i].id);
				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}
			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List Product By Category Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	detailProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.detailProduct(id);
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Select Detail Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}
			const productImages = await productModel.selectAllProductImage(product.rows[0].id);
			const productSizes = await productModel.selectAllProductSize(product.rows[0].id);
			const productColors = await productModel.selectAllProductColor(product.rows[0].id);
			product.rows[0].product_images = productImages.rows;
			product.rows[0].product_sizes = productSizes.rows;
			product.rows[0].product_color = productColors.rows;
			success(res, {
				code: 200,
				status: "success",
				data: product.rows[0],
				message: "Select Detail Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	listMyProduct: async (req, res) => {
		try {
			const id = req.APP_DATA.tokenDecoded.id;
			const { page, limit, search = "", sort = "" } = req.query;
			const store = await userModel.findStoreBy("user_id", id);
			const storeId = store.rows[0].id;
			const count = await productModel.countProductById(storeId, search);
			const countNumber = count.rows.length ? count.rows[0].count : 0;
			const paging = createPagination(countNumber, page, limit);
			const products = await productModel.selectListProductById(storeId, paging, search, sort);
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(products.rows[i].id);
				const productSizes = await productModel.selectAllProductSize(products.rows[i].id);
				const productColors = await productModel.selectAllProductColor(products.rows[i].id);
				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}
			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List My Product Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	newProduct: async (req, res) => {
		try {
			const products = await productModel.selectNewProduct();
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(products.rows[i].id);
				const productSizes = await productModel.selectAllProductSize(products.rows[i].id);
				const productColors = await productModel.selectAllProductColor(products.rows[i].id);
				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}
			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select New Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	addProduct: async (req, res) => {
		try {
			const { storeId, categoryId, brandId, productName, price, description, stock, productSizes, productColors, isNew } = req.body;
			const productData = await productModel.insertProduct({
				id: uuidv4(),
				storeId,
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				rating: 8,
				createdAt: new Date(),
				isActive: true,
				isNew,
			});
			if (req.files) {
				if (req.files.photo) {
					req.files.photo.map(async (item) => {
						const photoGd = await uploadGoogleDrive(item);
						await productModel.insertProductPhoto({
							id: uuidv4(),
							productId: productData.rows[0].id,
							photo: photoGd.id,
						});
						deleteFile(item.path);
					});
				}
			}
			if (productSizes) {
				JSON.parse(productSizes).map(async (item) => {
					await productModel.insertProductSizes({
						id: uuidv4(),
						productId: productData.rows[0].id,
						size: item.size,
					});
				});
			}
			if (productColors) {
				JSON.parse(productColors).map(async (color) => {
					await productModel.insertProductColors({
						id: uuidv4(),
						productId: productData.rows[0].id,
						colorName: color.colorName,
						colorValue: color.colorValue,
					});
				});
			}
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Insert New Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	editProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.detailProduct(id);
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Edit Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}
			const { categoryId, brandId, productName, price, description, stock, productSizes, productColors, isNew } = req.body;
			await productModel.updateProduct(id, {
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				isNew,
			});
			if (req.files) {
				if (req.files.photo) {
					req.files.photo.map(async (item) => {
						const photoGd = await uploadGoogleDrive(item);
						await productModel.insertProductPhoto({
							id: uuidv4(),
							productId: product.rows[0].id,
							photo: photoGd.id,
						});
						deleteFile(item.path);
					});
				}
			}
			await productModel.deleteAllProductSizes(product.rows[0].id);
			productSizes.map(async (size) => {
				await productModel.insertProductSizes({
					id: uuidv4(),
					productId: product.rows[0].id,
					size,
				});
			});
			await productModel.deleteAllProductColors(product.rows[0].id);
			productColors.map(async (color) => {
				await productModel.insertProductColors({
					id: uuidv4(),
					productId: product.rows[0].id,
					colorName: color.colorName,
					colorValue: color.colorValue,
				});
			});
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Edit Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	disableProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.findBy("id", id);
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Disable Or Enable Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}
			await productModel.disableOrEnable(id, !product.rows[0].is_active);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: `${product.rows[0].is_active ? "Disable" : "Enable"} Product Success`,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	removeProductPhoto: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.detailPhoto(id);
			await productModel.deleteProductPhoto(id);
			if (product.rowCount) {
				await deleteGoogleDrive(product.rows[0].photo);
			}
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Delete Product Photo Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
};
