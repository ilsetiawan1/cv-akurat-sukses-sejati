# 🗄️ Supabase Database Documentation & Seeding

Dokumentasi struktur database, migrasi skema SQL, dan data seeding untuk **CV Akurat Sukses Sejati** (Sistem Manajemen Inventaris Suku Cadang Otomotif).

---

## 📂 Struktur Folder Database (Supabase Convention)

Mirip seperti folder `prisma/` pada ekosistem Prisma, proyek berbasis Supabase menggunakan folder `supabase/` sebagai standar resmi:

```
supabase/
├── migrations/
│   └── 20260501000000_initial_schema.sql  # Skema lengkap semua tabel, index, dan trigger PostgreSQL
├── seed.sql                               # Data awal (Kategori, Satuan, Supplier, Master Barang, Stok)
└── README.md                              # Panduan database & instruksi seeding
```

---

## 🚀 Cara Menjalankan Migrasi & Seeding

Terdapat **2 cara** untuk menerapkan skema dan mengisi data ke database Supabase Anda:

### Cara 1: Menggunakan Perintah Script (Paling Cepat) ⭐

Cukup jalankan satu baris perintah di terminal Anda:

```bash
npm run db:seed
```

Perintah ini akan otomatis terhubung ke Supabase (menggunakan kredensial dari `.env.local`) dan menginisialisasi:
- Kategori (`AKI`, `SPAREPART`, `CHARGER`, `ANALITIK`, `AKSESORIS`)
- Satuan (`UNIT`, `PCS`, `BOX`, `SET`)
- Supplier Otomotif (PT Astra Otoparts, PT GS Battery, PT Denso)
- Master Data Barang & Nilai Persediaan HPP Awal
- Akun Default Super Admin (`superadmin@gmail.com` / `password123`)

---

### Cara 2: Melalui Supabase Dashboard (SQL Editor)

1. Buka dashboard project Anda di **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Masuk ke menu **SQL Editor** di sidebar kiri.
3. Buat Query baru, lalu copy-paste seluruh isi file:
   - `supabase/migrations/20260501000000_initial_schema.sql`
4. Klik tombol **Run** untuk membuat seluruh tabel, trigger, dan index.
5. *(Opsional)* Copy-paste isi file `supabase/seed.sql` lalu klik **Run** untuk memasukkan data awal.

---

### Cara 3: Menggunakan Supabase CLI (Local Development)

Jika Anda menggunakan Supabase CLI di lokal:

```bash
# Inisialisasi & jalankan migrasi
npx supabase migration up

# Reset database & jalankan seed.sql otomatis
npx supabase db reset
```

---

## 📊 Ringkasan Skema Tabel & Relasi

```
users (Pengguna Sistem)
  ├──< user_permissions (Hak Akses CRUD Per Fitur)
  ├──< goods_receipts (Barang Masuk) >── suppliers (Data Pemasok)
  └──< goods_issues (Barang Keluar)

items (Master Barang & Suku Cadang)
  ├── category_id ──> categories (Kategori Barang)
  ├── unit_id     ──> units (Satuan Barang)
  ├──< inventory (Stok Real-time & HPP Moving Average)
  ├──< goods_receipts
  └──< goods_issues
```

---

## 🔑 Kredensial Pengguna Bawaan (Default Seed)

| Email | Password | Role | Akses |
| :--- | :--- | :--- | :--- |
| `superadmin@gmail.com` | `password123` | `super_admin` | Akses Penuh (Full Access) ke Seluruh Fitur |
