-- Database schema DDL for AetherOS AI Platform

-- 1. Warehouses
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    occupied INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    reliability_rate NUMERIC(5, 2) NOT NULL,
    avg_delay_hours INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shipments (Active Cargo Lanes)
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    carrier_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    origin_port VARCHAR(100) NOT NULL,
    destination_port VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    risk_factor NUMERIC(5, 2),
    carbon_tonnes NUMERIC(8, 2),
    departure_date TIMESTAMP NOT NULL,
    arrival_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(id) ON DELETE CASCADE,
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    quantity INT NOT NULL,
    reorder_point INT NOT NULL,
    safety_stock INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    operator VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_component VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_route ON shipments(origin_port, destination_port);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_audit_operator ON audit_logs(operator);
