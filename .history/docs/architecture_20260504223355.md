# Project Architecture Documentation
## CV Akurat Sukses Sejati

---

## 1. Folder Structure (Layered Architecture)

Proyek ini menggunakan pemisahan tanggung jawab sebagai berikut:

```
cv-akurat-sukses-sejati/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Layout dengan Sidebar
│   │   ├── beranda/
│   │   │   └── page.tsx
│   │   ├── hak-akses/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── data-master/
│   │   │   ├── supplier/
│   │   │   │   └── page.tsx
│   │   │   └── barang/
│   │   │       └── page.tsx
│   │   ├── transaksi/
│   │   │   ├── persediaan/
│   │   │   │   └── page.tsx
│   │   │   ├── barang-masuk/
│   │   │   │   └── page.tsx
│   │   │   └── barang-keluar/
│   │   │       └── page.tsx
│   │   ├── laporan/
│   │   │   └── page.tsx
│   │   └── pengaturan/
│   │       └── page.tsx
│   └── api/                      # API Routes (jika diperlukan)
│
├── components/                   # Presentation Layer
│   ├── ui/                       # Komponen UI generik (Button, Input, Modal, Table, dll)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── DashboardLayout.tsx
│   ├── beranda/
│   │   └── StatCard.tsx
│   ├── hak-akses/
│   │   ├── UserTable.tsx
│   │   └── PermissionForm.tsx
│   ├── data-master/
│   │   ├── SupplierTable.tsx
│   │   └── ItemTable.tsx
│   └── transaksi/
│       ├── InventoryTable.tsx
│       ├── GoodsReceiptTable.tsx
│       └── GoodsIssueTable.tsx
│
├── lib/
│   ├── repositories/             # Data Access Layer
│   │   ├── user.repository.ts
│   │   ├── supplier.repository.ts
│   │   ├── item.repository.ts
│   │   ├── inventory.repository.ts
│   │   ├── goods-receipt.repository.ts
│   │   └── goods-issue.repository.ts
│   │
│   ├── services/                 # Business Logic Layer
│   │   ├── user.service.ts
│   │   ├── supplier.service.ts
│   │   ├── item.service.ts
│   │   ├── inventory.service.ts
│   │   ├── goods-receipt.service.ts
│   │   └── goods-issue.service.ts
│   │
│   ├── actions/                  # Interface Layer (Next.js Server Actions)
│   │   ├── user.actions.ts
│   │   ├── supplier.actions.ts
│   │   ├── item.actions.ts
│   │   ├── inventory.actions.ts
│   │   ├── goods-receipt.actions.ts
│   │   └── goods-issue.actions.ts
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   └── useToast.ts
│   │
│   ├── supabase/                 # Supabase Client Configuration
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client (SSR / Server Actions)
│   │
│   └── validations/              # Zod Schemas
│       ├── user.schema.ts
│       ├── supplier.schema.ts
│       ├── item.schema.ts
│       └── transaction.schema.ts
│
├── types/                        # Global TypeScript Type Definitions
│   ├── user.types.ts
│   ├── supplier.types.ts
│   ├── item.types.ts
│   ├── inventory.types.ts
│   └── transaction.types.ts
│
├── docs/                         # Dokumentasi Proyek
│   ├── prd.md
│   ├── db-schema.md
│   ├── architecture.md
│   └── tech-stack.md
│
├── public/                       # Static Assets
├── .env.local                    # Environment Variables
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 2. Layer Descriptions

### `lib/repositories/` — Data Access Layer
Tempat berkumpulnya fungsi yang berinteraksi **langsung** dengan database (Supabase). Hanya berisi query murni tanpa logika bisnis.

```typescript
// Contoh: lib/repositories/supplier.repository.ts
import { createServerClient } from '@/lib/supabase/server';
import type { Supplier } from '@/types/supplier.types';

export async function getSuppliersPaginated(page: number, limit: number) {
  const supabase = await createServerClient();
  const from = (page - 1) * limit;
  return supabase
    .from('suppliers')
    .select('*', { count: 'exact' })
    .range(from, from + limit - 1)
    .order('created_at', { ascending: false });
}
```

---

### `lib/services/` — Business Logic Layer
Mengolah logika aplikasi, validasi domain, dan menggabungkan beberapa fungsi dari repository.

```typescript
// Contoh: lib/services/supplier.service.ts
import { getSuppliersPaginated } from '@/lib/repositories/supplier.repository';

export async function listSuppliers(page = 1, limit = 10) {
  const { data, count, error } = await getSuppliersPaginated(page, limit);
  if (error) throw new Error(error.message);
  return { suppliers: data, total: count ?? 0 };
}
```

---

### `lib/actions/` — Interface Layer (Server Actions)
Jembatan antara UI dan Backend. Menangani **sesi user**, **validasi input (Zod)**, dan **keamanan**. Semua fungsi dideklarasikan dengan `'use server'`.

```typescript
// Contoh: lib/actions/supplier.actions.ts
'use server';
import { supplierSchema } from '@/lib/validations/supplier.schema';
import { createSupplier } from '@/lib/services/supplier.service';
import { revalidatePath } from 'next/cache';

export async function addSupplierAction(formData: unknown) {
  const parsed = supplierSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten() };
  await createSupplier(parsed.data);
  revalidatePath('/data-master/supplier');
  return { success: true };
}
```

---

### `components/` — Presentation Layer
Komponen UI yang memanggil Server Actions untuk mutasi data atau menggunakan React Query / SWR untuk fetching data.

---

## 3. Data Flow (Alur Data)

```
User Interaction
      │
      ▼
┌─────────────────┐
│   Component     │  (Presentation Layer)
│  (Client Side)  │
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  Server Action  │  (lib/actions/) — validasi Zod, cek auth
│  (Server Side)  │
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│    Service      │  (lib/services/) — business logic
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│   Repository    │  (lib/repositories/) — Supabase query
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Supabase     │  (PostgreSQL Database)
│    Database     │
└─────────────────┘
         │ response
         ▼
Repository → Service → Action → Component → UI Update
```

---

## 4. Authentication Flow

- Menggunakan **Supabase Auth** dengan session berbasis cookie.
- Middleware Next.js (`middleware.ts`) memvalidasi sesi pada setiap request ke route `(dashboard)`.
- Token disimpan di cookie HTTP-only dengan opsi "Remember for 30 days".
- Setiap Server Action memverifikasi sesi sebelum memproses request.

---

## 5. Naming Conventions

| Kategori          | Konvensi                              | Contoh                          |
|-------------------|---------------------------------------|---------------------------------|
| File Component    | PascalCase                            | `SupplierTable.tsx`             |
| File Non-Component| kebab-case                            | `supplier.repository.ts`        |
| Fungsi Action     | camelCase + suffix `Action`           | `addSupplierAction`             |
| Fungsi Service    | camelCase                             | `listSuppliers`                 |
| Fungsi Repository | camelCase + konteks DB                | `getSuppliersPaginated`         |
| Tipe/Interface    | PascalCase + suffix `Type` atau nama  | `Supplier`, `UserPermission`    |
| Zod Schema        | camelCase + suffix `Schema`           | `supplierSchema`                |