CREATE TABLE sizes
(
    id     SERIAL PRIMARY KEY,
    abbrev VARCHAR(50) NOT NULL UNIQUE,
    name    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE delivery_types
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products
(
    id          SERIAL PRIMARY KEY,
    code   VARCHAR(50)  NOT NULL,
    name   VARCHAR(255) NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2) NOT NULL,
    images TEXT[] DEFAULT '{}'
);

CREATE TABLE product_sizes
(
    product_id INT NOT NULL,
    size_id    INT NOT NULL,
    PRIMARY KEY (product_id, size_id),
    CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_product_sizes_size FOREIGN KEY (size_id) REFERENCES sizes (id) ON DELETE CASCADE
);

CREATE TABLE orders
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255)   NOT NULL,
    email            VARCHAR(255)   NOT NULL,
    address          TEXT           NOT NULL,
    phone            VARCHAR(20),
    items            JSONB          NOT NULL,
    total            DECIMAL(10, 2) NOT NULL,
    delivery_type_id INT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_delivery_type FOREIGN KEY (delivery_type_id) REFERENCES delivery_types (id)
);

-- Sample data

INSERT INTO sizes (abbrev, name)
VALUES ('S', 'Small'),
       ('M', 'Medium'),
       ('L', 'Large');

INSERT INTO delivery_types (name)
VALUES ('Delivery'),
       ('Pick-up point');

INSERT INTO products (code, name, description, price, images)
VALUES ('SP1', 'Sample Product 1', 'Description for product 1', 29.99, ARRAY['/images/product1-1.jpg',
        '/images/product1-2.jpg']),
       ('SP2', 'Sample Product 2', 'Description for product 2', 49.99, ARRAY['/images/product2-1.jpg']);

INSERT INTO product_sizes (product_id, size_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 2);
