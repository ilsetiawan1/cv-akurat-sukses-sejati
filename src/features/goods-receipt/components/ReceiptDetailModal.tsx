// src/features/goods-receipt/components/ReceiptDetailModal.tsx
'use client';

import { useState } from 'react';
import { X, Trash2, Loader2, AlertTriangle, ArrowDownLeft, Calendar, User, Truck, Package } from 'lucide-react';
import type { GoodsReceiptWithRelations } from '../types/goods-receipt.types';

export interface ReceiptDetailModalProps {
  receipt: GoodsReceiptWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  canDelete?: boolean;
}

export default function ReceiptDetailModal({
  receipt,
  isOpen,
  onClose,
  onDelete,
  canDelete = false,
}: ReceiptDetailModalProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !receipt) return null;

  const unitPrice = receipt.quantity > 0 ? Math.round(receipt.total_price / receipt.quantity) : 0;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(receipt.id);
      setShowConfirmDelete(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={() => {
          if (!isDeleting) {
            setShowConfirmDelete(false);
            onClose();
          }
        }} 
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {receipt.receipt_code}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ArrowDownLeft size={11} />
                Barang Masuk
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">Detail Penerimaan Barang</h2>
          </div>
          <button 
            type="button"
            onClick={() => {
              setShowConfirmDelete(false);
              onClose();
            }} 
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm">
          {/* Item Info Box */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-base leading-tight">
                  {receipt.item?.name || '-'}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {receipt.item?.item_code || '-'}
                  </span>
                  <span>•</span>
                  <span>{receipt.item?.category?.name || '-'}</span>
                  <span>•</span>
                  <span>Satuan: {receipt.item?.unit?.name || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Truck size={13} />
                <span>Supplier / Pemasok</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm truncate">
                {receipt.supplier?.name || '-'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Calendar size={13} />
                <span>Tanggal Penerimaan</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">
                {new Date(receipt.receipt_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-400 block mb-1">Kuantitas Masuk</span>
              <p className="font-bold text-emerald-700 text-base tabular-nums">
                +{receipt.quantity} {receipt.item?.unit?.name || 'Unit'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-400 block mb-1">Harga Beli Satuan</span>
              <p className="font-semibold text-slate-800 text-sm tabular-nums">
                Rp {unitPrice.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Total Value Banner */}
          <div className="p-4 bg-linear-to-r from-blue-50/80 to-slate-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Nilai Pembelian</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {receipt.quantity} × Rp {unitPrice.toLocaleString('id-ID')}
              </p>
            </div>
            <p className="text-xl font-extrabold text-blue-900 tabular-nums">
              Rp {Number(receipt.total_price).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              <span>Dicatat oleh: <strong className="text-slate-700">{receipt.user?.name || '-'}</strong></span>
            </span>
            <span className="text-[11px] text-slate-400">
              Dibuat: {new Date(receipt.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>

          {/* Confirm Delete Warning Banner */}
          {showConfirmDelete && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800">
                  <p className="font-semibold">Batalkan Transaksi Ini?</p>
                  <p className="mt-0.5 text-rose-600">
                    Stok persediaan gudang akan otomatis dikurangi kembali sejumlah <strong>-{receipt.quantity} unit</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  <span>Ya, Hapus & Kurangi Stok</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
          {canDelete && !showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Batalkan Transaksi</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={() => {
              setShowConfirmDelete(false);
              onClose();
            }}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

