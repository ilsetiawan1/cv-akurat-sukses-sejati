import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'Nama supplier wajib diisi').max(150, 'Maksimal 150 karakter'),
  contact_name: z.string().max(100, 'Maksimal 100 karakter').optional().nullable(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')).nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().max(20, 'Maksimal 20 karakter').optional().nullable(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
