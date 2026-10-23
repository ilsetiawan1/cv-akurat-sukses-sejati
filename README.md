# CV Akurat Sukses Sejati — Enterprise Inventory System

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-149eca?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169e1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3068b7?style=for-the-badge&logo=zod)](https://zod.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Sistem Informasi Manajemen Persediaan Suku Cadang Otomotif & Valuasi Aset Terintegrasi**  
> Dibangun dengan arsitektur berlapis (**Layered Architecture: Repository-Service Pattern**), otomasi kalkulasi **HPP Moving Average**, proteksi integritas transaksi (*Compensating Rollback*), pemantauan keandalan sistem (*Health Probe Keepalive*), serta kontrol akses berbasis wewenang granular (*Granular PBAC/RBAC*).

---

## 📑 Daftar Isi

- [Latar Belakang & Masalah Bisnis](#-latar-belakang--masalah-bisnis)
- [Solusi & Dampak Bisnis](#-solusi--dampak-bisnis)
- [Fitur Utama](#-fitur-utama)
- [Keunggulan Rekayasa & Arsitektur](#-keunggulan-rekayasa--arsitektur)
  - [1. Layered Architecture (Repository-Service Pattern)](#1-layered-architecture-repository-service-pattern)
  - [2. Algoritma Valuasi HPP Moving Average Otomatis](#2-algoritma-valuasi-hpp-moving-average-otomatis)
  - [3. Integritas Transaksi & Rollback Mechanism](#3-integritas-transaksi--rollback-mechanism)
  - [4. Granular Permission-Based Access Control (PBAC/RBAC)](#4-granular-permission-based-access-control-pbacrbac)
  - [5. Observabilitas & Database Keepalive](#5-observabilitas--database-keepalive)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Diagram Alur & Pemodelan Data](#-diagram-alur--pemodelan-data)
- [Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
- [Kredensial Demo](#-kredensial-demo)
- [Dokumentasi Lengkap (Docs-as-Code)](#-dokumentasi-lengkap-docs-as-code)
- [Penulis & Kontak](#-penulis--kontak)

---

## 🎯 Latar Belakang & Masalah Bisnis

CV Akurat Sukses Sejati bergerak di bidang distribusi suku cadang dan bengkel otomotif yang mengelola ribuan *Stock Keeping Unit* (SKU) dengan perputaran harian yang tinggi. Sebelum sistem ini diimplementasikan, operasional menghadapi 3 kendala utama:

1. **Selisih Stok Fisik vs Catatan Manual (*Stock Discrepancy*)**: Pencatatan keluar-masuk barang yang terpisah antara kasir dan gudang sering menimbulkan ketidaksesuaian jumlah stok fisik di rak.
2. **Fluktuasi Harga Beli Supplier**: Pembelian barang dari beragam distributor (misal: Astra Otoparts, GS Battery) berlangsung dengan harga yang dinamis, menyulitkan kalkulasi margin laba kotor dan valuasi aset persediaan riil secara manual.
3. **Ketiadaan Jejak Audit (*Audit Trail*)**: Tidak adanya validasi terpusat mengenai siapa operator yang memutasi barang, mengeluarkan suku cadang untuk servis, atau melakukan koreksi data persediaan.

---

## 💡 Solusi & Dampak Bisnis

Sistem ini mentransformasi seluruh pencatatan persediaan menjadi terpusat (*single source of truth*) dengan capaian:
- **Zero Stock Discrepancy**: Validasi ketersediaan barang secara instan saat transaksi barang keluar untuk mengeliminasi potensi stok minus.
- **Automated Inventory Valuation**: Valuasi nilai persediaan dan harga pokok penjualan otomatis menggunakan metode **Moving Average**.
- **Segregation of Duties**: Pembagian wewenang yang tegas antar peran operasional (Super Admin, Gudang, Kasir, Keuangan).

---

## ✨ Fitur Utama

| Modul | Deskripsi Fitur & Nilai Bisnis |
| :--- | :--- |
| **📦 Data Master Terstruktur** | Manajemen katalog suku cadang multi-kategori (`AKI`, `SPAREPART`, `CHARGER`, `ANALITIK`, `AKSESORIS`) dan multi-satuan (`UNIT`, `PCS`, `BOX`, `SET`) beserta direktori supplier rekanan. |
| **📥 Barang Masuk (*Goods Receipt*)** | Pencatatan pengadaan barang masuk dari supplier dengan rekalkulasi otomatis nilai HPP Moving Average dan penambahan stok secara real-time. |
| **📤 Barang Keluar (*Goods Issue*)** | Pencatatan suku cadang untuk penjualan langsung maupun servis bengkel dengan *pre-flight validation* ketersediaan stok fisik. |
| **📊 Kartu Stok & Persediaan** | Monitoring saldo berjalan (*running balance*), riwayat mutasi masuk/keluar, total valuasi aset, dan indikator visual stok minimum (*low-stock alert*). |
| **📑 Laporan & Ekspor Dokumen** | Filter mutasi persediaan berbasis rentang tanggal (*date range*) dan kategori, dengan kemampuan ekspor ke **PDF** (via `jspdf` & `html2canvas`) serta format **CSV**. |
| **🛡️ Manajemen Akses & Pengguna** | Proteksi rute dan aksi berbasis izin (*Permission-Based Access Control*) untuk membatasi wewenang operasional setiap staf. |
| **🩺 Health Check & Monitoring** | Endpoint `/api/health` terintegrasi dengan pemantauan otomatis (*uptime monitoring*) dan database *keepalive*. |

---

## 🏗️ Keunggulan Rekayasa & Arsitektur

### 1. Layered Architecture (Repository-Service Pattern)
Proyek ini mengadopsi prinsip *Separation of Concerns* (SoC) dengan lapisan-lapisan terisolasi:

```
[ Presentation Layer ]  --> Next.js Server Components, Client UI & Forms
          ↓
[ Interface Layer ]     --> Next.js Server Actions (Input Parsing, Session Validation)
          ↓
[ Business Logic Layer] --> Services (HPP Moving Average, Business Rules, Stock Checks)
          ↓
[ Data Access Layer ]   --> Repositories (Supabase PostgREST Query Abstractions)
          ↓
[ Persistence Layer ]   --> PostgreSQL Database (RLS Policies, Triggers, Constraints)
```

Dengan struktur ini, logika bisnis tidak terikat langsung pada framework UI maupun query database mentah, sehingga mudah diuji (*unit testable*) dan dipelihara dalam jangka panjang.

---

### 2. Algoritma Valuasi HPP Moving Average Otomatis
Setiap kali transaksi penerimaan barang (*Goods Receipt*) disimpan, sistem secara otomatis merevaluasi nilai modal persediaan berjalan (*Moving Average Cost*) melalui formula:

$$\text{HPP}_{\text{baru}} = \frac{(\text{Stok}_{\text{lama}} \times \text{HPP}_{\text{lama}}) + (\text{Qty}_{\text{masuk}} \times \text{Harga Beli})}{(\text{Stok}_{\text{lama}} + \text{Qty}_{\text{masuk}})}$$

Implementasi pada [`lib/services/goods-receipt.service.ts`](file:///e:/project-nextjs/cv-akurat-sukses-sejati/lib/services/goods-receipt.service.ts):
```typescript
const oldStock = Number(inv.stock);
const oldHpp = Number(inv.hpp);
const incomingQty = Number(input.quantity);
const incomingPrice = Number(input.harga_satuan);

const newStock = oldStock + incomingQty;
const newHpp = ((oldStock * oldHpp) + (incomingQty * incomingPrice)) / newStock;

await updateInventoryStockAndHpp(inv.id, newStock, newHpp);
```

---

### 3. Integritas Transaksi & Rollback Mechanism
Menjaga konsistensi data finansial persediaan melalui *Compensating Transaction Pattern*. Jika pembaruan stok di tabel persediaan mengalami kendala teknis setelah transaksi dicatat, sistem secara otomatis mengeksekusi kompensasi rollback:

```typescript
// Cuplikan dari lib/services/goods-issue.service.ts
const { data: issue, error: issueError } = await insertGoodsIssue({ ...payload });

try {
  const newStock = Number(inv.stock) - input.quantity;
  const { error: invError } = await updateInventoryStockAndHpp(inv.id, newStock);
  if (invError) throw invError;
} catch (error) {
  // Manual Compensating Action (Rollback)
  await deleteGoodsIssue(issue.id);
  throw new Error(`Gagal memperbarui stok (Transaksi dibatalkan): ${error.message}`);
}
```

---

### 4. Granular Permission-Based Access Control (PBAC/RBAC)
Menerapkan proteksi berlapis melalui *Edge Proxy / Middleware* dan evaluasi izin pengguna:

| Role Operasional | Wewenang Modul | Hak Operasional |
| :--- | :--- | :--- |
| **Super Admin** | Semua Modul Sistem | Akses Penuh (*Full CRUD & User Governance*) |
| **Kepala Gudang** | Master Barang, Supplier, Barang Masuk, Persediaan | Pengadaan, Input HPP, Mutasi Masuk |
| **Kasir** | Barang Keluar, Katalog Barang, Kartu Stok | Catat Penjualan & Pengeluaran Komponen Servis |
| **Keuangan** | Laporan Persediaan, Mutasi, Ekspor PDF/CSV, HPP Audit | Analisis Finansial & Unduh Berkas |

---

### 5. Observabilitas & Database Keepalive
Untuk mencegah basis data Supabase *free tier* tertidur (*paused*) akibat ketiadaan traffic, sistem menyediakan endpoint khusus di [`app/api/health/route.ts`](file:///e:/project-nextjs/cv-akurat-sukses-sejati/app/api/health/route.ts):
- Menjalankan kueri verifikasi berbobot ringan (*low-overhead query*) secara dinamis (`force-dynamic`).
- Siap dihubungkan ke penyedia monitoring eksternal seperti **UptimeRobot** dengan interval pemantauan 5 menit.

---

## 🛠️ Tech Stack

- **Core & Runtime**: Next.js 16 (App Router), React 19, TypeScript 5
- **Database & Auth**: Supabase (PostgreSQL 15+, Supabase SSR Auth, Row Level Security)
- **Styling & UI**: Tailwind CSS v4, Lucide React Icons
- **Data Validation**: Zod v4 (Strict schema validation untuk form & DTO payload)
- **Document Export**: jsPDF, html2canvas (Ekspor dokumen PDF dan laporan tabular)

---

## 📂 Struktur Proyek

```text
cv-akurat-sukses-sejati/
├── app/
│   ├── (auth)/login/          # Halaman autentikasi aman
│   ├── (dashboard)/           # Area kerja aplikasi terproteksi
│   │   ├── beranda/           # Dashboard analitik & ringkasan metrik
│   │   ├── data-master/       # Manajemen barang & supplier
│   │   ├── transaksi/         # Barang Masuk, Barang Keluar, Persediaan
│   │   ├── laporan/           # Generator laporan mutasi & ekspor
│   │   └── hak-akses/         # Manajemen pengguna & izin peran
│   └── api/
│       └── health/            # Liveness probe & Supabase keepalive endpoint
├── components/                # Komponen UI modular & presentasional
├── lib/
│   ├── actions/               # Server Actions (Interface Layer)
│   ├── services/              # Logika Bisnis & Kalkulasi Valuasi (Service Layer)
│   ├── repositories/          # Akses Basis Data Supabase (Repository Layer)
│   ├── validations/           # Skema Validasi Zod
│   └── supabase/              # Inisialisasi Klien SSR Supabase
├── docs/                      # Dokumentasi rekayasa perangkat lunak (PRD, TSD, Diagram)
│   └── assets/                # Visual ERD & Activity Diagrams (.png, .jpeg)
├── supabase/                  # Konfigurasi database terpusat
│   ├── migrations/            # Skema DDL, Trigger functions, & Indexes
│   ├── scripts/               # Script automasi seeding (seed.mjs & setup-users.mjs)
│   └── seed.sql               # Backup dump data SQL awal
├── types/                     # Definisi kontrak tipe TypeScript global
└── proxy.ts                   # Next.js Request Proxy & Session Guard
```

---

## 📊 Diagram Alur & Pemodelan Data

Proyek dilengkapi dengan spesifikasi visual formal yang tersimpan di direktori [`docs/assets/`](docs/assets/):

1. **Activity Diagram — Transaksi Barang Masuk** (`docs/assets/Barang Masuk - Activity Diagram.png`)
2. **Activity Diagram — Transaksi Barang Keluar** (`docs/assets/Barang Keluar - Activity Diagram.png`)
3. **Entity Relationship Diagram (ERD)** (`docs/assets/ERD - Schema DB.jpeg`)

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Klon Repositori
```bash
git clone https://github.com/ilsetiawan1/cv-akurat-sukses-sejati.git
cd cv-akurat-sukses-sejati
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Lengkapi nilai konfigurasi Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Inisialisasi & Seeding Database
Jalankan script seeder otomatis untuk menginisialisasi kategori, satuan, master supplier, item otomotif, data persediaan awal, dan akun super admin:
```bash
npm run db:seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🔑 Kredensial Demo

Untuk keperluan review dan pengujian portofolio:

| Peran | Email | Kata Sandi | Wewenang Pengujian |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@gmail.com` | `password123` | Akses penuh ke seluruh modul, konfigurasi user, dan audit |

---

## 📚 Dokumentasi Lengkap (Docs-as-Code)

Proyek ini menerapkan pendekatan **Docs-as-Code** dengan dokumentasi rekayasa perangkat lunak formal yang komprehensif:

- 📄 **[Product Requirements Document (PRD)](docs/PRD.md)**: Analisis kebutuhan bisnis, personas, user story, dan matriks hak akses.
- 🛠️ **[Technical Specification Document (TSD)](docs/TSD.md)**: Arsitektur mendalam, spesifikasi API endpoints, kamus data basis data, dan diagram UML.

---

## 👨‍💻 Penulis & Kontak

**Muhammad Ilham Setiawan**  
*Full-Stack Engineer & Next.js Specialist*

- **GitHub**: [@ilsetiawan1](https://github.com/ilsetiawan1)
- **LinkedIn**: [linkedin.com/in/muhammad-ilham-setiawan](https://linkedin.com)
- **Proyek Repository**: [cv-akurat-sukses-sejati](https://github.com/ilsetiawan1/cv-akurat-sukses-sejati)

---

*Didistribusikan di bawah lisensi MIT.*