// lib/validations/transaction.schema.ts
import { z } from 'zod';

export const goodsReceiptSchema = z.object({
  item_id: z.string().uuid('Barang tidak valid'),
  supplier_id: z.string().uuid('Supplier tidak valid'),
  quantity: z.coerce.number().min(1, 'Kuantitas minimal 1'),
  harga_satuan: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif'),
  receipt_date: z.string().min(1, 'Tanggal penerimaan wajib diisi'),
});
