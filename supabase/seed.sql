-- ============================================================
-- CV Akurat Sukses Sejati — Seed Data
-- File: supabase/seed.sql
-- ============================================================

-- 1. SEED: Categories
INSERT INTO public.categories (name) VALUES
  ('AKI'),
  ('SPAREPART'),
  ('CHARGER'),
  ('ANALITIK'),
  ('AKSESORIS')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED: Units
INSERT INTO public.units (name) VALUES
  ('UNIT'),
  ('PCS'),
  ('BOX'),
  ('SET')
ON CONFLICT (name) DO NOTHING;

-- 3. SEED: Suppliers
INSERT INTO public.suppliers (supplier_code, name, contact_name, email, address, phone) VALUES
  ('S001', 'PT. Astra Otoparts Tbk', 'Bambang Sudiro', 'sales@astra-otoparts.co.id', 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta Utara', '021-4603550'),
  ('S002', 'PT. GS Battery Indonesia', 'Hendra Wijaya', 'order@gs-battery.co.id', 'Kawasan Industri KIIC Lot. P-1, Karawang', '0267-640123'),
  ('S003', 'PT. Denso Sales Indonesia', 'Rian Pratama', 'contact@denso.co.id', 'Jl. Gaya Motor I No. 6, Sunter II, Jakarta Utara', '021-6512276')
ON CONFLICT (supplier_code) DO NOTHING;

-- 4. SEED: Master Items (Barang Otomotif)
INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT 
  '000001', 
  'Aki GS Astra Hybrid NS40Z (35Ah)', 
  c.id, 
  u.id, 
  785000
FROM public.categories c, public.units u
WHERE c.name = 'AKI' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT 
  '000002', 
  'Aki GS Astra Maintenance Free NS60 (45Ah)', 
  c.id, 
  u.id, 
  920000
FROM public.categories c, public.units u
WHERE c.name = 'AKI' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT 
  '000003', 
  'Busi Iridium Tough Denso VK20 (Set 4 Pcs)', 
  c.id, 
  u.id, 
  380000
FROM public.categories c, public.units u
WHERE c.name = 'SPAREPART' AND u.name = 'SET'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT 
  '000004', 
  'Smart Battery Charger 12V/24V 20A Digital', 
  c.id, 
  u.id, 
  550000
FROM public.categories c, public.units u
WHERE c.name = 'CHARGER' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT 
  '000005', 
  'Battery Tester & Analyzer Digital 12V BT-500', 
  c.id, 
  u.id, 
  1250000
FROM public.categories c, public.units u
WHERE c.name = 'ANALITIK' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

-- 5. SEED: Initial Inventory Stock & HPP
INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0001', i.id, 15, 680000
FROM public.items i WHERE i.item_code = '000001'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0002', i.id, 12, 790000
FROM public.items i WHERE i.item_code = '000002'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0003', i.id, 25, 310000
FROM public.items i WHERE i.item_code = '000003'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0004', i.id, 8, 440000
FROM public.items i WHERE i.item_code = '000004'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0005', i.id, 4, 1050000
FROM public.items i WHERE i.item_code = '000005'
ON CONFLICT (inventory_code) DO NOTHING;
