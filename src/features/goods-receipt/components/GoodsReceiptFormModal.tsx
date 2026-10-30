// src/features/goods-receipt/components/GoodsReceiptFormModal.tsx
'use client';

import { X, Loader2, ArrowRight } from 'lucide-react';
import { useGoodsReceiptForm } from '../hooks/useGoodsReceiptForm';
import type { ReceiptModalItem } from '../types/goods-receipt.types';
import type { Supplier } from '@/types';

export { type ReceiptModalItem };

export interface GoodsReceiptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  initialItemId?: string;
}

export default function GoodsReceiptFormModal({ 
  isOpen, 
  onClose, 
  items, 
  suppliers,
  initialItemId 
}: GoodsReceiptFormModalProps) {
  const {
    formData,
    isSubmitting,
    selectedItem,
    quantityNum,
    unitPriceNum,
    totalPrice,
    currentStock,
    estimatedNewStock,
    isFormValid,
    handleChange,
    handleSubmit,
  } = useGoodsReceiptForm({ items, suppliers, initialItemId, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-20">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catat Barang Masuk</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tambah penerimaan barang dan hitung ulang HPP otomatis</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form noValidate onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Item Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Barang <span className="text-rose-500">*</span>
            </label>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all bg-white text-slate-900 cursor-pointer"
            >
              <option value="">Pilih data barang...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_code} - {item.name} (Stok: {item.current_stock})
                </option>
              ))}
            </select>

            {selectedItem && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span>Stok Saat Ini: <strong className="text-slate-900">{currentStock}</strong></span>
                {quantityNum > 0 && (
                  <>
                    <ArrowRight size={12} className="text-slate-400" />
                    <span>Estimasi Baru: <strong className="text-emerald-700">{estimatedNewStock}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Supplier & Receipt Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Supplier <span className="text-rose-500">*</span>
                </label>
                {selectedItem?.last_supplier_id && formData.supplier_id === selectedItem.last_supplier_id && (
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                    Otomatis supplier terakhir
                  </span>
                )}
              </div>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all bg-white text-slate-900 cursor-pointer"
              >
                <option value="">Pilih Supplier...</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Penerimaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="receipt_date"
                value={formData.receipt_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kuantitas Masuk <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                autoFocus={Boolean(initialItemId)}
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-900 tabular-nums"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Harga Beli Satuan (Rp) <span className="text-rose-500">*</span>
                </label>
                {Boolean(selectedItem?.last_purchase_price) && (
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    HPP/beli terakhir
                  </span>
                )}
              </div>
              <input
                type="number"
                name="harga_satuan"
                min="0"
                value={formData.harga_satuan}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-900 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Valuation Preview Card */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Nilai Transaksi</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {quantityNum > 0 && unitPriceNum > 0
                  ? `${quantityNum.toLocaleString('id-ID')} unit × Rp ${unitPriceNum.toLocaleString('id-ID')}`
                  : 'Otomatis dihitung dari Qty × Harga Satuan'}
              </p>
            </div>
            <p className="text-xl font-bold tabular-nums text-slate-900">
              Rp {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !isFormValid} 
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-xl hover:bg-blue-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan Transaksi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
