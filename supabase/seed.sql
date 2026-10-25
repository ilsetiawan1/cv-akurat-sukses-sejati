-- ============================================================
-- CV Akurat Sukses Sejati — Seed Data Bersih & Realistis
-- File: supabase/seed.sql
-- ============================================================

-- 1. SEED: Categories
INSERT INTO public.categories (name) VALUES
  ('AKI'),
  ('SPAREPART'),
  ('CHARGER'),
  ('ANALITIK'),
  ('PELUMAS')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED: Units
INSERT INTO public.units (name) VALUES
  ('UNIT'),
  ('PCS'),
  ('BOX'),
  ('SET'),
  ('BOTOL')
ON CONFLICT (name) DO NOTHING;

-- 3. SEED: Suppliers
INSERT INTO public.suppliers (supplier_code, name, contact_name, email, address, phone) VALUES
  ('S001', 'PT. Astra Otoparts Tbk', 'Bambang Sudiro', 'sales@astra-otoparts.co.id', 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta Utara', '021-4603550'),
  ('S002', 'PT. GS Battery Indonesia', 'Hendra Wijaya', 'order@gs-battery.co.id', 'Kawasan Industri KIIC Lot. P-1, Karawang', '0267-640123'),
  ('S003', 'PT. Denso Sales Indonesia', 'Rian Pratama', 'contact@denso.co.id', 'Jl. Gaya Motor I No. 6, Sunter II, Jakarta Utara', '021-6512276'),
  ('S004', 'PT. Dirgaputra Ekapratama', 'Agus Kurniawan', 'sales@dirgaputra.com', 'Jl. Pulo Buaran Raya Blok III EE Kav. 2-3, Kawasan Industri Pulogadung', '021-46825555')
ON CONFLICT (supplier_code) DO NOTHING;

-- 4. SEED: Master Items (Suku Cadang Otomotif)
INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000001', 'Aki GS Astra Hybrid NS40Z (35Ah)', c.id, u.id, 785000
FROM public.categories c, public.units u WHERE c.name = 'AKI' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000002', 'Aki GS Astra Maintenance Free NS60 (45Ah)', c.id, u.id, 920000
FROM public.categories c, public.units u WHERE c.name = 'AKI' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000003', 'Aki Yuasa Pafecta N50Z (60Ah)', c.id, u.id, 880000
FROM public.categories c, public.units u WHERE c.name = 'AKI' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000004', 'Busi Iridium Tough Denso VK20 (Set 4 Pcs)', c.id, u.id, 380000
FROM public.categories c, public.units u WHERE c.name = 'SPAREPART' AND u.name = 'SET'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000005', 'Busi NGK CPR8EA-9 Nickel', c.id, u.id, 35000
FROM public.categories c, public.units u WHERE c.name = 'SPAREPART' AND u.name = 'PCS'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000006', 'Filter Oli Mobil Denso DXE-1001', c.id, u.id, 45000
FROM public.categories c, public.units u WHERE c.name = 'SPAREPART' AND u.name = 'PCS'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000007', 'Kampas Rem Depan Bendix GCT Avanza/Xenia', c.id, u.id, 310000
FROM public.categories c, public.units u WHERE c.name = 'SPAREPART' AND u.name = 'SET'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000008', 'V-Belt Gates Micro-V 4PK815', c.id, u.id, 110000
FROM public.categories c, public.units u WHERE c.name = 'SPAREPART' AND u.name = 'PCS'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000009', 'Smart Battery Charger 12V/24V 20A Digital', c.id, u.id, 550000
FROM public.categories c, public.units u WHERE c.name = 'CHARGER' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000010', 'Battery Tester & Analyzer Digital 12V BT-500', c.id, u.id, 1250000
FROM public.categories c, public.units u WHERE c.name = 'ANALITIK' AND u.name = 'UNIT'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000011', 'Oli Mesin Shell Helix HX6 10W-40 (4 Liter)', c.id, u.id, 340000
FROM public.categories c, public.units u WHERE c.name = 'PELUMAS' AND u.name = 'BOTOL'
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.items (item_code, name, category_id, unit_id, price)
SELECT '000012', 'Minyak Rem Prestone DOT 4 300ml', c.id, u.id, 48000
FROM public.categories c, public.units u WHERE c.name = 'PELUMAS' AND u.name = 'BOTOL'
ON CONFLICT (item_code) DO NOTHING;

-- 5. SEED: Initial Inventory Stock & HPP (~Rp 31,5 Juta Total Modal)
INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0001', i.id, 10, 680000 FROM public.items i WHERE i.item_code = '000001'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0002', i.id, 8, 790000 FROM public.items i WHERE i.item_code = '000002'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0003', i.id, 6, 740000 FROM public.items i WHERE i.item_code = '000003'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0004', i.id, 12, 310000 FROM public.items i WHERE i.item_code = '000004'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0005', i.id, 25, 25000 FROM public.items i WHERE i.item_code = '000005'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0006', i.id, 15, 32000 FROM public.items i WHERE i.item_code = '000006'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0007', i.id, 6, 240000 FROM public.items i WHERE i.item_code = '000007'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0008', i.id, 8, 80000 FROM public.items i WHERE i.item_code = '000008'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0009', i.id, 5, 440000 FROM public.items i WHERE i.item_code = '000009'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0010', i.id, 2, 1050000 FROM public.items i WHERE i.item_code = '000010'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0011', i.id, 8, 275000 FROM public.items i WHERE i.item_code = '000011'
ON CONFLICT (inventory_code) DO NOTHING;

INSERT INTO public.inventory (inventory_code, item_id, stock, hpp)
SELECT 'DP0012', i.id, 15, 35000 FROM public.items i WHERE i.item_code = '000012'
ON CONFLICT (inventory_code) DO NOTHING;
