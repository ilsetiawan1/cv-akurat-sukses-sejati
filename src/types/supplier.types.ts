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

export type CreateSupplierInput = Omit<Supplier, 'id' | 'created_at' | 'updated_at' | 'supplier_code'> & {
  supplier_code?: string;
};

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export interface PaginatedSuppliers {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
}
