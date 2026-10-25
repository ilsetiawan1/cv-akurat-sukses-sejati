// lib/validations/item.schema.ts
import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string().min(1, 'Nama barang wajib diisi').max(200, 'Maksimal 200 karakter'),
  category_id: z.string().uuid('Kategori tidak valid').optional().nullable().or(z.literal('')),
  unit_id: z.string().uuid('Satuan tidak valid').optional().nullable().or(z.literal('')),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
});
