# CV Akurat Sukses Sejati

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-23272f?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015+-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

Sistem informasi manajemen persediaan suku cadang otomotif dan valuasi aset berbasis web. Aplikasi ini mengotomatiskan pencatatan barang masuk dan keluar, kalkulasi Harga Pokok Penjualan (HPP) dengan metode Moving Average, serta pelacakan saldo stok fisik secara real-time.

---

## Fitur Utama

- **Katalog Master Data:** Pengelolaan data suku cadang multi-kategori, multi-satuan, dan direktori vendor supplier.
- **Barang Masuk (Goods Receipt):** Pencatatan pengadaan dari supplier, rekalkulasi otomatis HPP Moving Average, dan Smart Restock Assistant.
- **Barang Keluar (Goods Issue):** Pengeluaran barang untuk penjualan atau servis bengkel, validasi ketersediaan stok fisik, dan analitik distribusi kategori.
- **Kartu Stok & Persediaan:** Pemantauan saldo persediaan real-time, status ketersediaan (Aman, Menipis, Habis), dan total valuasi aset gudang.
- **Laporan & Mutasi:** Riwayat mutasi persediaan berbasis rentang tanggal dan kategori dengan fitur ekspor ke PDF dan CSV.
- **Manajemen Hak Akses:** Kontrol wewenang operasional berbasis peran (Super Admin, Kepala Gudang, Kasir, Keuangan).
- **Monitoring Keandalan:** Endpoint `/api/health` untuk uptime probe dan pencegahan penonaktifan otomatis database Supabase.

---

## Arsitektur & Rekayasa

- **Feature-Driven Architecture & Layered Repository Pattern:** Seluruh kode dikelompokkan berdasarkan domain fitur (*Vertical Slice Architecture*). Setiap fitur mengisolasi Frontend (`components`, `hooks`) dan Backend (`actions`, `services`, `repositories`) secara mandiri.
- **Valuasi HPP Moving Average:** Nilai modal persediaan direvaluasi otomatis pada setiap transaksi barang masuk:
  $$\text{HPP}_{\text{baru}} = \frac{(\text{Stok}_{\text{lama}} \times \text{HPP}_{\text{lama}}) + (\text{Qty}_{\text{masuk}} \times \text{Harga Beli})}{\text{Stok}_{\text{lama}} + \text{Qty}_{\text{masuk}}}$$
- **Integritas Data Transaksi:** Menerapkan *Compensating Transaction Pattern* untuk memastikan rollback stok otomatis jika terjadi kendala saat mutasi data persediaan.
- **Kebijakan Zero RegEx:** Seluruh validasi dan manipulasi teks menggunakan metode string bawaan (`.includes()`, `.indexOf()`, `.split()`) dan Zod untuk mencegah potensi kerentanan ReDoS.
- **Desain UI/UX:** Mengadopsi prinsip *Border-Crafted UI* (Modern SaaS Minimalist) dengan hairline borders 1px, tipografi tabular-nums `font-medium` (500), dan tata letak responsif mobile (1-row horizontal snap carousel & card reflow).

---

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router, Turbopack, Server Actions)
- **Library UI:** React 19.2.4, Tailwind CSS v4, Lucide React
- **Bahasa:** TypeScript 5.0+ (Strict Mode)
- **Database & Auth:** Supabase (PostgreSQL 15+, Row Level Security)
- **Validasi:** Zod v4
- **Ekspor Dokumen:** jsPDF, html2canvas

---

## Struktur Direktori

```text
src/
├── app/                  # Next.js App Router (Rute & Halaman Dashboard)
├── features/             # Modul Fitur (Vertical Slice / FDA)
│   ├── <nama-fitur>/     # Contoh: goods-issue, goods-receipt, inventory
│   │   ├── components/   # [Frontend] Komponen UI & modal presentasional
│   │   ├── hooks/        # [Frontend] Custom hooks logika tabel & state
│   │   ├── actions/      # [Backend] Next.js Server Actions (Controller)
│   │   ├── services/     # [Backend] Service Layer (Logika bisnis & HPP)
│   │   ├── repositories/ # [Backend] Repository Layer (Kueri Supabase)
│   │   └── types/        # Kontrak tipe TypeScript domain fitur
│   ├── dashboard/
│   ├── items/
│   ├── suppliers/
│   └── reports/
├── components/           # Komponen atomik bersama lintas fitur & layout global
├── lib/                  # Konfigurasi Supabase client (Browser & Server)
└── types/                # Definisi tipe global
```

---

## Memulai Proyek

### 1. Klon Repositori & Instal Dependensi
```bash
git clone https://github.com/ilsetiawan1/cv-akurat-sukses-sejati.git
cd cv-akurat-sukses-sejati
npm install
```

### 2. Konfigurasi Environment Variables
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

### 3. Inisialisasi Database & Seeding
Jalankan skrip seeder untuk mengisi data master awal dan akun pengguna:
```bash
npm run db:seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Akses aplikasi melalui peramban di [http://localhost:3000](http://localhost:3000).

---

## Akun Demo Pengujian

| Peran | Email | Kata Sandi | Wewenang |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@gmail.com` | `password123` | Akses penuh ke seluruh transaksi, master data, audit, dan hak akses |

---

## Lisensi

Didistribusikan di bawah lisensi [MIT](LICENSE).
