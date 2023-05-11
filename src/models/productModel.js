const db = require("../config/db");

module.exports = {
	findBy: (field, search) =>
		new Promise((resolve, reject) => {
			db.query(`SELECT * FROM product WHERE ${field}=$1`, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	detailProduct: (id) =>
		new Promise((resolve, reject) => {
			db.query("SELECT product.id, product.store_id, product.category_id, product.product_name, product.price, product.description, product.stock, product.rating, product.created_at, product.is_new, product.rating, product.is_active, store.store_name, store.store_phone, store.store_description FROM product INNER JOIN store ON product.store_id=store.id WHERE product.id=$1 AND product.is_active=true", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
		
	selectListProduct: (paging, search, sort, categoryFilter) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT product.id, product.store_id, product.category_id, product.product_name, product.price, product.description, product.stock, product.rating, product.created_at, product.is_active, store.store_name, store.store_phone, store.store_description, categories.category_name FROM product INNER JOIN store ON product.store_id=store.id INNER JOIN categories ON product.category_id=categories.id WHERE product.is_active=true AND LOWER(product.product_name) LIKE '%'||LOWER($1)||'%'";
			if (categoryFilter) {
				sql += ` AND LOWER(categories.category_name) = '${categoryFilter.toLowerCase()}'`;
			}
			if (sort.trim() === "name") {
				sql += " ORDER BY product.product_name ";
			} else if (sort.trim() === "stock") {
				sql += " ORDER BY product.stock ";
			} else if (sort.trim() === "price") {
				sql += " ORDER BY product.price ";
			} else {
				sql += " ORDER BY product.created_at ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;
			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	countProduct: (search) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT COUNT(*) FROM product INNER JOIN store ON product.store_id=store.id WHERE product.is_active=true AND LOWER(product.product_name) LIKE '%'||LOWER($1)||'%'";
			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectListProductByCategory: (categoryId, paging, search, sort) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT product.id, product.store_id, product.category_id, product.product_name, product.price, product.description, product.stock, product.rating, product.created_at, product.is_active, store.store_name, store.store_phone, store.store_description, categories.category_name FROM product INNER JOIN store ON product.store_id=store.id INNER JOIN categories ON product.category_id=categories.id WHERE product.is_active=true AND product.category_id=$1 AND LOWER(product.product_name) LIKE '%'||LOWER($2)||'%'";
			if (sort.trim() === "name") {
				sql += "ORDER BY product.product_name ";
			} else if (sort.trim() === "stock") {
				sql += "ORDER BY product.stock ";
			} else if (sort.trim() === "price") {
				sql += "ORDER BY product.price ";
			} else {
				sql += "ORDER BY product.created_at ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;
			db.query(sql, [categoryId, search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	countProductByCategory: (categoryId, search) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT COUNT(*) FROM product INNER JOIN store ON product.store_id=store.id INNER JOIN categories ON product.category_id=categories.id WHERE product.is_active=true AND product.category_id=$1 AND LOWER(product.product_name) LIKE '%'||LOWER($2)||'%'";
			db.query(sql, [categoryId, search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectListProductById: (storeId, paging, search, sort) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT * FROM product WHERE store_id=$1 AND LOWER(product.product_name) LIKE '%'||LOWER($2)||'%'";
			if (sort.trim() === "name") {
				sql += "ORDER BY product.product_name ";
			} else if (sort.trim() === "stock") {
				sql += "ORDER BY product.stock ";
			} else if (sort.trim() === "price") {
				sql += "ORDER BY product.price ";
			} else {
				sql += "ORDER BY product.created_at ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;
			db.query(sql, [storeId, search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	countProductById: (storeId, search) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT COUNT(*) FROM product WHERE store_id=$1 AND LOWER(product.product_name) LIKE '%'||LOWER($2)||'%'";
			db.query(sql, [storeId, search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectAllProductImage: (productId) =>
		new Promise((resolve, reject) => {
			db.query("SELECT  * FROM product_images WHERE product_id=$1", [productId], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectAllProductSize: (productId) =>
		new Promise((resolve, reject) => {
			db.query("SELECT  * FROM product_sizes WHERE product_id=$1", [productId], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectAllProductColor: (productId) =>
		new Promise((resolve, reject) => {
			db.query("SELECT  * FROM product_color WHERE product_id=$1", [productId], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	selectNewProduct: () =>
		new Promise((resolve, reject) => {
			db.query("SELECT product.id, product.store_id, product.category_id, product.product_name, product.price, product.description, product.stock, product.rating, product.created_at, product.is_active, store.store_name, store.store_phone, store.store_description FROM product INNER JOIN store ON product.store_id=store.id WHERE product.is_active=true ORDER BY product.created_at DESC LIMIT 24", (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	insertProduct: (body) =>
		new Promise((resolve, reject) => {
			const { id, storeId, categoryId, productName, brandId, price, description, stock, rating, createdAt, isActive, isNew } = body;
			db.query("INSERT INTO product (id, store_id, category_id, product_name, brand_id, price, description, stock, rating, created_at, is_active, is_new) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id", [id, storeId, categoryId, productName, brandId, price, description, stock, rating, createdAt, isActive, isNew], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	updateProduct: (id, body) =>
		new Promise((resolve, reject) => {
			const { categoryId, productName, brandId, price, description, stock, isNew } = body;
			db.query("UPDATE product SET category_id=$1, product_name=$2, brand_id=$3, price=$4, description=$5, stock=$6, is_new=$7 WHERE id=$8 RETURNING id", [categoryId, productName, brandId, price, description, stock, isNew, id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	insertProductPhoto: (data) =>
		new Promise((resolve, reject) => {
			const { id, productId, photo } = data;
			db.query("INSERT INTO product_images (id, product_id, photo) VALUES ($1, $2, $3) RETURNING id", [id, productId, photo], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	insertProductSizes: (data) =>
		new Promise((resolve, reject) => {
			const { id, productId, size } = data;
			db.query("INSERT INTO product_sizes (id, product_id, size) VALUES ($1, $2, $3) RETURNING id", [id, productId, size], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	insertProductColors: (data) =>
		new Promise((resolve, reject) => {
			const { id, productId, colorName, colorValue } = data;
			db.query("INSERT INTO product_color (id, product_id, color_name, color_value) VALUES ($1, $2, $3, $4) RETURNING id", [id, productId, colorName, colorValue], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	deleteAllProductSizes: (id) =>
		new Promise((resolve, reject) => {
			db.query("DELETE FROM product_sizes WHERE product_id=$1", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	deleteAllProductColors: (id) =>
		new Promise((resolve, reject) => {
			db.query("DELETE FROM product_color WHERE product_id=$1", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	disableOrEnable: (productId, status) =>
		new Promise((resolve, reject) => {
			db.query(`UPDATE product SET is_active=${status} WHERE id=$1 RETURNING is_active`, [productId], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	detailPhoto: (id) =>
		new Promise((resolve, reject) => {
			db.query("SELECT * FROM product_images WHERE id=$1", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	deleteProductPhoto: (id) =>
		new Promise((resolve, reject) => {
			db.query("DELETE FROM product_images WHERE id=$1", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),

	reduceStock: (id, stock) =>
		new Promise((resolve, reject) => {
			db.query("UPDATE product SET stock=$1 WHERE id=$2", [stock, id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
};
