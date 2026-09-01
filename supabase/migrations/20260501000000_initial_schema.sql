-- ============================================================
-- CV Akurat Sukses Sejati — Initial Database Schema
-- File: supabase/migrations/20260501000000_initial_schema.sql
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: users
-- Data pengguna sistem (Super Admin, Admin, Manajer, Kasir)
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_code     VARCHAR(10)  NOT NULL UNIQUE, -- contoh: P01, P02
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,        -- managed by Supabase Auth
  role          VARCHAR(20)  NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  status        VARCHAR(10)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 3. TABLE: user_permissions
-- Hak akses granular (CRUD) per fitur untuk setiap pengguna
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  feature     VARCHAR(50) NOT NULL CHECK (feature IN ('dashboard', 'hak_akses', 'data_master', 'transaksi', 'laporan', 'pengaturan')),
  can_create  BOOLEAN NOT NULL DEFAULT FALSE,
  can_read    BOOLEAN NOT NULL DEFAULT FALSE,
  can_update  BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, feature)
);

-- 4. TABLE: suppliers
-- Data supplier suku cadang & aki otomotif
CREATE TABLE IF NOT EXISTS public.suppliers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_code  VARCHAR(10)  NOT NULL UNIQUE, -- contoh: S001, S002
  name           VARCHAR(150) NOT NULL,
  contact_name   VARCHAR(100),
  email          VARCHAR(150),
  address        TEXT,
  phone          VARCHAR(20),
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 5. TABLE: categories
-- Kategori barang (AKI, SPAREPART, CHARGER, ANALITIK, AKSESORIS)
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 6. TABLE: units
-- Satuan barang (UNIT, PCS, BOX, SET)
CREATE TABLE IF NOT EXISTS public.units (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLE: items
-- Data master produk / barang
CREATE TABLE IF NOT EXISTS public.items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_code     VARCHAR(10)    NOT NULL UNIQUE, -- contoh: 000001, 000002
  name          VARCHAR(200)   NOT NULL,
  category_id   UUID           REFERENCES public.categories(id) ON DELETE SET NULL,
  unit_id       UUID           REFERENCES public.units(id) ON DELETE SET NULL,
  price         NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- 8. TABLE: inventory
-- Data stok persediaan & HPP Moving Average
CREATE TABLE IF NOT EXISTS public.inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_code  VARCHAR(10)    NOT NULL UNIQUE, -- contoh: DP0001
  item_id         UUID           NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  stock           INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  hpp             NUMERIC(15, 2) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- 9. TABLE: goods_receipts (Barang Masuk)
CREATE TABLE IF NOT EXISTS public.goods_receipts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_code    VARCHAR(10)    NOT NULL UNIQUE, -- contoh: AD0001
  item_id         UUID           NOT NULL REFERENCES public.items(id),
  user_id         UUID           NOT NULL REFERENCES public.users(id),
  supplier_id     UUID           NOT NULL REFERENCES public.suppliers(id),
  quantity        INT            NOT NULL CHECK (quantity > 0),
  receipt_date    DATE           NOT NULL DEFAULT CURRENT_DATE,
  total_price     NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- 10. TABLE: goods_issues (Barang Keluar)
CREATE TABLE IF NOT EXISTS public.goods_issues (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_code   VARCHAR(10)    NOT NULL UNIQUE, -- contoh: AD0001
  user_id      UUID           NOT NULL REFERENCES public.users(id),
  item_id      UUID           NOT NULL REFERENCES public.items(id),
  quantity     INT            NOT NULL CHECK (quantity > 0),
  issue_date   DATE           NOT NULL DEFAULT CURRENT_DATE,
  hpp          NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_hpp    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email          ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_code      ON public.users(user_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_code       ON public.suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_items_code           ON public.items(item_code);
CREATE INDEX IF NOT EXISTS idx_items_category       ON public.items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_item       ON public.inventory(item_id);
CREATE INDEX IF NOT EXISTS idx_receipts_item        ON public.goods_receipts(item_id);
CREATE INDEX IF NOT EXISTS idx_receipts_supplier    ON public.goods_receipts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_receipts_date        ON public.goods_receipts(receipt_date);
CREATE INDEX IF NOT EXISTS idx_issues_item          ON public.goods_issues(item_id);
CREATE INDEX IF NOT EXISTS idx_issues_date          ON public.goods_issues(issue_date);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER trg_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_items_updated_at ON public.items;
CREATE TRIGGER trg_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON public.inventory;
CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_receipts_updated_at ON public.goods_receipts;
CREATE TRIGGER trg_receipts_updated_at BEFORE UPDATE ON public.goods_receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_issues_updated_at ON public.goods_issues;
CREATE TRIGGER trg_issues_updated_at BEFORE UPDATE ON public.goods_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- TRIGGER: auto-sync Auth Users → public.users
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_code TEXT;
  user_count     INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  generated_code := 'P' || LPAD((user_count + 1)::TEXT, 2, '0');

  INSERT INTO public.users (
    id,
    user_code,
    name,
    email,
    password_hash,
    role,
    status,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    generated_code,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'MANAGED_BY_SUPABASE_AUTH',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
    'active',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
