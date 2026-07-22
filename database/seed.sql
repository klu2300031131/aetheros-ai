-- Seed database entries for AetherOS AI Platform

-- 1. Warehouses
INSERT INTO warehouses (name, city, country, capacity, occupied) VALUES
('Shanghai Hub Depot', 'Shanghai', 'China', 94000, 82000),
('Los Angeles Gateway Depot', 'Los Angeles', 'USA', 85000, 78000),
('Rotterdam Central Hub', 'Rotterdam', 'Netherlands', 90000, 88000),
('Dallas Inland Terminal', 'Dallas', 'USA', 70000, 65000);

-- 2. Suppliers
INSERT INTO suppliers (name, country, reliability_rate, avg_delay_hours, status) VALUES
('Ningbo Semiconductor Group', 'China', 98.2, 14, 'OPTIMAL'),
('Tokyo Micro Electronics', 'Japan', 94.8, 32, 'MODERATE_RISK'),
('Heidelberg Logistics GmbH', 'Germany', 88.5, 94, 'SEVERE_DELAY'),
('Austin Silicon Labs', 'USA', 99.4, 2, 'OPTIMAL');

-- 3. Shipments
INSERT INTO shipments (carrier_id, name, origin_port, destination_port, status, risk_factor, carbon_tonnes, departure_date, arrival_date) VALUES
('AETHER-994', 'Pacific Titan', 'Shanghai Port', 'Los Angeles Port', 'IN_TRANSIT', 14.0, 14.8, '2026-07-20 08:00:00', '2026-07-28 18:00:00'),
('AETHER-104', 'Atlas Air Cargo 482', 'Los Angeles Port', 'Frankfurt Airport', 'IN_TRANSIT', 4.0, 28.2, '2026-07-22 10:00:00', '2026-07-23 12:00:00'),
('AETHER-882', 'Euro Route Carrier', 'Rotterdam Terminal', 'Antwerp Port', 'IN_TRANSIT', 28.0, 2.1, '2026-07-22 06:00:00', '2026-07-22 14:00:00');

-- 4. Inventory
INSERT INTO inventory (warehouse_id, product_name, sku, quantity, reorder_point, safety_stock) VALUES
(1, 'High-Density Lithium Battery Packs', 'SKU-LI-BATT-99', 42000, 10000, 5000),
(2, 'Medical Temp-Controlled Injections', 'SKU-MED-TEMP-48', 8500, 2000, 1000),
(3, 'Semi-conductor Fabrication Wafers', 'SKU-SEMI-FAB-02', 12000, 3000, 1500);

-- 5. Audit Logs
INSERT INTO audit_logs (operator, action, target_component) VALUES
('Dr. Sarah Jenkins', 'Approved carrier route override (AETHER-994)', 'System Command'),
('API Key (FastAPI Connect)', 'Retrained Forecast model (Japan lane)', 'AI Models'),
('Dr. Sarah Jenkins', 'Regenerated Spring Boot access token', 'Security Credentials');
