CREATE DATABASE shopizy;

CREATE TABLE users (
	id VARCHAR PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	password VARCHAR(255),
	level INTEGER,
	is_verified BOOLEAN,
	token VARCHAR(255),
	photo VARCHAR(255)
);

CREATE TABLE profile (
	id VARCHAR PRIMARY KEY,
	user_id VARCHAR NOT NULL,
	phone VARCHAR(20),
	gender VARCHAR(10),
	birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE store (
	id VARCHAR PRIMARY KEY,
	user_id VARCHAR NOT NULL,
	store_name VARCHAR(255),
	store_phone VARCHAR(20),
	store_description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories (
    id VARCHAR PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    photo VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE buyers (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE sellers (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    store_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE chat (
	id VARCHAR PRIMARY KEY,
	sender VARCHAR NOT NULL,
	receiver VARCHAR NOT NULL,
	message TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES users(id),
    FOREIGN KEY (receiver) REFERENCES users(id)
);

CREATE TABLE address (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    label VARCHAR(255),
    recipient_name VARCHAR(255),
    recipient_phone VARCHAR(20),
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(255),
    is_primary boolean,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE product_brands (
    id VARCHAR PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product (
    id VARCHAR PRIMARY KEY,
    store_id VARCHAR NOT NULL,
    category_id VARCHAR NOT NULL,
    brand_id VARCHAR NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL,
    rating FLOAT,
    created_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_new BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES product_brands(id)
);

CREATE TABLE cart (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL,
    qty INTEGER,
    color VARCHAR(50),
    size VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL,
    photo VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE product_sizes (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL,
    size VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE product_color (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL,
    color_name VARCHAR(50) NOT NULL,
    color_value VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE transaction (
    id VARCHAR PRIMARY KEY,
    invoice VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total INTEGER NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    size VARCHAR(255) NOT NULL
);

CREATE TABLE transaction_detail (
    id VARCHAR PRIMARY KEY,
    transaction_id VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL,
    seller_id VARCHAR NOT NULL,
    buyer_id VARCHAR NOT NULL,
    price INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (buyer_id) REFERENCES buyers(id)
);

