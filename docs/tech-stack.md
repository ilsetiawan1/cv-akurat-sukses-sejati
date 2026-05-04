# Tech Stack Documentation
## CV Akurat Sukses Sejati

---

## Ringkasan Stack

| Layer          | Teknologi              | Versi          | Keterangan                                      |
|----------------|------------------------|----------------|-------------------------------------------------|
| Framework      | Next.js                | 15.x (App Router) | Full-stack React framework dengan SSR/SSG    |
| Language       | TypeScript             | 5.x            | Strict mode aktif                               |
| UI Library     | React                  | 19.x           | Komponen berbasis hooks                         |
| Styling        | Tailwind CSS           | v4             | Utility-first CSS (sintaks baru v4)             |
| Database       | Supabase               | Latest         | PostgreSQL + Auth + Storage + Realtime          |
| Validasi       | Zod                    | 3.x            | Schema validation untuk form & server actions   |
| Ikon           | Lucide React           | Latest         | Icon library konsisten                          |

---

## 1. Next.js 15 (App Router)

**Gunakan sintaks App Router**, bukan Pages Router.

```typescript
// ✅ BENAR — App Router
// app/beranda/page.tsx
export default function BerandaPage() {
  return <div>Dashboard</div>;
}

// ✅ Server Component (default) — tidak perlu 'use client'
// ✅ Client Component — tambahkan 'use client' di baris pertama
'use client';
import { useState } from 'react';
```

**Server Actions** — gunakan `'use server'` directive:
```typescript
// lib/actions/supplier.actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function deleteSupplierAction(id: string) {
  // logika di sini
  revalidatePath('/data-master/supplier');
}
```

**File Conventions App Router:**
- `page.tsx` — halaman yang dapat diakses via URL
- `layout.tsx` — layout yang membungkus child pages
- `loading.tsx` — UI loading state otomatis
- `error.tsx` — error boundary
- `not-found.tsx` — halaman 404

---

## 2. TypeScript (Strict Mode)

Selalu definisikan tipe secara eksplisit. Hindari `any`.

```typescript
// types/supplier.types.ts
export interface Supplier {
  id: string;
  supplier_code: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateSupplierInput = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSupplierInput = Partial<CreateSupplierInput>;

// Untuk hasil Server Action
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
```

---

## 3. React 19

Gunakan **functional components** dan **hooks**. Tidak perlu import React secara eksplisit (React 17+).

```typescript
// ✅ Functional Component
interface StatCardProps {
  title: string;
  value: number;
  change: number;
}

export function StatCard({ title, value, change }: StatCardProps) {
  return (
    <div className="rounded-xl border p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

---

## 4. Tailwind CSS v4

**Penting**: Tailwind v4 menggunakan sintaks konfigurasi yang berbeda dari v3.

```css
/* app/globals.css — konfigurasi tema di CSS, bukan tailwind.config.js */
@import "tailwindcss";

@theme {
  --color-primary: #7C3AED;      /* Purple utama */
  --color-primary-hover: #6D28D9;
  --color-sidebar: #FAFAFA;
  --color-border: #E5E7EB;
}
```

```typescript
// Penggunaan di komponen
// ✅ Gunakan class utility Tailwind
<button className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] px-4 py-2 rounded-lg">
  Tambah Supplier
</button>

// ✅ Hover pattern sesuai desain
// Default: bg-white text-black border
// Hover: bg-purple-600 text-white
<div className="border rounded-lg p-4 cursor-pointer hover:bg-purple-600 hover:text-white transition-colors">
  Item
</div>
```

**Tidak ada `tailwind.config.js`** di v4 — semua konfigurasi di CSS file.

---

## 5. Supabase

### Client Setup

```typescript
// lib/supabase/client.ts — untuk Client Components
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts — untuk Server Components & Server Actions
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
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Query Pattern

```typescript
// ✅ Gunakan generic types dari Supabase
const { data, error } = await supabase
  .from('suppliers')
  .select('*')
  .order('created_at', { ascending: false });

// ✅ Dengan pagination
const { data, count, error } = await supabase
  .from('suppliers')
  .select('*', { count: 'exact' })
  .range(0, 9); // 10 data pertama

// ✅ Dengan filter
const { data } = await supabase
  .from('items')
  .select('*, categories(name), units(name)')
  .ilike('name', `%${search}%`);
```

### Auth Pattern

```typescript
// Cek sesi di Server Action
import { createClient } from '@/lib/supabase/server';

export async function protectedAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  // lanjutkan logika
}
```

---

## 6. Zod (Validasi)

```typescript
// lib/validations/supplier.schema.ts
import { z } from 'zod';

export const supplierSchema = z.object({
  supplier_code: z.string().min(1).max(10),
  name: z.string().min(1).max(150),
  contact_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().max(20).optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
```

---

## 7. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # hanya di server
```

---

## 8. Package Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "zod": "^3.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x"
  }
}
```