# Product Requirements Document (PRD)
## CV Akurat Sukses Sejati — Sistem Informasi Persediaan Barang Otomotif

---

## 1. Overview

**Nama Proyek**: CV Akurat Sukses Sejati  
**Deskripsi**: Website sistem informasi manajemen persediaan barang otomotif kendaraan (aki, sparepart, charger, dll). Mendukung pengelolaan stok masuk/keluar, data supplier, laporan, dan hak akses pengguna.  
**Target Pengguna**: Internal perusahaan — Super Admin & Admin.

---

## 2. Roles, Akun & Akses

### 2.1 Konsep Role & Permission (PBAC)
Sistem menggunakan **Permission-Based Access Control (PBAC)** dengan 2 level role teknis:
* **Super Admin**: Akses penuh (bypass semua pembatasan) ke seluruh fitur termasuk manajemen hak akses pengguna.
* **Admin**: Akses granular (CRUD) yang dikonfigurasi per fitur oleh Super Admin.

### 2.2 Daftar Akun Operasional Sistem (Default Demo & Production)

| ID | Nama Pengguna | Email | Password | Role | Lingkup Hak Akses |
|:---|:---|:---|:---|:---|:---|
| **P01** | **Super Admin (Owner)** | `superadmin@gmail.com` | `password123` | `super_admin` | **Full Access** ke seluruh modul sistem |
| **P02** | **Budi Santoso (Kepala Gudang)** | `gudang@cvakurat.com` | `password123` | `admin` | Master Barang/Supplier (CRUD), Transaksi Masuk/Keluar (CRUD), Laporan (Read) |
| **P03** | **Siti Rahma (Kasir)** | `kasir@cvakurat.com` | `password123` | `admin` | Master Barang (Read), Transaksi Penjualan (Create & Read), Persediaan (Read) |
| **P04** | **Rian Hidayat (Teknisi & Servis)** | `servis@cvakurat.com` | `password123` | `admin` | Master Barang (Read), Transaksi Keluar/Servis (Create & Read), Persediaan (Read) |
| **P05** | **Agnez Mo (Keuangan)** | `keuangan@cvakurat.com` | `password123` | `admin` | Transaksi (Read only), Laporan & Analitik HPP (Create, Read, Update, Export PDF/CSV) |

---

## 3. Fitur Utama

### 3.0 Halaman Login
- Input: Email, Password
- Opsi: "Remember for 30 days"
- Link: "Lupa Password"
- Tombol: "Login"

---

### 3.1 Sidebar (Navigasi Global)
- Logo perusahaan
- Beranda
- Hak Akses
- Data Master *(Dropdown)*: Data Supplier, Data Barang
- Transaksi *(Dropdown)*: Data Persediaan, Data Barang Masuk, Data Barang Keluar
- Laporan
- Pengaturan
- Profil Pengguna + Ikon Logout

---

### 3.2 Beranda (Dashboard)
- Sambutan: "Selamat datang, [Nama Pengguna]!"
- Grid 12 kolom, 2 baris:
  - **Baris 1**: Kategori Barang (span 4), Pengguna (span 4), Supplier (span 4)
  - **Baris 2**: Total Barang Masuk (span 4), Total Barang Keluar (span 4), Total Persediaan Barang (span 4)
- Setiap kartu menampilkan angka, persentase perubahan vs bulan lalu, dan grafik mini sparkline.

---

### 3.3 Hak Akses

#### 3.3.1 Daftar Pengguna
- Tabel: Foto, Nama, ID Pengguna (P01, P02...), Email, Password, Status, Aksi (Edit, Delete)
- Fitur: Search, Tambah Pengguna, pagination (maks 10/halaman)

#### 3.3.2 Tambah / Edit Pengguna
- Form: Nama, ID Pengguna, Email, Password
- Tabel Hak Akses (toggle checklist per kolom CRUD):

| Fitur       | Create | Read | Update | Delete |
|-------------|--------|------|--------|--------|
| Dashboard   | ☐      | ☐    | ☐      | ☐      |
| Hak Akses   | ☐      | ☐    | ☐      | ☐      |
| Data Master | ☐      | ☐    | ☐      | ☐      |
| Transaksi   | ☐      | ☐    | ☐      | ☐      |
| Laporan     | ☐      | ☐    | ☐      | ☐      |
| Pengaturan  | ☐      | ☐    | ☐      | ☐      |

---

### 3.4 Data Master

#### 3.4.1 Data Supplier
- Tabel: Foto, Nama, ID Supplier (S001...), Nama Kontak, Email, Alamat, No. Telepon, Aksi (Edit, Delete)
- Fitur: Search, Tambah Supplier Baru, Export, Pagination (maks 10/halaman)

#### 3.4.2 Data Barang
- Tabel: Nama Barang, ID Barang (000001...), Kategori Barang, Satuan, Harga, Aksi (Edit, Delete)
- Fitur: Search, Filter, Tambah Barang Baru, Export

---

### 3.5 Transaksi

#### 3.5.1 Data Persediaan
- Tabel: ID Persediaan, ID Barang, Nama Barang, Persediaan (stok), HPP
- Fitur: Search, Filter, Export

#### 3.5.2 Data Barang Masuk
- Tabel: ID Barang Masuk, ID Barang, ID Pengguna, ID Supplier, Jumlah Barang Masuk, Tanggal Masuk, Total Harga, Aksi (Edit, Delete)
- Fitur: Search, Filter, Tambah Barang Masuk, Export

#### 3.5.3 Data Barang Keluar
- Tabel: ID Barang Keluar, ID Pengguna, ID Barang, Jumlah Keluar, Tanggal Keluar, HPP, Total HPP, Aksi (Edit, Delete)
- Fitur: Search, Filter, Tambah Barang Keluar, Export

---

### 3.6 Laporan
- Ringkasan laporan persediaan, barang masuk, dan barang keluar
- Filter berdasarkan periode (hari, bulan, tahun)
- Export ke PDF/Excel

---

### 3.7 Pengaturan
- Pengaturan profil perusahaan
- Manajemen kategori barang dan satuan
- Konfigurasi sistem

---

## 4. UI/UX Guidelines

- **Warna Utama**: Purple (`#7C3AED`) untuk elemen aktif, hover, dan CTA
- **Hover**: `bg-purple text-white` (default teks hitam)
- **Teks**: Hitam untuk default, putih saat hover/aktif
- **Ikon**: Konsisten menggunakan library ikon (Lucide React)
- **Layout**: Clean, admin dashboard, sidebar tetap di kiri
- **Responsif**: Minimal untuk tampilan desktop (1280px+)
- **Pagination**: Maksimal 10 data per halaman

---

## 5. Out of Scope

- Aplikasi mobile native
- Integrasi payment gateway
- Multi-bahasa (hanya Bahasa Indonesia)
- Notifikasi email / push notification (fase berikutnya)