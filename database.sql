-- database.sql
-- Create products table

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
