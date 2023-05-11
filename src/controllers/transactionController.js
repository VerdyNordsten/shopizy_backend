const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { success, failed } = require("../helpers/response");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const transactionModel = require("../models/transactionModel");
const createPagination = require("../helpers/createPagination");

module.exports = {
	createTransaction: async (req, res) => {
		try {
			const { productId, paymentMethod, city, postalCode, address, recipientPhone, recipientName, price, qty, color, size } = req.body;
			const product = await productModel.findBy("id", productId);
			if (parseInt(qty) > product.rows[0].stock) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Create Transaction Failed",
					error: "Insufficient stock",
				});
				return;
			}
			const store = await userModel.findStoreBy("id", product.rows[0].store_id);
			const user = await userModel.findBy("id", store.rows[0].user_id);
			const transactionData = await transactionModel.insertTransaction({
				id: uuidv4(),
				invoice: crypto.randomBytes(10).toString("hex"),
				total: price * qty,
				paymentMethod,
				status: 1,
				city,
				postalCode,
				address,
				recipientPhone,
				recipientName,
				date: new Date(),
				color,
				size,
			});
			await transactionModel.insertTransactionDetail({
				id: uuidv4(),
				buyerId: req.APP_DATA.tokenDecoded.id,
				sellerId: user.rows[0].id,
				transactionId: transactionData.rows[0].id,
				productId,
				price,
				qty,
			});
			const newStock = product.rows[0].stock - qty;
			await productModel.reduceStock(productId, newStock);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Create Transaction Success",
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

	listTransactionAdmin: async (req, res) => {
		try {
			const { page, limit, sort = "" } = req.query;
			const count = await transactionModel.countTransaction();
			const countNumber = count.rows.length ? count.rows[0].count : 0;
			const paging = createPagination(countNumber, page, limit);
			const transactions = await transactionModel.selectListTransaction(paging, sort);
			for (let i = 0; i < transactions.rows.length; i++) {
				const sellerData = await userModel.findBy("id", transactions.rows[i].seller_id);
				const buyerData = await userModel.findBy("id", transactions.rows[i].buyer_id);
				transactions.rows[i].seller_data = sellerData.rows[0];
				transactions.rows[i].buyer_data = buyerData.rows[0];
			}
			success(res, {
				code: 200,
				status: "success",
				data: transactions.rows,
				message: "Select List Transaction Success",
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

	cancelTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			if (!transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Cancel Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			if (transaction.rows[0].status !== 1) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Cancel Transaction Failed",
					error: "You can't cancel this transaction",
				});
				return;
			}
			await transactionModel.changeTransactionStatus(id, 0);
			const transactionDetail = await transactionModel.findDetailBy("transaction_id", id);
			const product = await productModel.findBy("id", transactionDetail.rows[0].product_id);
			const newStock = product.rows[0].stock + transactionDetail.rows[0].qty;
			await productModel.reduceStock(transactionDetail.rows[0].product_id, newStock);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Cancel Transaction Success",
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

	packedTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			if (!transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Packed Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			await transactionModel.changeTransactionStatus(id, 2);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Packed Transaction Success",
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

	sentTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			if (!transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Sent Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			await transactionModel.changeTransactionStatus(id, 3);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Sent Transaction Success",
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

	completedTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			if (!transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Completed Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			await transactionModel.changeTransactionStatus(id, 4);
			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Completed Transaction Success",
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

	listTransaction: async (req, res) => {
		try {
			const user = await userModel.findBy("id", req.APP_DATA.tokenDecoded.id);
			if (user.rows[0].level === 2) {
				const { page, limit } = req.query;
				const count = await transactionModel.countGetListSellerTransaction(req.APP_DATA.tokenDecoded.id);
				const countNumber = count.rows.length ? count.rows[0].count : 0;
				const paging = createPagination(countNumber, page, limit);
				const transactions = await transactionModel.getListSellerTransaction(req.APP_DATA.tokenDecoded.id, paging);
				success(res, {
					code: 200,
					status: "success",
					data: transactions.rows,
					message: "Get List Seller Transaction Success",
				});
			}
			else {
				const { page, limit } = req.query;
				const count = await transactionModel.countGetListBuyerTransaction(req.APP_DATA.tokenDecoded.id);
				const countNumber = count.rows.length ? count.rows[0].count : 0;
				const paging = createPagination(countNumber, page, limit);
				const transactions = await transactionModel.getListBuyerTransaction(req.APP_DATA.tokenDecoded.id, paging);
				success(res, {
					code: 200,
					status: "success",
					data: transactions.rows,
					message: "Get List Buyer Transaction Success",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},

	getDetailTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			if (!transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Get Detail Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			const transactionDetail = await transactionModel.detailTransaction(id);
			success(res, {
				code: 200,
				status: "success",
				data: transactionDetail.rows[0],
				message: "Get Detail Transaction Success",
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

// status
// 0 = cancelled
// 1 = new
// 2 = packed
// 3 = sent
// 4 = completed
