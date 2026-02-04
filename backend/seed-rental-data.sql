-- ============================================
-- Rental Module Test Data Seed Script
-- ============================================
-- Dit SQL bestand voegt test data toe aan de rental module
-- Compatible met pgAdmin, DBeaver, en andere SQL clients
-- 
-- Gebruik in pgAdmin:
-- 1. Open Query Tool
-- 2. Open dit bestand
-- 3. Execute (F5)
-- ============================================

BEGIN;

-- ============================================
-- 1. RENTAL PRICING (7 items)
-- ============================================

INSERT INTO rental_pricing (product_id, rental_type, monthly_price, deposit_amount, is_available, created_at, updated_at) VALUES
('prod_laptop_dell_xps_15', 'flex', 89.99, 500.00, true, NOW(), NOW()),
('prod_laptop_dell_xps_15', 'jaar', 69.99, 500.00, true, NOW(), NOW()),
('prod_laptop_macbook_pro_14', 'flex', 129.99, 800.00, true, NOW(), NOW()),
('prod_laptop_macbook_pro_14', 'jaar', 99.99, 800.00, true, NOW(), NOW()),
('prod_monitor_dell_27', 'flex', 29.99, 150.00, true, NOW(), NOW()),
('prod_monitor_dell_27', 'jaar', 24.99, 150.00, true, NOW(), NOW()),
('prod_docking_station', 'flex', 19.99, 100.00, true, NOW(), NOW());

-- ============================================
-- 2. RENTAL CONTRACTS (5 items)
-- ============================================

-- Contract 1: RC-2026-001 (Actief Flex)
INSERT INTO rental_contract (id, customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) VALUES
('rc_01', 'cus_01JKHW8XQZM9P2N3R4T5V6W7X8', 'RC-2026-001', 'flex', 'actief', '2025-12-01', '2026-12-01', '2026-03-01', 89.99, 500.00, 'betaald', 'Eerste contract voor nieuwe klant. Levering op kantoor.', NOW(), NOW());

-- Contract 2: RC-2026-002 (Actief Jaar)
INSERT INTO rental_contract (id, customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) VALUES
('rc_02', 'cus_02JKHW8XQZM9P2N3R4T5V6W7X9', 'RC-2026-002', 'jaar', 'actief', '2026-01-15', '2027-01-15', '2027-01-15', 99.99, 800.00, 'betaald', 'MacBook Pro voor designer. Inclusief docking station.', NOW(), NOW());

-- Contract 3: RC-2026-003 (In Afwachting)
INSERT INTO rental_contract (id, customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) VALUES
('rc_03', 'cus_03JKHW8XQZM9P2N3R4T5V6W7Y0', 'RC-2026-003', 'flex', 'in_afwachting', '2026-02-10', '2027-02-10', '2026-05-10', 29.99, 150.00, 'openstaand', 'Wacht op betaling borg voordat levering kan plaatsvinden.', NOW(), NOW());

-- Contract 4: RC-2025-089 (Beëindigd)
INSERT INTO rental_contract (id, customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) VALUES
('rc_04', 'cus_04JKHW8XQZM9P2N3R4T5V6W7Y1', 'RC-2025-089', 'jaar', 'beëindigd', '2025-01-01', '2026-01-01', '2026-01-01', 69.99, 500.00, 'terugbetaald', 'Contract succesvol afgerond. Apparatuur in goede staat geretourneerd.', NOW(), NOW());

-- Contract 5: RC-2026-004 (Eindigt Binnenkort)
INSERT INTO rental_contract (id, customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) VALUES
('rc_05', 'cus_05JKHW8XQZM9P2N3R4T5V6W7Y2', 'RC-2026-004', 'flex', 'eindigt_binnenkort', '2025-11-01', '2026-02-01', '2026-02-01', 89.99, 500.00, 'betaald', 'Opzegtermijn loopt. Klant wil niet verlengen.', NOW(), NOW());

-- ============================================
-- 3. CONTRACT ITEMS (6 items)
-- ============================================

INSERT INTO rental_contract_item (contract_id, product_id, quantity, serial_number, condition_at_delivery, condition_at_return, created_at, updated_at) VALUES
-- RC-2026-001 items
('rc_01', 'prod_laptop_dell_xps_15', 1, 'DXP15-2024-A1234', 'nieuw', NULL, NOW(), NOW()),

-- RC-2026-002 items
('rc_02', 'prod_laptop_macbook_pro_14', 1, 'MBP14-2024-B5678', 'nieuw', NULL, NOW(), NOW()),
('rc_02', 'prod_docking_station', 1, 'DOCK-2024-C9012', 'nieuw', NULL, NOW(), NOW()),

-- RC-2026-003 items
('rc_03', 'prod_monitor_dell_27', 2, 'MON27-2024-D3456', 'nieuw', NULL, NOW(), NOW()),

-- RC-2025-089 items (beëindigd)
('rc_04', 'prod_laptop_dell_xps_15', 1, 'DXP15-2023-E7890', 'nieuw', 'goed', NOW(), NOW()),

-- RC-2026-004 items
('rc_05', 'prod_laptop_dell_xps_15', 1, 'DXP15-2024-F1122', 'nieuw', NULL, NOW(), NOW());

-- ============================================
-- 4. QUOTE REQUESTS (5 items)
-- ============================================

INSERT INTO quote_request (company_name, contact_person, email, phone, desired_start_date, desired_end_date, desired_items, status, notes, created_at, updated_at) VALUES
-- Quote 1: Tech Startup BV (Nieuw)
('Tech Startup BV', 'Jan Jansen', 'jan@techstartup.nl', '+31612345678', '2026-03-01', '2026-03-15', 
 '[{"product_id":"prod_laptop_dell_xps_15","quantity":5},{"product_id":"prod_monitor_dell_27","quantity":5}]', 
 'nieuw', 'Voor tijdelijk project. Levering op kantoor gewenst.', NOW(), NOW()),

-- Quote 2: Event Company Amsterdam (In Behandeling)
('Event Company Amsterdam', 'Sarah de Vries', 'sarah@eventcompany.nl', '+31687654321', '2026-04-10', '2026-04-12', 
 '[{"product_id":"prod_laptop_macbook_pro_14","quantity":10},{"product_id":"prod_docking_station","quantity":10}]', 
 'in_behandeling', 'Voor conferentie. Moet 1 dag voor event geleverd worden.', NOW(), NOW()),

-- Quote 3: Marketing Bureau Rotterdam (Offerte Verstuurd)
('Marketing Bureau Rotterdam', 'Peter Bakker', 'peter@marketingbureau.nl', '+31698765432', '2026-02-15', '2026-03-15', 
 '[{"product_id":"prod_laptop_macbook_pro_14","quantity":3}]', 
 'offerte_verstuurd', 'Offerte verstuurd op 2026-02-01. Wacht op reactie.', NOW(), NOW()),

-- Quote 4: Consultancy Firm Utrecht (Geaccepteerd)
('Consultancy Firm Utrecht', 'Lisa Vermeulen', 'lisa@consultancy.nl', '+31676543210', '2026-01-20', '2026-02-20', 
 '[{"product_id":"prod_laptop_dell_xps_15","quantity":2},{"product_id":"prod_monitor_dell_27","quantity":2},{"product_id":"prod_docking_station","quantity":2}]', 
 'geaccepteerd', 'Klant heeft offerte geaccepteerd. Contract wordt opgesteld.', NOW(), NOW()),

-- Quote 5: Design Studio Den Haag (Afgewezen)
('Design Studio Den Haag', 'Mark de Jong', 'mark@designstudio.nl', '+31665432109', '2026-02-01', '2026-02-07', 
 '[{"product_id":"prod_laptop_macbook_pro_14","quantity":1}]', 
 'afgewezen', 'Klant vond prijs te hoog. Geen reactie meer ontvangen.', NOW(), NOW());

COMMIT;

-- ============================================
-- SUMMARY (as SQL comments)
-- ============================================
-- Rental data seeding completed successfully!
-- Summary:
--   - 7 rental pricings
--   - 5 rental contracts
--   - 6 contract items
--   - 5 quote requests
-- 
-- Total: 23 records added
-- 
-- You can now view the data in the admin UI:
--   -> http://localhost:9000/app/rentals
--   -> http://localhost:9000/app/rental-pricing
--   -> http://localhost:9000/app/quote-requests
-- ============================================
