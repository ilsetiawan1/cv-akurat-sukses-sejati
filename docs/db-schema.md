# Database Schema — CV Akurat Sukses Sejati
## Platform: Supabase (PostgreSQL)

> Paste SQL di bawah ini ke **SQL Editor** di Supabase Dashboard Anda, lalu jalankan.

---

## SQL — Buat Semua Tabel

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users
-- Menyimpan data pengguna sistem (Admin / Super Admin)
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_code     VARCHAR(10)  NOT NULL UNIQUE, -- contoh: P01, P02
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,        -- hashed password (bcrypt / Supabase Auth)
  role          VARCHAR(20)  NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  status        VARCHAR(10)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_permissions
-- Hak akses CRUD per fitur untuk setiap pengguna
-- ============================================================
CREATE TABLE user_permissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature     VARCHAR(50) NOT NULL CHECK (feature IN ('dashboard', 'hak_akses', 'data_master', 'transaksi', 'laporan', 'pengaturan')),
  can_create  BOOLEAN NOT NULL DEFAULT FALSE,
  can_read    BOOLEAN NOT NULL DEFAULT FALSE,
  can_update  BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, feature)
);

-- ============================================================
-- TABLE: suppliers
-- Data supplier barang otomotif
-- ============================================================
CREATE TABLE suppliers (
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

-- ============================================================
-- TABLE: categories
-- Kategori barang (Aki, Sparepart, Charger, Analitik, dll)
-- ============================================================
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: units
-- Satuan barang (Unit, Pcs, Box, dll)
-- ============================================================
CREATE TABLE units (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: items
-- Data barang / produk
-- ============================================================
CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_code     VARCHAR(10)    NOT NULL UNIQUE, -- contoh: 000001, 000002
  name          VARCHAR(200)   NOT NULL,
  category_id   UUID           REFERENCES categories(id) ON DELETE SET NULL,
  unit_id       UUID           REFERENCES units(id) ON DELETE SET NULL,
  price         NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: inventory
-- Data persediaan / stok barang saat ini
-- Dihitung otomatis dari barang masuk - barang keluar
-- ============================================================
CREATE TABLE inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_code  VARCHAR(10)    NOT NULL UNIQUE, -- contoh: DP0001
  item_id         UUID           NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  stock           INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  hpp             NUMERIC(15, 2) NOT NULL DEFAULT 0, -- Harga Pokok Penjualan
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: goods_receipts (Data Barang Masuk)
-- ============================================================
CREATE TABLE goods_receipts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_code    VARCHAR(10)    NOT NULL UNIQUE, -- contoh: AD1111
  item_id         UUID           NOT NULL REFERENCES items(id),
  user_id         UUID           NOT NULL REFERENCES users(id),
  supplier_id     UUID           NOT NULL REFERENCES suppliers(id),
  quantity        INT            NOT NULL CHECK (quantity > 0),
  receipt_date    DATE           NOT NULL DEFAULT CURRENT_DATE,
  total_price     NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: goods_issues (Data Barang Keluar)
-- ============================================================
CREATE TABLE goods_issues (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_code   VARCHAR(10)    NOT NULL UNIQUE, -- contoh: AD1111
  user_id      UUID           NOT NULL REFERENCES users(id),
  item_id      UUID           NOT NULL REFERENCES items(id),
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
CREATE INDEX idx_users_email          ON users(email);
CREATE INDEX idx_users_user_code      ON users(user_code);
CREATE INDEX idx_suppliers_code       ON suppliers(supplier_code);
CREATE INDEX idx_items_code           ON items(item_code);
CREATE INDEX idx_items_category       ON items(category_id);
CREATE INDEX idx_inventory_item       ON inventory(item_id);
CREATE INDEX idx_receipts_item        ON goods_receipts(item_id);
CREATE INDEX idx_receipts_supplier    ON goods_receipts(supplier_id);
CREATE INDEX idx_receipts_date        ON goods_receipts(receipt_date);
CREATE INDEX idx_issues_item          ON goods_issues(item_id);
CREATE INDEX idx_issues_date          ON goods_issues(issue_date);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_receipts_updated_at
  BEFORE UPDATE ON goods_receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_issues_updated_at
  BEFORE UPDATE ON goods_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA: Default categories & units
-- ============================================================
INSERT INTO categories (name) VALUES
  ('AKI'), ('SPAREPART'), ('CHARGER'), ('ANALITIK'), ('AKSESORIS');

INSERT INTO units (name) VALUES
  ('UNIT'), ('PCS'), ('BOX'), ('SET');
```

---

-- ============================================================
-- FIX 1: Trigger otomatis sync auth.users → public.users
-- Paste & Run di Supabase SQL Editor
-- ============================================================

-- Fungsi yang dipanggil setiap kali user baru dibuat di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_code TEXT;
  user_count     INT;
BEGIN
  -- Generate user_code otomatis: P01, P02, P03, ...
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
    NEW.id,                                                    -- ID sama dengan Supabase Auth
    generated_code,                                            -- P01, P02, dst
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), -- nama dari metadata atau prefix email
    NEW.email,
    'MANAGED_BY_SUPABASE_AUTH',                                -- password dikelola Auth, bukan kita
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),        -- default role: admin
    'active',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- amankan jika trigger dipanggil duplikat

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();


-- ============================================================
-- FIX 2: Sync user yang SUDAH ADA di Auth ke tabel public.users
-- (Jalankan sekali untuk migrasi akun yang sudah terlanjur dibuat)
-- ============================================================
DO $$
DECLARE
  auth_user RECORD;
  user_count INT := 0;
  generated_code TEXT;
BEGIN
  FOR auth_user IN
    SELECT au.*
    FROM auth.users au
    LEFT JOIN public.users pu ON pu.id = au.id
    WHERE pu.id IS NULL  -- hanya yang belum ada di public.users
  LOOP
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
      created_at,
      updated_at
    )
    VALUES (
      auth_user.id,
      generated_code,
      COALESCE(auth_user.raw_user_meta_data->>'name', split_part(auth_user.email, '@', 1)),
      auth_user.email,
      'MANAGED_BY_SUPABASE_AUTH',
      COALESCE(auth_user.raw_user_meta_data->>'role', 'admin'),
      'active',
      auth_user.created_at,
      auth_user.updated_at
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- ============================================================
-- Verifikasi: jalankan query ini untuk cek hasilnya
-- ============================================================
SELECT
  pu.id,
  pu.user_code,
  pu.name,
  pu.email,
  pu.role,
  pu.status
FROM public.users pu
ORDER BY pu.created_at ASC;

## Entity Relationship Diagram (Ringkasan)

```
users ──────────────────────────────────────────────────────┐
  │  id, user_code, name, email, role, status, avatar_url   │
  │                                                          │
  ├──< user_permissions                                      │
  │      user_id (FK), feature, can_create/read/update/delete│
  │                                                          │
  ├──< goods_receipts >── suppliers                         │
  │      receipt_code, item_id, user_id, supplier_id        │
  │      quantity, receipt_date, total_price                 │
  │                                                          │
  └──< goods_issues                                          │
         issue_code, user_id, item_id                        │
         quantity, issue_date, hpp, total_hpp                │

items ──────────────────────────────────────────────────────┐
  │  item_code, name, price                                  │
  ├── category_id ──> categories                             │
  ├── unit_id     ──> units                                  │
  └──< inventory                                             │
         inventory_code, item_id, stock, hpp                 │
```

---

## Kolom Referensi Cepat

| Tabel               | Primary Key | Kode Unik           | Relasi Penting                          |
|---------------------|-------------|---------------------|-----------------------------------------|
| `users`             | `id` (UUID) | `user_code` (P01)   | —                                       |
| `user_permissions`  | `id` (UUID) | —                   | `user_id → users.id`                    |
| `suppliers`         | `id` (UUID) | `supplier_code` (S001) | —                                    |
| `categories`        | `id` (UUID) | `name`              | —                                       |
| `units`             | `id` (UUID) | `name`              | —                                       |
| `items`             | `id` (UUID) | `item_code` (000001)| `category_id`, `unit_id`                |
| `inventory`         | `id` (UUID) | `inventory_code` (DP0001) | `item_id → items.id`             |
| `goods_receipts`    | `id` (UUID) | `receipt_code` (AD1111) | `item_id`, `user_id`, `supplier_id`|
| `goods_issues`      | `id` (UUID) | `issue_code` (AD1111)  | `user_id`, `item_id`               |