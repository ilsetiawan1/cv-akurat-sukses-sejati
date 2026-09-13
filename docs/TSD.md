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
> **Tingkat 4 (Physical Data Model):** Menjelaskan struktur relasional 8 entitas tabel, kolom atribut, tipe data, Primary Key (PK), Foreign Key (FK), dan batasan integritas data (*Mandatory vs Optional*).

### 5.1 Entity Relationship Diagram (ERD - Crow's Foot Notation)
*Visual Modeling Database PostgreSQL Supabase dirancang menggunakan Draw.io.*

<p align="center">
  <img src="./assets/ERD%20-%20Schema%20DB.jpeg" alt="Entity Relationship Diagram (ERD) - CV Akurat Sukses Sejati" width="620" />
</p>

| Relasi Antar Tabel | Kardinalitas | Aturan Integritas (*Business Rules & Constraints*) |
| :--- | :---: | :--- |
| **`users` ─── `user_permissions`** | `1 : M` *(Mandatory)* | Satu pengguna wajib memiliki banyak konfigurasi izin granular per fitur (`NOT NULL`). |
| **`users` ─── `goods_receipts`** | `1 : M` *(Mandatory)* | Satu operator (Kepala Gudang) mencatat banyak transaksi penerimaan barang (*Audit Trail*). |
| **`users` ─── `goods_issues`** | `1 : M` *(Mandatory)* | Satu operator (Kasir) mencatat banyak transaksi pengeluaran barang (*Audit Trail*). |
| **`suppliers` ─── `goods_receipts`** | `1 : M` *(Mandatory)* | Satu supplier rekanan dapat memasok barang dalam banyak transaksi penerimaan. |
| **`categories` ─── `items`** | `1 : M` *(Mandatory)* | Satu kategori menaungi banyak jenis suku cadang / item barang otomotif. |
| **`units` ─── `items`** | `1 : M` *(Mandatory)* | Satu satuan takaran (Pcs, Botol, Set, Box) digunakan oleh banyak item barang. |
| **`items` ─── `inventory`** | `1 : 1` *(Mandatory)* | **One-to-One Eksklusif:** Satu master barang memiliki tepat satu catatan saldo stok dan kalkulasi HPP berjalan. |
| **`items` ─── `goods_receipts`** | `1 : M` *(Mandatory)* | Satu item barang dapat diterima berulang kali dari supplier dengan harga beli dinamis. |
| **`items` ─── `goods_issues`** | `1 : M` *(Mandatory)* | Satu item barang dapat dikeluarkan berulang kali dalam banyak transaksi pelayanan kasir. |

---

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

## 7. Spesifikasi Kontrak Endpoint RESTful API
> **Tingkat 5:** Menjelaskan format request/response, peran akses, standarisasi status code, dan sinkronisasi kontrak data dengan Postman Collection.

### 7.1 Mekanisme Autentikasi & Header Global

Seluruh endpoint RESTful API diproteksi oleh **API Security Guard** (`lib/supabase/api-guard.ts`) berbasis sesi cookie Supabase Auth (`Cookie-based Session`). Klien wajib melakukan autentikasi melalui `POST /api/auth/login` sebelum mengakses endpoint terlindungi.

```http
Content-Type: application/json
Accept: application/json
Cookie: sb-<project-ref>-auth-token=<session_token>
```

---

### 7.2 Contoh Spesifikasi Core Endpoints

#### 1. `GET /api/items` — Mengambil Katalog Master Barang (Paginated)
* **Role Akses:** `Super Admin`, `Kepala Gudang`, `Kasir (View Only)`, `Keuangan (View Only)`
* **Query Params (Opsional):** `page=1`, `limit=10`, `search=`, `category=`
* **Response `200 OK` (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
      "item_code": "000021",
      "name": "Aki GS Astra Hybrid NS40",
      "category_id": "eead97ed-ac7c-4a92-8262-7a44401a79dc",
      "unit_id": "dfcaba98-5cf5-401f-b7b5-ce820073bcea",
      "price": 860000,
      "created_at": "2026-05-21T14:46:10.131748+00:00",
      "updated_at": "2026-05-21T14:46:10.131748+00:00",
      "category": {
        "id": "eead97ed-ac7c-4a92-8262-7a44401a79dc",
        "name": "AKI"
      },
      "unit": {
        "id": "dfcaba98-5cf5-401f-b7b5-ce820073bcea",
        "name": "PCS"
      }
    }
  ],
  "total": 21,
  "page": 1,
  "limit": 10
}
```

#### 2. `POST /api/goods-receipt` — Mencatat Penerimaan Barang Masuk & Rekalkulasi HPP
* **Role Akses:** `Super Admin`, `Kepala Gudang`
* **Request Body (JSON):**
```json
{
  "item_id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
  "supplier_id": "6871fbbc-07e2-49b3-9541-55819f73dfee",
  "quantity": 5,
  "harga_satuan": 680000,
  "receipt_date": "2026-09-15"
}
```
* **Response `201 Created` (JSON):**
```json
{
  "success": true,
  "message": "Transaksi barang masuk berhasil dicatat dan HPP telah diperbarui",
  "data": {
    "id": "31d07722-b38d-4060-9fb2-63212534bdd8",
    "receipt_code": "AD0005",
    "item_id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
    "user_id": "a9d004e5-5169-45af-ae0a-b80391703fff",
    "supplier_id": "6871fbbc-07e2-49b3-9541-55819f73dfee",
    "quantity": 5,
    "receipt_date": "2026-09-15",
    "total_price": 3400000,
    "created_at": "2026-09-15T10:00:00.000Z",
    "updated_at": "2026-09-15T10:00:00.000Z"
  }
}
```

#### 3. `POST /api/goods-issue` — Mencatat Pengeluaran Barang & Pemotongan Stok
* **Role Akses:** `Super Admin`, `Kepala Gudang`, `Kasir`
* **Request Body (JSON):**
```json
{
  "item_id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
  "quantity": 2,
  "issue_date": "2026-09-15"
}
```
* **Response `201 Created` (JSON):**
```json
{
  "success": true,
  "message": "Transaksi barang keluar berhasil dicatat",
  "data": {
    "id": "4a5b6c7d-8e9f-0123-4567-89abcdef0123",
    "issue_code": "OUT0012",
    "item_id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
    "user_id": "a9d004e5-5169-45af-ae0a-b80391703fff",
    "quantity": 2,
    "issue_date": "2026-09-15",
    "total_hpp": 1320000,
    "created_at": "2026-09-15T10:30:00.000Z",
    "updated_at": "2026-09-15T10:30:00.000Z"
  }
}
```

#### 4. `GET /api/inventory` — Monitoring Saldo Persediaan & HPP Berjalan
* **Role Akses:** `Super Admin`, `Kepala Gudang`, `Kasir (View Only)`, `Keuangan`
* **Response `200 OK` (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv-uuid-001",
      "inventory_code": "DP0021",
      "item_id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
      "stock": 15,
      "hpp": 660000,
      "item": {
        "id": "1bbc5164-57bd-4d98-a13d-031d00979deb",
        "item_code": "000021",
        "name": "Aki GS Astra Hybrid NS40",
        "price": 860000,
        "category": { "name": "AKI" },
        "unit": { "name": "PCS" }
      }
    }
  ],
  "total": 21,
  "page": 1,
  "limit": 10
}
```

---

### 7.3 Matriks Katalog Seluruh Endpoint RESTful API

| Modul / Sub-Modul | Method | Path URL | Deskripsi Bisnis | Role Akses (Sesuai PRD 4.2) |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Inisialisasi sesi pengguna (email/password) | Publik (Semua Role) |
| **Auth** | `POST` | `/api/auth/logout` | Mengakhiri sesi aktif pengguna | Authenticated |
| **Master Items** | `GET` | `/api/items` | Menampilkan katalog barang berpaginasi | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Master Items** | `GET` | `/api/items/:id` | Detail data satu item spesifik | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Master Items** | `POST` | `/api/items` | Tambah katalog item barang baru | Super Admin, Kepala Gudang |
| **Master Items** | `PUT` | `/api/items/:id` | Perbarui data barang | Super Admin, Kepala Gudang |
| **Master Items** | `DELETE` | `/api/items/:id` | Hapus barang dari katalog | Super Admin, Kepala Gudang |
| **Master Supplier** | `GET` | `/api/suppliers` | Menampilkan daftar rekanan supplier | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Master Supplier** | `GET` | `/api/suppliers/:id` | Detail data satu supplier | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Master Supplier** | `POST` | `/api/suppliers` | Tambah data supplier baru | Super Admin, Kepala Gudang |
| **Master Supplier** | `PUT` | `/api/suppliers/:id` | Perbarui data supplier | Super Admin, Kepala Gudang |
| **Master Supplier** | `DELETE` | `/api/suppliers/:id` | Hapus data supplier | Super Admin, Kepala Gudang |
| **Goods Receipt** | `GET` | `/api/goods-receipt` | Riwayat transaksi barang masuk | Super Admin, Kepala Gudang, Keuangan |
| **Goods Receipt** | `POST` | `/api/goods-receipt` | Catat barang masuk & rekalkulasi HPP | Super Admin, Kepala Gudang |
| **Goods Issue** | `GET` | `/api/goods-issue` | Riwayat transaksi barang keluar | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Goods Issue** | `POST` | `/api/goods-issue` | Catat barang keluar & potong stok | Super Admin, Kepala Gudang, Kasir |
| **Inventory** | `GET` | `/api/inventory` | Monitoring stok fisik & HPP real-time | Super Admin, Kepala Gudang, Kasir, Keuangan |
| **Reports** | `GET` | `/api/reports` | Rekapitulasi laporan berkala (start/end date) | Super Admin, Keuangan, Kepala Gudang (View) |

> 📁 **Pengujian API Interaktif:** Seluruh katalog endpoint di atas telah terverifikasi dan divalidasi secara komprehensif melalui Postman Collection dengan variabel environment `{{base_url}}` dan proteksi sesi API Guard.

---

### 7.4 Standarisasi Error Contract & Status Codes

Setiap kegagalan request mengembalikan format amplop error yang konsisten:

```json
{
  "success": false,
  "error": "Akses ditolak: Sesi tidak valid atau belum login. Silakan lakukan POST /api/auth/login terlebih dahulu."
}
```

| HTTP Status | Keterangan Standar | Contoh Kasus |
| :---: | :--- | :--- |
| **`200 OK`** | Request berhasil dieksekusi | Pengambilan data master barang, inventory, dan laporan |
| **`201 Created`** | Sumber daya data baru berhasil dibuat | Sukses menambah item, supplier, Goods Receipt, atau Goods Issue |
| **`400 Bad Request`** | Validasi payload gagal / aturan bisnis dilanggar | Input kuantitas $\le 0$ atau stok tidak mencukupi |
| **`401 Unauthorized`** | Sesi pengguna tidak terautentikasi | Cookie sesi kosong atau sesi login kedaluwarsa |
| **`403 Forbidden`** | Pengguna tidak memiliki hak akses fitur | Kasir mencoba menambah/menghapus supplier |
| **`404 Not Found`** | Data yang diminta tidak ditemukan | ID Barang atau ID Supplier tidak terdaftar di DB |
| **`500 Server Error`** | Terjadi kegagalan internal server/database | Database connection timeout atau trigger error |

---

## 8. Keamanan, Integritas Transaksi & Tata Kelola Dokumen

* **Input Sanitization & Schema Safety:** Setiap data request divalidasi ketat pada layer service sebelum dieksekusi ke basis data.
* **Database Constraints & Triggers:** Integritas stok dijaga di level basis data menggunakan constraint `CHECK (stock >= 0)` dan fungsi trigger otomatis PostgreSQL.
* **Dokumentasi Terintegrasi di Repositori:** Seluruh dokumen kebutuhan (PRD) dan spesifikasi teknis (TSD) dikelola langsung di dalam repositori Git menggunakan Markdown, memungkinkan pelacakan riwayat pembaruan sistem (*versioning*) yang transparan dan kolaboratif.

