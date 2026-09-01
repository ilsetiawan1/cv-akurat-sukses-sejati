# CV Akurat Sukses Sejati - Inventory System

Sistem Manajemen Inventaris (Inventory Management System) yang dibangun menggunakan Next.js 15 dan Supabase. Proyek ini menerapkan **Layered Architecture** untuk memastikan kode yang bersih, terstruktur, dan mudah dipelihara.

## 🚀 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Database & Auth**: Supabase
*   **Styling**: Tailwind CSS v4
*   **Validation**: Zod
*   **Icons**: Lucide React

## 📂 Folder Structure

Proyek ini mengikuti prinsip *Separation of Concerns* dengan pembagian layer sebagai berikut:

*   **`lib/repositories/`**: Data Access Layer - Interaksi langsung dengan database (Supabase Query).
*   **`lib/services/`**: Business Logic Layer - Logika aplikasi dan pemrosesan data.
*   **`lib/actions/`**: Interface Layer - Next.js Server Actions untuk menjembatani Frontend dan Backend.
*   **`components/`**: Presentation Layer - Komponen UI (Atomic Design).
*   **`supabase/`**: Database Migrations & Seed SQL Scripts.
*   **`types/`**: Definisi tipe data TypeScript global.

## 🛠️ Instalasi & Persiapan

1. **Clone repositori**:
   ```bash
   git clone https://github.com/ilsetiawan1/cv-akurat-sukses-sejati.git
   cd cv-akurat-sukses-sejati
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin `.env.example` ke `.env.local` lalu isi dengan kunci Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Inisialisasi & Seeding Database**:
   ```bash
   npm run db:seed
   ```

5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.

---

## 🔑 Kredensial Default (Demo Akun)

*   **Email**: `superadmin@gmail.com`
*   **Password**: `password123`
*   **Role**: `Super Admin` (Akses penuh ke seluruh fitur)