const db = require("../config/db");

const cartModel = {
	getProductDetail: (productId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT * FROM product WHERE id='${productId}'
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	addCartData: (data) => {
		const { id, userId, productId, qty, color, size } = data;
		return new Promise((resolve, reject) => {
			db.query(
				`
      INSERT INTO cart(id, user_id, product_id, qty, color, size)
      VALUES('${id}','${userId}','${productId}',${qty}, '${color}', '${size}')
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	myCartData: (userId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT cart.id AS cartId ,cart.user_id AS cartUserId,cart.product_id AS cartProductId,cart.qty AS cartQty,cart.color AS cartColor,cart.size AS cartSize,
      product.id AS productId, product.product_name AS productName, product.price AS productPrice,
      store.id AS storeId, store_name AS storeName
      FROM cart
      INNER JOIN product ON cart.product_id = product.id
      INNER JOIN store ON product.store_id = store.id
      WHERE cart.user_id='${userId}'
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	produtImagesData: (productId) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM product_images WHERE product_id='${productId}'`, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	},

	detailCartData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT * FROM cart WHERE id='${id}'
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	
	deleteCartData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM cart WHERE id='${id}'`, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	},
};

module.exports = cartModel;
