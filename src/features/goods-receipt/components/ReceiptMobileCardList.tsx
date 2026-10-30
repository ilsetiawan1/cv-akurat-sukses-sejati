// src/features/goods-receipt/components/ReceiptMobileCardList.tsx
'use client';

import { Archive, ArrowDownLeft, Truck, ChevronRight } from 'lucide-react';
import type { GoodsReceiptWithRelations } from '../types/goods-receipt.types';

export interface ReceiptMobileCardListProps {
  data: GoodsReceiptWithRelations[];
  onSelectReceipt: (receipt: GoodsReceiptWithRelations) => void;
}

export default function ReceiptMobileCardList({ 
  data, 
  onSelectReceipt 
}: ReceiptMobileCardListProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <Archive className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Belum ada barang masuk</p>
          <p className="text-slate-400 text-xs mt-0.5">Catatan penerimaan stok barang akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {data.map((row) => (
        <div
          key={row.id}
          onClick={() => onSelectReceipt(row)}
          className="p-4 hover:bg-slate-50/75 active:bg-slate-100/60 transition-colors cursor-pointer space-y-2.5"
        >
          {/* 1. Header Kartu: Nama Barang & Kategori */}
          <div>
            <p className="text-sm font-medium text-slate-800 leading-snug">
              {row.item?.name || '-'}
            </p>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {row.item?.category?.name || '-'} • {row.item?.unit?.name || '-'}
            </p>
          </div>

          {/* 2. Meta Transaksi: Kode Transaksi, Tanggal, dan Jumlah Stok Masuk */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                {row.receipt_code}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {new Date(row.receipt_date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 tabular-nums shrink-0">
              <ArrowDownLeft size={11} className="text-emerald-600" />
              +{row.quantity}
            </span>
          </div>

          {/* Footer Kartu: Supplier & Total Belanja */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal min-w-0 flex-1">
              <Truck size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{row.supplier?.name || '-'}</span>
            </div>

            <div className="flex items-center shrink-0">
              <span className="text-sm font-medium text-slate-800 tabular-nums">
                Rp {Number(row.total_price).toLocaleString('id-ID')}
              </span>
              <ChevronRight size={14} className="text-slate-300 ml-1.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

