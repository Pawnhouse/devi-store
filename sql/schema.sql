CREATE TABLE products
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2) NOT NULL,
    images      TEXT[] DEFAULT '{}'
);

CREATE TABLE orders
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)   NOT NULL,
    email      VARCHAR(255)   NOT NULL,
    address    TEXT           NOT NULL,
    items      JSONB          NOT NULL,
    total      DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO products (name, description, price, images)
VALUES ('Sample Product 1', 'Description for product 1', 29.99, ARRAY['/images/product1-1.jpg',
        '/images/product1-2.jpg']),
       ('Sample Product 2', 'Description for product 2', 49.99, ARRAY['/images/product2-1.jpg']);