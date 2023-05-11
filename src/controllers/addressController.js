/* eslint-disable no-undef */
const { success, failed } = require("../helpers/response");
const addressModel = require("../models/addressModel");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	addAddress: async (req, res) => {
		try {
			const userId = req.APP_DATA.tokenDecoded.id;
			const { label, recipientName, recipientPhone, address, postalCode, city, isPrimary } = req.body;
			const addressUserData = await addressModel.checkUserAddressData(userId);
			let isPrimaryValue;
			if (isPrimary == false && addressUserData.rowCount == 0) {
				isPrimaryValue = true;
			} else if (isPrimary == true && addressUserData.rowCount > 0) {
				isPrimaryValue = true;
				const falseValue = false;
				await addressModel.changeAllMyAddressPrimaryFalse(userId, falseValue);
			} else {
				isPrimaryValue = isPrimary;
			}
			const id = uuidv4();
			const data = {
				id,
				userId,
				label,
				recipientName,
				recipientPhone,
				address,
				postalCode,
				city,
				isPrimaryValue,
			};
			await addressModel.addAddressData(data);
			success(res, {
				code: 200,
				status: "success",
				message: "success add new address",
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

	myAddress: async (req, res) => {
		try {
			const userId = req.APP_DATA.tokenDecoded.id;
			const data = await addressModel.myAddressData(userId);
			if (data.rowCount == 0) {
				const err = {
					message: "data not found",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			success(res, {
				code: 200,
				status: "success",
				message: "success get my address",
				data: data.rows,
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

	updateMyAddress: async (req, res) => {
		try {
			const userId = req.APP_DATA.tokenDecoded.id;
			const id = req.params.id;
			const { label, recipientName, recipientPhone, address, postalCode, city, isPrimary } = req.body;
			const addressDetail = await addressModel.detailAddressData(id);
			if (addressDetail.rowCount == 0) {
				const err = {
					message: "data not found",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (addressDetail.rows[0].user_id != userId) {
				const err = {
					message: "its not your address",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const dataPrimary = await addressModel.checkUserAddressIsPrimary(userId);
			if (dataPrimary.rows[0].id == addressDetail.rows[0].id && isPrimary == false) {
				const err = {
					message: "cannot update the address to not primary please set another address to primary first",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			let isPrimaryValue;
			if (isPrimary == true) {
				isPrimaryValue = true;
				const falseValue = false;
				await addressModel.changeAllMyAddressPrimaryFalse(userId, falseValue);
			} else {
				primaryvalue = false; // i dont know this right or not
			}
			const data = {
				id,
				label,
				recipientName,
				recipientPhone,
				address,
				postalCode,
				city,
				isPrimaryValue,
			};
			await addressModel.updateAddressData(data);
			success(res, {
				code: 200,
				status: "success",
				message: "success updated address",
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

	deleteAddress: async (req, res) => {
		try {
			const id = req.params.id;
			const userId = req.APP_DATA.tokenDecoded.id;
			const addressDetail = await addressModel.detailAddressData(id);
			if (addressDetail.rowCount == 0) {
				const err = {
					message: "data not found",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			if (addressDetail.rows[0].user_id != userId) {
				const err = {
					message: "its not your address",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			const dataPrimary = await addressModel.checkUserAddressIsPrimary(userId);
			if (dataPrimary.rows[0].id == addressDetail.rows[0].id) {
				const err = {
					message: "cannot delete the primary address ,please set another address to primary first",
				};
				failed(res, {
					code: 500,
					status: "error",
					message: err.message,
					error: [],
				});
				return;
			}
			await addressModel.deleteAddressData(id);
			success(res, {
				code: 200,
				status: "success",
				message: "Success delete address",
				data: addressDetail.rows[0],
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
