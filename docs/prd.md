# Product Requirements Document (PRD)
## CV Akurat Sukses Sejati — Sistem Informasi Manajemen Persediaan Suku Cadang Otomotif

---

## 1. Document Control & Metadata

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Proyek** | CV Akurat Sukses Sejati |
| **Tipe Dokumen** | Product Requirements Document (PRD) |
| **Versi Dokumen** | v2.0 (Standard Enterprise) |
| **Domain Bisnis** | Distribusi & Manajemen Persediaan Suku Cadang Kendaraan (Aki, Sparepart, Aksesoris) |
| **Target Platform** | Web Application (Responsive Desktop & Tablet Operasional) |
| **Status** | Approved & Implemented |

---

## 2. Executive Summary & Business Background

### 2.1 Latar Belakang Masalah (Problem Statement)
CV Akurat Sukses Sejati adalah entitas bisnis distributor dan bengkel suku cadang otomotif yang mengelola ribuan unit produk dengan perputaran stok harian yang tinggi. Sebelum sistem ini diterapkan, operasional perusahaan menghadapi sejumlah kendala krusial:
1. **Selisih Stok Fisik vs Catatan Manual:** Pencatatan keluar-masuk barang yang terpisah antara kasir dan gudang sering menimbulkan selisih stok (*stock discrepancy*).
2. **Fluktuasi Harga Beli Supplier:** Pembelian stok dari berbagai supplier (misal: PT Astra Otoparts, GS Battery) terjadi dengan harga yang bervariasi setiap periode, menyulitkan perhitungan keuntungan kotor dan valuasi aset persediaan secara riil.
3. **Ketiadaan Jejak Audit (Audit Trail):** Sulit melacak siapa operator yang memasukkan barang, mengeluarkan barang untuk servis, atau melakukan penyesuaian data.

### 2.2 Solusi Produk (Product Solution)
Membangun sistem informasi persediaan terpusat berbasis web yang mengotomatisasi:
* Pencatatan penerimaan barang (*Goods Receipt*) dan pengeluaran barang (*Goods Issue*) secara real-time.
* Valuasi aset persediaan menggunakan metode kalkulasi **HPP (Harga Pokok Penjualan) Moving Average**.
* Manajemen izin pengguna berbasis peran (*Role & Permission Management*) dengan audit log tercatat rapi.

---

## 3. Product Vision & Goals

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT OBJECTIVES                            │
├──────────────────┬─────────────────────────────┬───────────────────────┤
│ 1. Zero Stock    │ 2. Automated Asset          │ 3. Granular Access    │
│    Discrepancy   │    Valuation (HPP)          │    Governance         │
│ Selisih fisik vs │ Perhitungan nilai aset stok │ Hak akses spesifik    │
│ sistem mendekati │ terhitung otomatis setiap   │ per modul operasional │
│ 0% secara riil.  │ transaksi penerimaan.       │ (PBAC / RBAC).        │
└──────────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 4. User Personas & Role Matrix (PBAC / RBAC)

Sistem menerapkan **Permission-Based Access Control (PBAC)** dengan pembagian peran operasional sebagai berikut:

### 4.1 Deskripsi Peran Operasional
* **Super Admin (Owner / Direktur):** Memiliki akses penuh (*Full Access / Bypass*) ke seluruh modul, konfigurasi hak akses pengguna, dan audit laporan keuangan.
* **Kepala Gudang:** Bertanggung jawab atas pengelolaan data master barang, penerimaan barang dari supplier (*Goods Receipt*), monitoring stok minimum, dan retur gudang.
* **Kasir (Front Office & Kasir Depan):** Mengelola transaksi penjualan suku cadang ke pelanggan umum serta pengeluaran suku cadang untuk pengerjaan servis kendaraan (*Goods Issue*).
* **Keuangan & Akuntansi:** Monitoring mutasi persediaan, analisis HPP Moving Average, dan ekspor laporan keuangan ke format PDF/CSV.

### 4.2 Matriks Hak Akses (Role-Permission Matrix)

| Modul Sistem | Super Admin | Kepala Gudang | Kasir | Keuangan |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard & Analitik** | Full (CRUD) | View Only | View Only | Full (CRUD) |
| **Data Master: Supplier** | Full (CRUD) | Full (CRUD) | No Access | View Only |
| **Data Master: Barang & Kategori** | Full (CRUD) | Full (CRUD) | View Only | View Only |
| **Transaksi: Barang Masuk** | Full (CRUD) | Full (CRUD) | No Access | View Only |
| **Transaksi: Barang Keluar** | Full (CRUD) | Full (CRUD) | Create & View | View Only |
| **Kartu Stok & Persediaan** | Full (CRUD) | Full (CRUD) | View Only | Full (CRUD) |
| **Laporan & Ekspor Dokumen** | Full (CRUD) | View Only | No Access | Full (CRUD) |
| **Manajemen Hak Akses & User** | Full (CRUD) | No Access | No Access | No Access |

---

## 5. Functional Requirements (Spesifikasi Fitur)

### 5.1 Modul 1: Autentikasi & Manajemen Sesi
* **FR-01.1:** Pengguna wajib login menggunakan email dan password terdaftar.
* **FR-01.2:** Sistem mengidentifikasi hak akses pengguna saat login dan menyembunyikan navigasi menu yang tidak diizinkan.
* **FR-01.3:** Mendukung fitur penyimpanan sesi aman (*Remember Session*).

### 5.2 Modul 2: Master Data Management
* **FR-02.1 (Data Supplier):** CRUD data supplier meliputi Kode Supplier (contoh: `S001`), Nama Perusahaan, Kontak Person, Telepon, dan Alamat.
* **FR-02.2 (Kategori & Satuan):** Pengelompokan barang berdasarkan kategori otomotif (`AKI`, `SPAREPART`, `CHARGER`, `ANALITIK`, `AKSESORIS`) dan satuan (`UNIT`, `PCS`, `BOX`, `SET`).
* **FR-02.3 (Master Barang):** CRUD katalog barang meliputi Kode Barang (contoh: `000001`), Nama Produk, Kategori, Satuan, dan Harga Jual Standar.

### 5.3 Modul 3: Transaksi Barang Masuk (*Goods Receipt*)
* **FR-03.1:** Operator gudang mencatat penerimaan barang dari supplier dengan input: Kode Penerimaan (contoh: `AD0001`), Supplier, Tanggal Masuk, Item Barang, Jumlah (*Qty*), dan Harga Beli Satuan.
* **FR-03.2:** Sistem secara otomatis menghitung ulang nilai **HPP Moving Average** pada item terkait dan menambah kuantitas stok di tabel persediaan.
* **FR-03.3:** Menolak transaksi jika kuantitas barang masuk bernilai $\le 0$.

### 5.4 Modul 4: Transaksi Barang Keluar (*Goods Issue*)
* **FR-04.1:** Operator kasir mencatat pengeluaran barang (baik untuk penjualan langsung maupun penggantian suku cadang servis kendaraan) dengan input: Kode Transaksi, Tanggal, Item Barang, dan Jumlah (*Qty*).
* **FR-04.2:** Sistem melakukan validasi ketersediaan stok fisik:
  * Jika $\text{Stok Tersedia} < \text{Qty Keluar}$, sistem membatalkan transaksi dan memunculkan notifikasi error.
  * Jika stok mencukupi, sistem mengunci nilai HPP saat transaksi terjadi (*HPP Snapshot*), menghitung total beban HPP, dan mengurangi stok persediaan secara instan.

### 5.5 Modul 5: Monitoring Persediaan & Kartu Stok
* **FR-05.1:** Menampilkan ringkasan total item, total kuantitas stok, dan total nilai nominal aset persediaan.
* **FR-05.2:** Menampilkan riwayat mutasi stok per barang (*in, out, running balance*).
* **FR-05.3:** Memberikan penanda visual jika stok suatu barang berada di bawah ambang batas minimum (*Low Stock Indicator*).

### 5.6 Modul 6: Laporan & Ekspor Data
* **FR-06.1:** Menyediakan filter laporan berdasarkan rentang tanggal (*Date Range*), kategori barang, dan jenis transaksi.
* **FR-06.2:** Mendukung ekspor data laporan mutasi dan laporan laba kotor/HPP ke dalam format PDF dan CSV.

---

## 6. Non-Functional Requirements (NFR)

* **Performance:** Waktu respon pencarian data dan submit form transaksi rata-rata $\le 1$ detik.
* **Data Integrity & Consistency:** Seluruh transaksi mutasi stok menggunakan mekanisme transaksi database yang menjamin integritas data (ACID). Tidak boleh terjadi stok negatif (`stock >= 0`).
* **Security:** Proteksi endpoint menggunakan autentikasi token dan validasi *Role-Based Access Control* di level server.
* **Usability:** Antarmuka responsif, bersih, dan meminimalisir kesalahan input data operasional di kasir maupun gudang.