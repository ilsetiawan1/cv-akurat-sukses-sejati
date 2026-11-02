// src/features/goods-issue/components/IssueDetailModal.tsx
'use client';

import { useState } from 'react';
import { X, Trash2, Loader2, AlertTriangle, ArrowUpRight, Calendar, User, Package } from 'lucide-react';
import type { GoodsIssueWithRelations } from '../types/goods-issue.types';

export interface IssueDetailModalProps {
  issue: GoodsIssueWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  canDelete?: boolean;
}

export default function IssueDetailModal({
  issue,
  isOpen,
  onClose,
  onDelete,
  canDelete = false,
}: IssueDetailModalProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !issue) return null;

  const unitHpp = issue.quantity > 0 ? Math.round(issue.total_hpp / issue.quantity) : 0;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(issue.id);
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
              <span className="font-mono text-xs font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {issue.issue_code}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <ArrowUpRight size={11} />
                Barang Keluar
              </span>
            </div>
            <h2 className="text-base font-medium text-slate-900 mt-1">Detail Pengeluaran Barang</h2>
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
        <div className="p-6 space-y-5">
          {/* Item Highlight Card */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Package size={20} className="text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs text-slate-500 font-medium">
                  {issue.item?.item_code || '-'}
                </span>
                <h3 className="text-sm font-medium text-slate-900 truncate mt-0.5">
                  {issue.item?.name || '-'}
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  {issue.item?.category?.name || '-'} • Satuan: {issue.item?.unit?.name || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-500 font-normal flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                Tanggal Pengeluaran
              </span>
              <p className="font-medium text-slate-900">
                {new Date(issue.issue_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-500 font-normal flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                Pencatat / Operator
              </span>
              <p className="font-medium text-slate-900 truncate">
                {issue.user?.name || '-'}
              </p>
            </div>
          </div>

          {/* Pricing & Quantity Summary */}
          <div className="p-4 rounded-xl bg-linear-to-br from-white to-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-normal">Kuantitas Dikeluarkan</span>
              <span className="font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 tabular-nums">
                -{issue.quantity} {issue.item?.unit?.name || 'unit'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="text-slate-500 font-normal">Nilai HPP Satuan</span>
              <span className="font-medium text-slate-800 tabular-nums">
                Rp {unitHpp.toLocaleString('id-ID')} / {issue.item?.unit?.name || 'unit'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-slate-700">Total Beban HPP</span>
              <span className="text-base font-medium text-slate-900 tabular-nums">
                Rp {Number(issue.total_hpp).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Confirmation Box for Deleting Transaction */}
          {showConfirmDelete && (
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <p className="font-medium">Konfirmasi Pembatalan Transaksi</p>
                  <p className="text-rose-700 leading-relaxed font-normal">
                    Membatalkan transaksi ini akan menghapus riwayat pengeluaran dan <strong>mengembalikan {issue.quantity} unit stok</strong> ke persediaan gudang secara otomatis.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Membatalkan...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span>Ya, Batalkan Transaksi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 z-20">
          <div>
            {canDelete && !showConfirmDelete && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Batalkan Transaksi</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowConfirmDelete(false);
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

