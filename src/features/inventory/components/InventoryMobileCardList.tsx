// src/features/inventory/components/InventoryMobileCardList.tsx
'use client';

import Link from 'next/link';
import { PackageOpen, ArrowDownToLine } from 'lucide-react';
import type { InventoryWithItem, StockStatusInfo } from '../types/inventory.types';

export interface InventoryMobileCardListProps {
  data: InventoryWithItem[];
  hasActiveFilters: boolean;
  getStockStatus: (stock: number) => StockStatusInfo;
}

export default function InventoryMobileCardList({
  data,
  hasActiveFilters,
  getStockStatus,
}: InventoryMobileCardListProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <PackageOpen className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Tidak ada barang yang cocok</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {hasActiveFilters 
              ? 'Coba sesuaikan kata kunci pencarian atau filter kategori/status.' 
              : 'Catatan persediaan akan muncul setelah ada transaksi barang masuk.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {data.map((inv) => {
        const stockStatus = getStockStatus(inv.stock);
        const needsRestock = inv.stock < 5;

        return (
          <div
            key={inv.id}
            className="p-4 hover:bg-slate-50/75 transition-colors space-y-2.5"
          >
            {/* 1. Header: Nama Barang & Kategori/Satuan */}
            <div>
              <p className="text-sm font-medium text-slate-800 leading-snug">
                {inv.item?.name || '-'}
              </p>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                {inv.item?.category?.name || '-'} • Satuan: {inv.item?.unit?.name || '-'}
              </p>
            </div>

            {/* 2. Meta: Kode Barang & Status Stok */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                {inv.item?.item_code || '-'}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-400 font-normal">Stok:</span>
                <span className={`text-sm font-medium tabular-nums ${stockStatus.textClass}`}>
                  {inv.stock}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${stockStatus.badgeClass}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>

            {/* 3. Footer: Nilai HPP & Aksi Cepat Restock */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-normal">HPP:</span>
                <span className="text-sm font-medium text-slate-800 tabular-nums">
                  Rp {Number(inv.hpp).toLocaleString('id-ID')}
                </span>
              </div>

              {needsRestock && (
                <Link
                  href={`/transaksi/barang-masuk?item_id=${inv.item_id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/80 transition-colors shrink-0"
                  title="Tambah stok barang ini via Barang Masuk"
                >
                  <ArrowDownToLine size={12} />
                  <span>+ Restock</span>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

