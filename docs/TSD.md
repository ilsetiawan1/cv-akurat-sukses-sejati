# Technical Specification Document (TSD)
## CV Akurat Sukses Sejati — Arsitektur Sistem, Skema Database & Spesifikasi API

---

## 1. Document Control & Architectural Overview

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Proyek** | CV Akurat Sukses Sejati |
| **Tipe Dokumen** | Technical Specification Document (TSD) |
| **Versi Dokumen** | v2.0 (Standard Enterprise) |
| **Pola Arsitektur** | Layered Architecture (Repository-Service Pattern) |
| **Backend & Database**| Supabase (PostgreSQL 15+ dengan RLS & Trigger Function) |
| **Status** | Implemented & Production-Ready |

---

## 2. Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TECHNOLOGY STACK                              │
├──────────────────┬─────────────────────────────┬───────────────────────┤
│ Frontend & UI    │ Backend & Database          │ Validation & Security │
│ • Next.js (App)  │ • Supabase (PostgreSQL)     │ • Zod Schema Engine   │
│ • TypeScript     │ • Server Actions / API Route│ • PBAC / RBAC Control │
│ • Tailwind CSS   │ • SQL Triggers & Functions  │ • HTTP-Only Cookies   │
│ • Shadcn UI      │ • PostgreSQL Transactions   │ • Prepared Statements │
└──────────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 3. Alur Aktivitas Sistem (Activity Diagrams)
> **Tingkat 2 (UML Behavioral Diagram - Swimlane):** Menggambarkan alur operasional interaktif yang memisahkan tanggung jawab antara *Aktor Pengguna* dan *Sistem Backend*, dirancang menggunakan visual modeling standar Draw.io.

### 3.1 Activity Diagram: Transaksi Barang Masuk (*Goods Receipt Activity*)
*Aktor Utama: **Kepala Gudang** | Target: Pengadaan & Rekalkulasi Nilai HPP Moving Average*

<p align="center">
  <img src="./assets/Barang%20Masuk%20-%20Activity%20Diagram.png" alt="Activity Diagram: Transaksi Barang Masuk" width="560" />
</p>

| Langkah | Aktor / Jalur | Deskripsi Operasional & Validasi Teknis |
| :---: | :--- | :--- |
| **1** | Kepala Gudang | Membuka modal form transaksi barang masuk di antarmuka sistem. |
| **2** | Kepala Gudang | Memilih supplier, memilih item sparepart, mengisi kuantitas masuk, dan harga beli per unit. |
| **3** | Kepala Gudang | Menekan tombol **Simpan Transaksi**. |
| **4** | Sistem | Memvalidasi kelengkapan form input (`Supplier != null`, `Item != null`, `Qty > 0`, `Harga Beli > 0`). |
| **5a** | Sistem *(False)* | Menampilkan notifikasi kesalahan (*toast error*) jika input tidak lengkap $\rightarrow$ kembali ke form input. |
| **5b** | Sistem *(True)* | Menghitung ulang **HPP Moving Average** secara otomatis $\rightarrow$ menyimpan data transaksi ke database Supabase. |
| **6** | Sistem | Menampilkan notifikasi visual keberhasilan (*toast success*). |
| **7** | Sistem | Memperbarui jumlah stok fisik dan nilai HPP baru di **Tabel Persediaan** secara real-time. |

---

### 3.2 Activity Diagram: Transaksi Barang Keluar (*Goods Issue Activity*)
*Aktor Utama: **Kasir (Front Office)** | Target: Pelayanan Pengeluaran Komponen & Proteksi Stok Fisik*

<p align="center">
  <img src="./assets/Barang%20Keluar%20-%20Activity%20Diagram.png" alt="Activity Diagram: Transaksi Barang Keluar" width="560" />
</p>

| Langkah | Aktor / Jalur | Deskripsi Operasional & Validasi Teknis |
| :---: | :--- | :--- |
| **1** | Kasir | Membuka modal form transaksi barang keluar. |
| **2** | Kasir | Memilih item sparepart yang diganti/dibeli, mengisi kuantitas keluar, dan data transaksi. |
| **3** | Kasir | Menekan tombol **Simpan Transaksi**. |
| **4** | Sistem | Memvalidasi ketersediaan inventaris: **`Stok Fisik Tersedia >= Qty Keluar?`**. |
| **5a** | Sistem *(False)* | Menampilkan notifikasi kesalahan (*toast error: Stok Barang Tidak Mencukupi*) $\rightarrow$ kembali ke form input. |
| **5b** | Sistem *(True)* | Mengurangi kuantitas stok di tabel persediaan dan mencatat transaksi pengeluaran sparepart di DB. |
| **6** | Sistem | Menampilkan notifikasi visual keberhasilan (*toast success*). |
| **7** | Sistem | Memperbarui sisa stok barang di **Tabel Persediaan** secara instan $\rightarrow$ selesai. |

---

## 4. Arsitektur Layered & Struktur Direktori (Folder Tree)
> **Tingkat 3:** Menjelaskan pemisahan layer tanggung jawab kode (*Separation of Concerns*) berbasis struktur direktori nyata.

Aplikasi memisahkan tanggung jawab kode ke dalam 4 layer utama menggunakan pola **Repository-Service Pattern**:

```text
cv-akurat-sukses-sejati/
├── app/                                # [1. Presentation Layer - App Router]
│   ├── (auth)/                         # Rute autentikasi publik
│   │   └── login/                      # Halaman form login pengguna
│   ├── (dashboard)/                    # Rute terproteksi sistem (dengan Sidebar Layout)
│   │   ├── layout.tsx                  # Layout dashboard global + proteksi sesi
│   │   ├── beranda/                    # Ringkasan analitik & metrik stok
│   │   ├── hak-akses/                  # Manajemen user & matriks PBAC/RBAC
│   │   ├── data-master/                # Master data katalog
│   │   │   ├── barang/                 # Manajemen produk suku cadang
│   │   │   └── supplier/               # Manajemen rekanan supplier
│   │   ├── transaksi/                  # Modul operasional mutasi
│   │   │   ├── persediaan/             # Monitoring stok real-time & kartu stok
│   │   │   ├── barang-masuk/           # Form Goods Receipt & input HPP
│   │   │   └── barang-keluar/          # Form Goods Issue & validasi stok
│   │   ├── laporan/                    # Laporan mutasi & ekspor PDF/CSV
│   │   └── pengaturan/                 # Pengaturan profil & preferensi
│   ├── api/                            # RESTful API Endpoints & Route Handlers
│   ├── layout.tsx                      # Root HTML layout & font configuration
│   └── page.tsx                        # Root redirect handler
│
├── components/                         # [Komponen UI & Design System]
│   ├── ui/                             # Komponen primitif Shadcn UI (Button, Table, Dialog, Badge)
│   ├── forms/                          # Form interaktif & input fields
│   ├── tables/                         # Komponen tabel dinamis dengan pagination & filter
│   └── shared/                         # Komponen global (Navbar, Sidebar, Modal Confirmation)
│
├── lib/                                # [Core Logic & Abstraction Layers]
│   ├── services/                       # [2. Service Layer - Business Logic]
│   │   ├── auth.service.ts             # Logika sesi, login, dan verifikasi izin
│   │   ├── goods-receipt.service.ts    # Kalkulasi Moving Average HPP & mutasi masuk
│   │   ├── goods-issue.service.ts      # Validasi ketersediaan stok & mutasi keluar
│   │   ├── inventory.service.ts        # Kalkulasi kartu stok & evaluasi aset
│   │   ├── item.service.ts             # Validasi kode barang & master produk
│   │   ├── supplier.service.ts         # Logika relasi rekanan supplier
│   │   └── user.service.ts             # Manajemen hak akses granular pengguna
│   │
│   ├── repositories/                   # [3. Repository Layer - Data Access]
│   │   ├── auth.repository.ts          # Query data akun & token session
│   │   ├── goods-receipt.repository.ts # Transaksi SQL INSERT goods_receipts
│   │   ├── goods-issue.repository.ts   # Transaksi SQL INSERT goods_issues
│   │   ├── inventory.repository.ts     # Query SQL SELECT / UPDATE stok & HPP
│   │   ├── item.repository.ts          # Query SQL CRUD tabel items
│   │   ├── supplier.repository.ts      # Query SQL CRUD tabel suppliers
│   │   └── user.repository.ts          # Query SQL CRUD tabel users & permissions
│   │
│   ├── supabase/                       # Supabase client instances (Client, Server, Admin)
│   ├── validations/                    # Zod Schema definition untuk form & request API
│   ├── hooks/                          # Custom React Hooks (useAuth, usePermissions)
│   └── utils/                          # Helper format mata uang, tanggal, dan kalkulasi
│
├── supabase/                           # [4. Database Layer Configuration]
│   ├── migrations/                     # SQL migration scripts (DDL, Triggers, RLS)
│   └── seed.sql                        # Data awal demo (Kategori, Satuan, Akun, Dummy Items)
│
├── docs/                               # [Docs-as-Code Repository]
│   ├── PRD.md                          # Product Requirements Document (Bisnis & Fitur)
│   ├── TSD.md                          # Technical Specification Document (Arsitektur & API)
│   └── assets/                         # Aset visual diagram UML & Draw.io
│
├── types/                              # TypeScript interfaces & database schema types
├── middleware.ts                       # Edge middleware untuk route protection & RBAC
├── package.json                        # Manifest dependensi & scripts npm
└── tsconfig.json                       # Konfigurasi TypeScript compiler
```

---

## 5. Skema Basis Data & Pemodelan Data (ERD)
> **Tingkat 4:** Menjelaskan struktur relasional tabel, kolom, tipe data, Primary Key (PK), dan Foreign Key (FK).

### 5.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_PERMISSIONS : has
    USERS ||--o{ GOODS_RECEIPTS : records
    USERS ||--o{ GOODS_ISSUES : issues
    
    SUPPLIERS ||--o{ GOODS_RECEIPTS : supplies
    
    CATEGORIES ||--o{ ITEMS : classifies
    UNITS ||--o{ ITEMS : defines_measure
    
    ITEMS ||--|| INVENTORY : tracks_stock
    ITEMS ||--o{ GOODS_RECEIPTS : included_in
    ITEMS ||--o{ GOODS_ISSUES : deducted_from

    USERS {
        uuid id PK
        varchar user_code UK
        varchar name
        varchar email UK
        varchar role
        varchar status
        timestamptz created_at
    }

    USER_PERMISSIONS {
        uuid id PK
        uuid user_id FK
        varchar feature
        boolean can_create
        boolean can_read
        boolean can_update
        boolean can_delete
    }

    SUPPLIERS {
        uuid id PK
        varchar supplier_code UK
        varchar name
        varchar contact_name
        varchar phone
        text address
    }

    CATEGORIES {
        uuid id PK
        varchar name UK
    }

    UNITS {
        uuid id PK
        varchar name UK
    }

    ITEMS {
        uuid id PK
        varchar item_code UK
        varchar name
        uuid category_id FK
        uuid unit_id FK
        numeric price
    }

    INVENTORY {
        uuid id PK
        varchar inventory_code UK
        uuid item_id FK
        int stock
        numeric hpp
        timestamptz updated_at
    }

    GOODS_RECEIPTS {
        uuid id PK
        varchar receipt_code UK
        uuid item_id FK
        uuid user_id FK
        uuid supplier_id FK
        int quantity
        date receipt_date
        numeric total_price
    }

    GOODS_ISSUES {
        uuid id PK
        varchar issue_code UK
        uuid item_id FK
        uuid user_id FK
        int quantity
        date issue_date
        numeric hpp
        numeric total_hpp
    }
```

### 5.2 Rincian Definisi Tabel Supabase PostgreSQL

1. **`users`**: Master akun operator sistem.
   * `id` (UUID, PK), `user_code` (VARCHAR, Unique, e.g. `P01`), `name`, `email`, `role` (`super_admin` / `admin`), `status` (`active` / `inactive`).
2. **`user_permissions`**: Konfigurasi hak akses granular (PBAC).
   * `id` (UUID, PK), `user_id` (FK to `users`), `feature` (`dashboard`, `hak_akses`, `data_master`, `transaksi`, `laporan`, `pengaturan`), `can_create`, `can_read`, `can_update`, `can_delete`.
3. **`suppliers`**: Data rekanan supplier suku cadang.
   * `id` (UUID, PK), `supplier_code` (VARCHAR, Unique, e.g. `S001`), `name`, `contact_name`, `email`, `phone`, `address`.
4. **`categories` & `units`**: Master taksonomi barang otomotif.
   * `categories`: `AKI`, `SPAREPART`, `CHARGER`, `ANALITIK`, `AKSESORIS`.
   * `units`: `UNIT`, `PCS`, `BOX`, `SET`.
5. **`items`**: Master katalog produk.
   * `id` (UUID, PK), `item_code` (VARCHAR, Unique, e.g. `000001`), `name`, `category_id` (FK), `unit_id` (FK), `price` (NUMERIC).
6. **`inventory`**: Data stok fisik aktif & HPP bergerak.
   * `id` (UUID, PK), `inventory_code` (VARCHAR, Unique, e.g. `DP0001`), `item_id` (FK, Unique 1-to-1), `stock` (INT, CHECK $\ge 0$), `hpp` (NUMERIC).
7. **`goods_receipts`**: Transaksi barang masuk dari supplier.
   * `id` (UUID, PK), `receipt_code` (VARCHAR, Unique, e.g. `AD0001`), `item_id` (FK), `user_id` (FK), `supplier_id` (FK), `quantity` (INT, CHECK $> 0$), `receipt_date`, `total_price`.
8. **`goods_issues`**: Transaksi barang keluar (penjualan / servis).
   * `id` (UUID, PK), `issue_code` (VARCHAR, Unique, e.g. `AD0001`), `item_id` (FK), `user_id` (FK), `quantity` (INT, CHECK $> 0$), `issue_date`, `hpp` (snapshot HPP saat transaksi), `total_hpp`.

---

## 6. Algoritma Logika Bisnis & Perhitungan HPP Moving Average

Sistem menggunakan metode **Moving Average Cost** untuk memperbarui harga pokok perolehan persediaan secara otomatis setiap kali terjadi mutasi barang masuk:

$$\text{HPP}_{\text{baru}} = \frac{(\text{Stok}_{\text{lama}} \times \text{HPP}_{\text{lama}}) + (\text{Qty}_{\text{masuk}} \times \text{Harga Beli}_{\text{baru}})}{\text{Stok}_{\text{lama}} + \text{Qty}_{\text{masuk}}}$$

#### 📝 Studi Kasus Perhitungan Numerik:
1. **Kondisi Awal Gudang:**
   * Stok Lama = **10 unit** Aki GS Astra NS40Z
   * HPP Lama = **Rp 650.000 / unit**
   * Total Nilai Aset Awal = $10 \times 650.000 = \text{Rp 6.500.000}$
2. **Transaksi Penerimaan Barang Masuk (*Goods Receipt*):**
   * Qty Masuk = **5 unit**
   * Harga Beli Baru = **Rp 680.000 / unit** (terjadi kenaikan harga dari distributor)
   * Total Pembelian Baru = $5 \times 680.000 = \text{Rp 3.400.000}$
3. **Kalkulasi HPP Baru:**
   $$\text{HPP}_{\text{baru}} = \frac{6.500.000 + 3.400.000}{10 + 5} = \frac{9.900.000}{15} = \mathbf{Rp\ 660.000\ /\ \text{unit}}$$
4. **Pembaruan Database:**
   * `inventory.stock` bertambah dari 10 menjadi **15 unit**.
   * `inventory.hpp` diperbarui dari Rp 650.000 menjadi **Rp 660.000 / unit**.

---

## 7. Alur Interaksi Komponen & Spesifikasi API (Sequence & API Contract)
> **Tingkat 5:** Menjelaskan garis waktu (*timeline*) pertukaran pesan antar layer serta kontrak data endpoint API.

### 7.1 Sequence Diagram Transaksi Barang Masuk

```mermaid
sequenceDiagram
    autonumber
    actor Gudang as Operator Gudang
    participant UI as Web Frontend (Next.js)
    participant Service as GoodsReceiptService
    participant Repo as InventoryRepository
    participant DB as Supabase PostgreSQL

    Gudang->>UI: Input form barang masuk (Item, Supplier, Qty, Harga Beli)
    UI->>Service: Request POST /api/goods-receipt
    Note over Service: Validasi Zod Schema & Role Izin
    Service->>Repo: Get current stock & HPP
    Repo->>DB: SELECT stock, hpp FROM inventory WHERE item_id = ?
    DB-->>Repo: Return current_stock, current_hpp
    Note over Service: Kalkulasi Formula Moving Average HPP
    Service->>Repo: Execute Database Transaction
    Repo->>DB: BEGIN TRANSACTION<br/>1. INSERT INTO goods_receipts<br/>2. UPDATE inventory SET stock = stock + qty, hpp = new_hpp<br/>COMMIT
    DB-->>Repo: Transaction Success
    Repo-->>Service: Return record tersimpan
    Service-->>UI: Response HTTP 201 Created
    UI-->>Gudang: Tampilkan Alert "Barang Masuk Berhasil Dicatat"
```

---

### 7.2 Spesifikasi Kontrak Endpoint RESTful API

#### Standar Header Global
```http
Authorization: Bearer <session_jwt_token>
Content-Type: application/json
Accept: application/json
```

#### 1. `GET /api/items` — Mengambil Katalog Master Barang
* **Role Akses:** `super_admin`, `admin`
* **Response `200 OK` (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-111111111111",
      "item_code": "000001",
      "name": "Aki GS Astra Hybrid NS40Z (35Ah)",
      "category": { "name": "AKI" },
      "unit": { "name": "UNIT" },
      "price": 785000,
      "inventory": {
        "stock": 15,
        "hpp": 660000
      }
    }
  ]
}
```

#### 2. `POST /api/goods-receipt` — Mencatat Penerimaan Barang Masuk
* **Role Akses:** `super_admin`, `admin (Gudang)`
* **Request Body (JSON):**
```json
{
  "receipt_code": "AD0005",
  "item_id": "a1b2c3d4-e5f6-7890-abcd-111111111111",
  "supplier_id": "s1s2s3s4-e5f6-7890-abcd-222222222222",
  "quantity": 5,
  "purchase_price": 680000,
  "receipt_date": "2026-09-15"
}
```
* **Response `201 Created` (JSON):**
```json
{
  "success": true,
  "message": "Transaksi barang masuk berhasil dicatat dan HPP telah diperbarui",
  "data": {
    "receipt_id": "r1r2r3r4-e5f6-7890-abcd-333333333333",
    "item_code": "000001",
    "updated_stock": 15,
    "new_hpp": 660000
  }
}
```

#### 3. `POST /api/goods-issue` — Mencatat Pengeluaran Barang
* **Role Akses:** `super_admin`, `admin (Kasir / Gudang)`
* **Request Body (JSON):**
```json
{
  "issue_code": "OUT0012",
  "item_id": "a1b2c3d4-e5f6-7890-abcd-111111111111",
  "quantity": 2,
  "issue_date": "2026-09-15"
}
```
* **Response `201 Created` (JSON):**
```json
{
  "success": true,
  "message": "Barang keluar berhasil dicatat",
  "data": {
    "issue_id": "i1i2i3i4-e5f6-7890-abcd-444444444444",
    "item_code": "000001",
    "quantity_issued": 2,
    "snapshot_hpp": 660000,
    "total_hpp_expense": 1320000,
    "remaining_stock": 13
  }
}
```

---

### 7.3 Standarisasi Error Contract & Status Codes

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Permintaan gagal: Stok fisik barang (3 unit) tidak mencukupi untuk pengeluaran (5 unit)."
  }
}
```

| HTTP Status | Keterangan Standar | Contoh Kasus |
| :---: | :--- | :--- |
| **`200 OK`** | Request berhasil dieksekusi | Pengambilan data master barang dan laporan |
| **`201 Created`** | Sumber daya data baru berhasil dibuat | Sukses mencatat Goods Receipt atau Goods Issue |
| **`400 Bad Request`** | Validasi payload gagal / aturan bisnis dilanggar | Input kuantitas $\le 0$ atau stok tidak mencukupi |
| **`401 Unauthorized`** | Sesi pengguna tidak terautentikasi | Token tidak valid atau sesi login kedaluwarsa |
| **`403 Forbidden`** | Pengguna tidak memiliki hak akses modul | Kasir mencoba mengakses menu manajemen hak akses |
| **`404 Not Found`** | Data yang diminta tidak ditemukan | ID Barang atau ID Supplier tidak terdaftar di DB |
| **`500 Server Error`** | Terjadi kegagalan pada server/database | Database connection timeout atau trigger error |

---

## 8. Keamanan, Integritas Transaksi & Tata Kelola Dokumen (Docs-as-Code)

* **Input Sanitization & Schema Safety:** Setiap data request divalidasi ketat menggunakan pustaka **Zod** sebelum mencapai layer service.
* **Database Constraints & Triggers:** Integritas stok dijaga di level basis data menggunakan constraint `CHECK (stock >= 0)` dan fungsi trigger otomatis PostgreSQL.
* **Docs-as-Code Workflow:** Seluruh dokumen spesifikasi teknis disimpan dalam format Markdown di repositori Git, memungkinkan *versioning*, *peer review*, dan kemudahan pelacakan perubahan arsitektur secara kolaboratif.
