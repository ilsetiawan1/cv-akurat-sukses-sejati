// src/features/items/components/ItemMobileCardList.tsx
'use client';

import { Edit2, Trash2, PackageOpen, Tag, Box } from 'lucide-react';
import type { ItemWithRelations } from '../types/item.types';

export interface ItemMobileCardListProps {
  data: ItemWithRelations[];
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (item: ItemWithRelations) => void;
  onDelete: (item: ItemWithRelations) => void;
  onCategoryFilter?: (categoryId: string) => void;
}

export default function ItemMobileCardList({
  data,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
  onCategoryFilter,
}: ItemMobileCardListProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <PackageOpen className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Tidak ada data barang</p>
          <p className="text-slate-400 text-xs mt-0.5">Coba sesuaikan filter atau tambahkan barang baru.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {data.map((item) => (
        <div key={item.id} className="p-4 space-y-2.5">
          {/* Baris 1: Nama Barang & Tombol Aksi */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 leading-snug">
                {item.name}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {item.category && (
                  <button
                    type="button"
                    onClick={() => onCategoryFilter?.(item.category!.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200/60 transition-colors"
                  >
                    <Tag size={10} className="text-slate-400" />
                    <span>{item.category.name}</span>
                  </button>
                )}
                {item.unit && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200/60">
                    <Box size={10} className="text-slate-400" />
                    <span>{item.unit.name}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Aksi Cepat Mobile */}
            {(canUpdate || canDelete) && (
              <div className="flex items-center gap-1 shrink-0">
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit barang"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus barang"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Baris 2: Kode & Harga */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/80">
            <span className="font-mono text-2xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
              {item.item_code}
            </span>
            <div className="text-right">
              <span className="text-slate-400 text-2xs mr-1">Harga Jual</span>
              <span className="font-medium tabular-nums text-slate-900 text-sm">
                Rp {Number(item.price).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

