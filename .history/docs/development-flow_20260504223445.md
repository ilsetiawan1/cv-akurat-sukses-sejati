# Development Flow Documentation
## CV Akurat Sukses Sejati

> **Panduan ini adalah peta jalan pengembangan end-to-end.** Setiap fase menggunakan pola **Vertical Slicing** — selesaikan satu fitur dari layer database hingga UI sebelum berpindah ke fitur berikutnya. Urutan layer selalu: `types → validation → repository → service → action → component → page`.

---

## Prinsip Pengembangan

```
┌─────────────────────────────────────────────────────────┐
│  VERTICAL SLICING PATTERN (wajib untuk setiap fitur)    │
│                                                         │
│  1. types/          → Definisi TypeScript               │
│  2. validations/    → Zod Schema                        │
│  3. repositories/   → Query Supabase                    │
│  4. services/       → Business Logic                    │
│  5. actions/        → Server Action (validasi + auth)   │
│  6. components/     → UI Component                      │
│  7. app/.../page    → Halaman (route)                   │
│                                                         │
│  ❌ Jangan loncat layer. Jangan buat UI sebelum         │
│     backend-nya siap.                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 0 — Environment & Database Setup

**Tujuan**: Proyek bisa berjalan secara lokal dan database sudah live di Supabase.

### 0.1 Inisialisasi Proyek

```bash
# Buat proyek Next.js 15 dengan TypeScript
npx create-next-app@latest cv-akurat-sukses-sejati \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd cv-akurat-sukses-sejati
```

### 0.2 Instalasi Dependensi

```bash
# Supabase SDK
npm install @supabase/supabase-js @supabase/ssr

# Validasi
npm install zod

# Ikon
npm install lucide-react

# (Opsional) Utility class merging
npm install clsx tailwind-merge
```

### 0.3 Konfigurasi Tailwind CSS v4

Di `app/globals.css`, ganti konten default dengan:
```css
@import "tailwindcss";

@theme {
  --color-primary:       #7C3AED;
  --color-primary-dark:  #6D28D9;
  --color-primary-light: #EDE9FE;
  --color-sidebar-bg:    #FAFAFA;
  --color-border:        #E5E7EB;
  --color-text-muted:    #6B7280;
}
```

### 0.4 Buat File Supabase Client

**`lib/supabase/client.ts`** (Browser — untuk Client Components):
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`lib/supabase/server.ts`** (Server — untuk Server Components & Server Actions):
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options));
        },
      },
    }
  );
}
```

### 0.5 Environment Variables

Buat file `.env.local` di root proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 0.6 Eksekusi SQL Schema di Supabase

1. Buka **Supabase Dashboard** → pilih proyek Anda
2. Navigasi ke **SQL Editor** → klik **New Query**
3. Paste **seluruh isi SQL** dari `docs/db-schema.md` (mulai dari `CREATE EXTENSION` hingga `INSERT INTO units`)
4. Klik **Run** dan pastikan tidak ada error

### 0.7 Buat Struktur Folder

```bash
mkdir -p \
  lib/repositories \
  lib/services \
  lib/actions \
  lib/hooks \
  lib/validations \
  lib/supabase \
  types \
  components/ui \
  components/layout \
  components/beranda \
  components/hak-akses \
  components/data-master \
  components/transaksi \
  components/laporan \
  docs
```

### ✅ Verifikasi Phase 0

| Cek | Indikator Berhasil |
|-----|--------------------|
| `npm run dev` berjalan tanpa error | Terminal menampilkan `Ready on http://localhost:3000` |
| Koneksi Supabase valid | Tidak ada error saat import `createClient` |
| Tabel database terbentuk | Di Supabase → Table Editor, terlihat 8+ tabel |
| Seed data kategori & satuan ada | Tabel `categories` berisi AKI, SPAREPART, dll |
| Folder struktur sesuai `architecture.md` | `ls lib/` menampilkan semua subfolder |

---

## Phase 1 — Authentication & Core Shell

**Tujuan**: Sistem login berfungsi penuh. User yang belum login diredirect ke `/login`. User yang sudah login melihat dashboard dengan Sidebar.

### 1.1 Layer Types

**`types/user.types.ts`**:
```typescript
export interface User {
  id: string;
  user_code: string;       // P01, P02
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'inactive';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  feature: 'dashboard' | 'hak_akses' | 'data_master' | 'transaksi' | 'laporan' | 'pengaturan';
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
```

### 1.2 Layer Validation

**`lib/validations/user.schema.ts`**:
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### 1.3 Layer Repository

**`lib/repositories/user.repository.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server';
import type { User } from '@/types/user.types';

export async function getUserByEmail(email: string) {
  const supabase = await createClient();
  return supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
}

export async function getUserById(id: string) {
  const supabase = await createClient();
  return supabase
    .from('users')
    .select('*, user_permissions(*)')
    .eq('id', id)
    .single();
}
```

### 1.4 Layer Service

**`lib/services/user.service.ts`**:
```typescript
import { getUserById } from '@/lib/repositories/user.repository';
import type { User } from '@/types/user.types';

export async function getCurrentUser(userId: string): Promise<User | null> {
  const { data, error } = await getUserById(userId);
  if (error || !data) return null;
  return data as User;
}
```

### 1.5 Layer Action

**`lib/actions/auth.actions.ts`**:
```typescript
'use server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/user.schema';
import { redirect } from 'next/navigation';

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Email atau password tidak valid' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: 'Email atau password salah' };
  }

  redirect('/beranda');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
```

### 1.6 Middleware (Proteksi Route)

**`middleware.ts`** (di root proyek):
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* ... cookie handlers */ } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/beranda', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 1.7 Layer Component & Page

File yang perlu dibuat:
- `app/(auth)/login/page.tsx` — Halaman Login (form email, password, remember me, lupa password)
- `components/layout/Sidebar.tsx` — Sidebar navigasi sesuai PRD (semua menu dengan dropdown)
- `components/layout/Header.tsx` — Header dengan nama user
- `app/(dashboard)/layout.tsx` — Layout pembungkus semua halaman dashboard

### ✅ Verifikasi Phase 1

| Cek | Indikator Berhasil |
|-----|--------------------|
| Halaman `/login` tampil dengan benar | Form terrender, tidak ada console error |
| Login dengan kredensial valid | Redirect ke `/beranda`, cookie sesi tersimpan |
| Login dengan kredensial salah | Tampil pesan error, tidak redirect |
| Akses `/beranda` tanpa login | Otomatis redirect ke `/login` |
| Akses `/login` setelah login | Otomatis redirect ke `/beranda` |
| Logout berfungsi | Sesi dihapus, redirect ke `/login` |
| Sidebar tampil dengan semua menu | Beranda, Hak Akses, Data Master (dropdown), Transaksi (dropdown), Laporan, Pengaturan |

---

## Phase 2 — Beranda (Dashboard Stats)

**Tujuan**: Halaman beranda menampilkan 6 kartu statistik dengan data live dari database.

### Urutan Pengerjaan

```
types/          → (tidak ada tipe baru, reuse dari Phase 1)
repositories/   → lib/repositories/dashboard.repository.ts
services/       → lib/services/dashboard.service.ts
components/     → components/beranda/StatCard.tsx
                  components/beranda/SparklineChart.tsx
page/           → app/(dashboard)/beranda/page.tsx
```

### File yang Dibuat

**`lib/repositories/dashboard.repository.ts`** — query COUNT untuk setiap statistik:
- Count `categories` → Kategori Barang
- Count `users` → Pengguna
- Count `suppliers` → Supplier
- SUM `goods_receipts.quantity` bulan ini → Barang Masuk
- SUM `goods_issues.quantity` bulan ini → Barang Keluar
- SUM `inventory.stock` → Total Persediaan

**`lib/services/dashboard.service.ts`** — menggabungkan semua query menjadi satu objek `DashboardStats`.

**`components/beranda/StatCard.tsx`** — kartu dengan: judul, angka besar, badge perubahan (hijau/merah), grafik sparkline mini.

**`app/(dashboard)/beranda/page.tsx`** — Server Component, fetch data lalu render grid 12 kolom, 2 baris.

### ✅ Verifikasi Phase 2

| Cek | Indikator Berhasil |
|-----|--------------------|
| 6 kartu statistik tampil | Grid 2 baris × 3 kolom terrender |
| Data angka sesuai DB | Nilai pada kartu cocok dengan jumlah baris di Supabase |
| Perubahan vs bulan lalu tampil | Badge hijau (naik) atau merah (turun) muncul |
| Halaman adalah Server Component | Tidak ada `'use client'` di `page.tsx` |

---

## Phase 3 — Hak Akses Pengguna

**Tujuan**: CRUD pengguna + manajemen hak akses per fitur berjalan penuh.

### Urutan Pengerjaan

```
types/          → types/user.types.ts (sudah ada, tambahkan CreateUserInput, UpdateUserInput)
validations/    → lib/validations/user.schema.ts (tambahkan createUserSchema, updateUserSchema)
repositories/   → lib/repositories/user.repository.ts
                   getUsers(page, search), createUser, updateUser, deleteUser
                   getUserPermissions, upsertUserPermissions
services/       → lib/services/user.service.ts
                   listUsers, addUser, editUser, removeUser, savePermissions
actions/        → lib/actions/user.actions.ts
                   getUsersAction, createUserAction, updateUserAction,
                   deleteUserAction, updatePermissionsAction
components/     → components/hak-akses/UserTable.tsx
                   components/hak-akses/UserFormModal.tsx
                   components/hak-akses/PermissionToggleTable.tsx
                   components/ui/Pagination.tsx
page/           → app/(dashboard)/hak-akses/page.tsx
                   app/(dashboard)/hak-akses/[id]/page.tsx
```

### Detail Komponen Kunci

**`UserTable.tsx`** — Tabel dengan kolom: foto, nama, user_code, email, password (masked), status badge, aksi (edit icon, delete icon). Pagination 10 data/halaman.

**`UserFormModal.tsx`** — Modal dengan form: nama, user_code (auto-generate atau manual), email, password. Digunakan untuk Tambah dan Edit.

**`PermissionToggleTable.tsx`** — Tabel 6 baris × 4 kolom toggle (checkbox). Setiap toggle mengontrol `can_create`, `can_read`, `can_update`, `can_delete` per fitur.

### ✅ Verifikasi Phase 3

| Cek | Indikator Berhasil |
|-----|--------------------|
| Daftar pengguna tampil di tabel | Data dari tabel `users` tampil dengan pagination |
| Search berfungsi | Filter nama/email secara real-time atau on-submit |
| Tambah pengguna berhasil | Data baru muncul di tabel, `user_permissions` terbuat otomatis |
| Edit pengguna berhasil | Data berubah di DB dan tabel terupdate |
| Delete pengguna berhasil | Data terhapus, `user_permissions` ikut terhapus (CASCADE) |
| Toggle permission tersimpan | Perubahan checklist tersimpan ke tabel `user_permissions` |

---

## Phase 4 — Data Master: Supplier

**Tujuan**: CRUD data supplier berfungsi penuh dengan foto dan pagination.

### Urutan Pengerjaan

```
types/          → types/supplier.types.ts
                   Supplier, CreateSupplierInput, UpdateSupplierInput
validations/    → lib/validations/supplier.schema.ts
repositories/   → lib/repositories/supplier.repository.ts
                   getSuppliers(page, search), getSupplierById,
                   createSupplier, updateSupplier, deleteSupplier
services/       → lib/services/supplier.service.ts
actions/        → lib/actions/supplier.actions.ts
components/     → components/data-master/SupplierTable.tsx
                   components/data-master/SupplierFormModal.tsx
page/           → app/(dashboard)/data-master/supplier/page.tsx
```

### Detail Schema Validasi

```typescript
// lib/validations/supplier.schema.ts
export const supplierSchema = z.object({
  supplier_code: z.string().min(1).max(10),
  name: z.string().min(1, 'Nama supplier wajib diisi').max(150),
  contact_name: z.string().max(100).optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().max(20).optional(),
});
```

### ✅ Verifikasi Phase 4

| Cek | Indikator Berhasil |
|-----|--------------------|
| Tabel supplier tampil | Data dari tabel `suppliers` dengan pagination 10/halaman |
| Search berfungsi | Filter berdasarkan nama supplier |
| Tambah supplier | Data baru muncul, supplier_code unik |
| Edit supplier | Data terupdate di DB |
| Delete supplier | Data terhapus, tidak ada orphan di tabel lain |
| Export berfungsi | Mengunduh file CSV/Excel data supplier |
| Alamat panjang ditruncate | Kolom alamat menampilkan `...` jika terlalu panjang |

---

## Phase 5 — Data Master: Barang

**Tujuan**: CRUD data barang dengan kategori dan satuan dinamis dari database.

### Urutan Pengerjaan

```
types/          → types/item.types.ts
                   Item, Category, Unit, CreateItemInput, UpdateItemInput
validations/    → lib/validations/item.schema.ts
repositories/   → lib/repositories/item.repository.ts
                   getItems(page, search, categoryId), getItemById,
                   createItem, updateItem, deleteItem
                   lib/repositories/category.repository.ts → getCategories
                   lib/repositories/unit.repository.ts → getUnits
services/       → lib/services/item.service.ts
actions/        → lib/actions/item.actions.ts
components/     → components/data-master/ItemTable.tsx
                   components/data-master/ItemFormModal.tsx
                   components/data-master/ItemFilterBar.tsx
page/           → app/(dashboard)/data-master/barang/page.tsx
```

### Catatan Khusus

- `item_code` di-generate otomatis secara sekuensial: `000001`, `000002`, dst.
- Kolom `Kategori Barang` dan `Satuan` merupakan link yang clickable (sesuai tampilan di screenshot) — bisa menampilkan filter.
- `ItemFilterBar.tsx` menyediakan dropdown filter berdasarkan kategori.

### ✅ Verifikasi Phase 5

| Cek | Indikator Berhasil |
|-----|--------------------|
| Tabel barang tampil | Data dari tabel `items` dengan join kategori & satuan |
| Filter kategori berfungsi | Dropdown filter memfilter tabel |
| Search nama barang berfungsi | Pencarian case-insensitive |
| Tambah barang | item_code ter-generate otomatis, relasi kategori & satuan tersimpan |
| Edit barang | Harga dan data lain terupdate |
| Delete barang | Tidak bisa delete jika barang ada di `inventory` (tampilkan error) |

---

## Phase 6 — Transaksi: Data Persediaan

**Tujuan**: Tabel persediaan menampilkan stok saat ini dan HPP setiap barang.

### Urutan Pengerjaan

```
types/          → types/inventory.types.ts
                   Inventory, InventoryWithItem
repositories/   → lib/repositories/inventory.repository.ts
                   getInventory(page, search), getInventoryByItemId
services/       → lib/services/inventory.service.ts
actions/        → lib/actions/inventory.actions.ts (hanya read + export)
components/     → components/transaksi/InventoryTable.tsx
page/           → app/(dashboard)/transaksi/persediaan/page.tsx
```

### Catatan Khusus

- Data persediaan **tidak di-input manual** — stok otomatis bertambah dari Barang Masuk dan berkurang dari Barang Keluar.
- HPP dihitung ulang setiap ada transaksi masuk/keluar.
- Tidak ada tombol "Tambah" di halaman ini, hanya Search, Filter, dan Export.

### ✅ Verifikasi Phase 6

| Cek | Indikator Berhasil |
|-----|--------------------|
| Tabel persediaan tampil | Data dari `inventory` dengan join `items` |
| Stok akurat | Nilai stok = total masuk - total keluar untuk setiap barang |
| HPP tampil | Nilai HPP terformat dengan pemisah ribuan |
| Tidak ada tombol Tambah | Halaman hanya Read + Export |

---

## Phase 7 — Transaksi: Data Barang Masuk

**Tujuan**: Input barang masuk otomatis menambah stok di tabel `inventory`.

### Urutan Pengerjaan

```
types/          → types/transaction.types.ts
                   GoodsReceipt, CreateGoodsReceiptInput
validations/    → lib/validations/transaction.schema.ts (goodsReceiptSchema)
repositories/   → lib/repositories/goods-receipt.repository.ts
                   getGoodsReceipts(page, search, filters)
                   createGoodsReceipt, updateGoodsReceipt, deleteGoodsReceipt
                   lib/repositories/inventory.repository.ts
                   incrementStock, updateHPP
services/       → lib/services/goods-receipt.service.ts
                   (menggabungkan createGoodsReceipt + incrementStock dalam 1 transaksi)
actions/        → lib/actions/goods-receipt.actions.ts
components/     → components/transaksi/GoodsReceiptTable.tsx
                   components/transaksi/GoodsReceiptFormModal.tsx
page/           → app/(dashboard)/transaksi/barang-masuk/page.tsx
```

### Logika Bisnis Kritis (di Service Layer)

```typescript
// lib/services/goods-receipt.service.ts
export async function addGoodsReceipt(input: CreateGoodsReceiptInput) {
  // 1. Simpan ke tabel goods_receipts
  // 2. Update stok di inventory (increment quantity)
  // 3. Recalculate HPP
  // Ketiganya harus atomic — jika salah satu gagal, rollback semua
}
```

### ✅ Verifikasi Phase 7

| Cek | Indikator Berhasil |
|-----|--------------------|
| Tabel barang masuk tampil | Data dari `goods_receipts` dengan join items, users, suppliers |
| Tambah barang masuk | Record baru di `goods_receipts`, stok di `inventory` bertambah |
| Total harga ter-kalkulasi otomatis | `quantity × harga_satuan` tersimpan di `total_price` |
| receipt_code auto-generate | Format AD + angka sekuensial (AD1111, AD1112...) |
| Edit & delete berfungsi | Stok di inventory ikut ter-adjust |
| Filter by tanggal berfungsi | Dropdown atau date-picker memfilter data |

---

## Phase 8 — Transaksi: Data Barang Keluar

**Tujuan**: Input barang keluar otomatis mengurangi stok dan menghitung Total HPP.

### Urutan Pengerjaan

```
types/          → types/transaction.types.ts (tambahkan GoodsIssue, CreateGoodsIssueInput)
validations/    → lib/validations/transaction.schema.ts (tambahkan goodsIssueSchema)
repositories/   → lib/repositories/goods-issue.repository.ts
                   getGoodsIssues, createGoodsIssue, updateGoodsIssue, deleteGoodsIssue
services/       → lib/services/goods-issue.service.ts
                   (createGoodsIssue + decrementStock + validasi stok cukup)
actions/        → lib/actions/goods-issue.actions.ts
components/     → components/transaksi/GoodsIssueTable.tsx
                   components/transaksi/GoodsIssueFormModal.tsx
page/           → app/(dashboard)/transaksi/barang-keluar/page.tsx
```

### Logika Bisnis Kritis

```typescript
// lib/services/goods-issue.service.ts
export async function addGoodsIssue(input: CreateGoodsIssueInput) {
  // 1. Cek stok tersedia: inventory.stock >= input.quantity
  //    Jika tidak → throw Error('Stok tidak mencukupi')
  // 2. Ambil HPP dari inventory
  // 3. Hitung total_hpp = hpp × quantity
  // 4. Simpan ke goods_issues
  // 5. Decrement inventory.stock
}
```

### ✅ Verifikasi Phase 8

| Cek | Indikator Berhasil |
|-----|--------------------|
| Tabel barang keluar tampil | Data dari `goods_issues` dengan join items, users |
| HPP & Total HPP tampil | Nilai terformat dengan pemisah ribuan |
| Validasi stok | Tidak bisa keluar jika quantity > stok saat ini (tampil error) |
| Stok berkurang di inventory | Setelah simpan, cek tabel persediaan berkurang |
| issue_code auto-generate | Format AD + angka sekuensial |

---

## Phase 9 — Laporan

**Tujuan**: Halaman laporan menampilkan ringkasan transaksi dengan filter periode dan fitur export.

### Urutan Pengerjaan

```
types/          → types/report.types.ts (ReportFilter, ReportSummary)
repositories/   → lib/repositories/report.repository.ts
                   getReportSummary(startDate, endDate)
                   getGoodsReceiptReport, getGoodsIssueReport
services/       → lib/services/report.service.ts
actions/        → lib/actions/report.actions.ts
components/     → components/laporan/ReportFilterBar.tsx
                   components/laporan/ReportTable.tsx
                   components/laporan/ExportButton.tsx
page/           → app/(dashboard)/laporan/page.tsx
```

### Fitur Laporan

- **Filter Periode**: Harian, Mingguan, Bulanan, Custom (date-range picker)
- **Tabel Laporan Barang Masuk**: ID, Nama Barang, Supplier, Jumlah, Total Harga, Tanggal
- **Tabel Laporan Barang Keluar**: ID, Nama Barang, Jumlah, HPP, Total HPP, Tanggal
- **Ringkasan**: Total nilai masuk, total nilai keluar, selisih/margin
- **Export**: CSV atau PDF per laporan

### ✅ Verifikasi Phase 9

| Cek | Indikator Berhasil |
|-----|--------------------|
| Filter periode berfungsi | Data berubah sesuai rentang tanggal yang dipilih |
| Laporan masuk & keluar tampil | Dua tabel terpisah atau tab |
| Angka ringkasan akurat | Total cocok dengan penjumlahan manual dari DB |
| Export berfungsi | File CSV/PDF terunduh |

---

## Phase 10 — Pengaturan

**Tujuan**: Pengguna dapat mengubah profil, kelola kategori & satuan, dan konfigurasi dasar sistem.

### Urutan Pengerjaan

```
components/     → components/pengaturan/ProfileForm.tsx
                   components/pengaturan/CategoryManager.tsx
                   components/pengaturan/UnitManager.tsx
actions/        → lib/actions/settings.actions.ts
                   updateProfileAction, manageCategoryAction, manageUnitAction
page/           → app/(dashboard)/pengaturan/page.tsx
```

### Fitur Pengaturan

- **Profil**: Edit nama, email, avatar (upload ke Supabase Storage), ganti password
- **Kategori Barang**: Tambah / edit / hapus kategori (ANALITIK, SPAREPART, AKI, dll)
- **Satuan**: Tambah / edit / hapus satuan (UNIT, PCS, BOX, dll)
- **Informasi Perusahaan**: Nama perusahaan, alamat (untuk header laporan)

### ✅ Verifikasi Phase 10

| Cek | Indikator Berhasil |
|-----|--------------------|
| Edit profil berhasil | Nama terupdate, tampil di Sidebar dan Header |
| Ganti password berfungsi | Login ulang dengan password baru berhasil |
| Tambah kategori | Muncul di dropdown form Tambah Barang |
| Hapus kategori | Tidak bisa hapus jika masih digunakan oleh barang (tampil error) |

---

## Urutan Fase & Estimasi

```
Phase 0   Environment & DB Setup              ██░░░░░░░░  ~0.5 hari
Phase 1   Auth & Core Shell                   ████░░░░░░  ~1.5 hari
Phase 2   Beranda / Dashboard Stats           ██░░░░░░░░  ~0.5 hari
Phase 3   Hak Akses Pengguna                  ████░░░░░░  ~1.5 hari
Phase 4   Data Master: Supplier               ███░░░░░░░  ~1 hari
Phase 5   Data Master: Barang                 ███░░░░░░░  ~1 hari
Phase 6   Transaksi: Data Persediaan          ██░░░░░░░░  ~0.5 hari
Phase 7   Transaksi: Barang Masuk             ████░░░░░░  ~1.5 hari
Phase 8   Transaksi: Barang Keluar            ████░░░░░░  ~1.5 hari
Phase 9   Laporan                             ███░░░░░░░  ~1 hari
Phase 10  Pengaturan                          ██░░░░░░░░  ~0.5 hari
                                              ──────────
                                              Total: ~11 hari kerja
```

---

## Komponen UI Generik (Buat di Phase 1, Reuse Selamanya)

Buat komponen-komponen ini di `components/ui/` sejak Phase 1 agar tidak perlu dibuat ulang:

| Komponen | Digunakan di |
|----------|-------------|
| `Button.tsx` | Semua halaman |
| `Input.tsx` | Semua form |
| `Modal.tsx` | Semua form tambah/edit |
| `Table.tsx` | Semua halaman data |
| `Pagination.tsx` | Hak Akses, Supplier, Barang |
| `Badge.tsx` | Status pengguna, perubahan statistik |
| `SearchInput.tsx` | Semua halaman tabel |
| `ExportButton.tsx` | Supplier, Barang, Transaksi, Laporan |
| `ConfirmDialog.tsx` | Konfirmasi sebelum delete |
| `Skeleton.tsx` | Loading state tabel |

---

## Aturan Konsistensi Lintas Phase

> Panduan ini **wajib** diikuti di semua phase untuk menjaga konsistensi kode.

1. **Setiap Server Action** harus memverifikasi sesi user sebelum memproses request.
2. **Setiap Repository function** hanya boleh berisi Supabase query — tidak ada logika bisnis.
3. **Setiap Service function** tidak boleh mengakses Supabase secara langsung — selalu lewat Repository.
4. **Error handling**: gunakan try-catch di Action layer, kembalikan `{ success: false, error: string }`.
5. **Revalidasi cache**: panggil `revalidatePath()` di Action setelah setiap mutasi data.
6. **Warna hover**: selalu gunakan `hover:bg-[#7C3AED] hover:text-white` untuk elemen interaktif.
7. **Pagination**: standar 10 data per halaman untuk semua tabel.
8. **Format angka**: gunakan `Intl.NumberFormat('id-ID')` untuk harga dan HPP.
9. **Format tanggal**: gunakan `Intl.DateTimeFormat('id-ID')` untuk semua kolom tanggal.
10. **Kode ID**: selalu auto-generate secara sekuensial, jangan biarkan user input manual.