// lib/services/supplier.service.ts

import {
  getSuppliersPaginated,
  getSupplierById,
  generateSupplierCode,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
} from '@/lib/repositories/supplier.repository';
import type { CreateSupplierInput, UpdateSupplierInput } from '@/types/supplier.types';

export async function listSuppliers(page = 1, limit = 10, search?: string) {
  const { data, count, error } = await getSuppliersPaginated(page, limit, search);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getSupplier(id: string) {
  const { data, error } = await getSupplierById(id);
  if (error) throw new Error(error.message);
  return data;
}

export async function addSupplier(input: CreateSupplierInput) {
  // FIX: generateSupplierCode sekarang ada di repository dan pakai loop
  const supplier_code = await generateSupplierCode();

  const { data, error } = await createSupplier({ ...input, supplier_code });
  if (error) throw new Error(`Gagal menambahkan supplier: ${error.message}`);
  return data;
}

export async function editSupplier(id: string, input: UpdateSupplierInput) {
  const { data, error } = await updateSupplier(id, input);
  if (error) throw new Error(error.message);
  return data;
}

export async function removeSupplier(id: string) {
  const { error } = await deleteSupplier(id);
  if (error) throw new Error(error.message);
}

export async function listAllSuppliers() {
  const { data, error } = await getAllSuppliers();
  if (error) throw new Error(error.message);
  return data ?? [];
}