/* eslint-disable quotes */
const { success, failed } = require("../helpers/response");
const cartModel = require("../models/cartModel");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	addCart: async (req, res) => {
		try {
			const userId = req.APP_DATA.tokenDecoded.id;
			const { productId, qty, color, size } = req.body;
			const productData = await cartModel.getProductDetail(productId);
			if (productData.rowCount == 0) {
				const err = {
					message: `no product found with id ${productId}`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (productData.rows[0].is_active == false) {
				const err = {
					message: `product with id ${productId} is non active`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (productData.rows[0].stock < qty) {
				const err = {
					message: `the number of quantity exceeds the stock product`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const id = uuidv4();
			const data = {
				id,
				userId,
				productId,
				qty,
				color,
				size,
			};
			await cartModel.addCartData(data);
			success(res, {
				code: 200,
				status: "success",
				message: "success add new cart",
				data: data,
				paggination: [],
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},

	myCart: async (req, res) => {
		try {
			const userId = req.APP_DATA.tokenDecoded.id;
			const data = await cartModel.myCartData(userId);
			if (data.rowCount == 0) {
				const err = {
					message: `data not found`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const combData = await Promise.all(
				data.rows.map(async (item) => {
					const productImages = await cartModel.produtImagesData(
						item.productid
					);
					const obj = {
						dataCart: item,
						productImages: productImages.rows,
					};
					return obj;
				})
			);
			success(res, {
				code: 200,
				status: "success",
				message: "success get my cart",
				data: combData,
				paggination: [],
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},

	deleteCart: async (req, res) => {
		try {
			const id = req.params.id;
			const userId = req.APP_DATA.tokenDecoded.id;
			const cartDetail = await cartModel.detailCartData(id);
			if (cartDetail.rowCount == 0) {
				const err = {
					message: `data not found`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (cartDetail.rows[0].user_id != userId) {
				const err = {
					message: `its not your cart`,
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			await cartModel.deleteCartData(id);
			success(res, {
				code: 200,
				status: "success",
				message: `Success delete cart`,
				data: cartDetail.rows[0],
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: error.message,
				error: [],
			});
			return;
		}
	},
};
