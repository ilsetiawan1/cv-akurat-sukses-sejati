// src/features/goods-issue/components/GoodsIssueFormModal.tsx
'use client';

import { X, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useGoodsIssueForm } from '../hooks/useGoodsIssueForm';
import type { IssueModalItem } from '../types/goods-issue.types';

export { type IssueModalItem };

export interface GoodsIssueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: IssueModalItem[];
}

export default function GoodsIssueFormModal({ 
  isOpen, 
  onClose, 
  items 
}: GoodsIssueFormModalProps) {
  const {
    formData,
    isSubmitting,
    selectedItem,
    quantityNum,
    currentStock,
    currentHpp,
    totalHpp,
    isQuantityExceeds,
    remainingStock,
    isFormValid,
    handleChange,
    handleSubmit,
  } = useGoodsIssueForm({ items, onClose });

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
            <h2 className="text-lg font-bold text-slate-900">Catat Barang Keluar</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kurangi stok persediaan dan catat HPP transaksi otomatis</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form noValidate onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Item Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Barang Persediaan <span className="text-rose-500">*</span>
            </label>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all bg-white text-slate-900"
            >
              <option value="">Pilih data barang dari persediaan...</option>
              {items.filter((i) => i.current_stock > 0).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_code} - {item.name} (Stok: {item.current_stock})
                </option>
              ))}
            </select>

            {selectedItem && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span>Stok Gudang: <strong className="text-slate-900">{currentStock}</strong></span>
                <span>• HPP: <strong className="text-slate-900">Rp {currentHpp.toLocaleString('id-ID')}</strong></span>
                {quantityNum > 0 && !isQuantityExceeds && (
                  <>
                    <ArrowRight size={12} className="text-slate-400" />
                    <span>Sisa Nanti: <strong className="text-emerald-700">{remainingStock}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Date & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Keluar <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kuantitas Keluar <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                max={currentStock || undefined}
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all tabular-nums ${
                  isQuantityExceeds
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/50 text-rose-900'
                    : 'border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900'
                }`}
              />
              {isQuantityExceeds && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-rose-600">
                  <AlertCircle size={14} />
                  <span>Kuantitas melebihi sisa stok gudang ({currentStock})!</span>
                </div>
              )}
            </div>
          </div>

          {/* Valuation Preview Card */}
          {selectedItem && !isQuantityExceeds && quantityNum > 0 && (
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total HPP Berjalan (Pengeluaran)</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {quantityNum.toLocaleString('id-ID')} unit × Rp {currentHpp.toLocaleString('id-ID')}
                </p>
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900">
                Rp {totalHpp.toLocaleString('id-ID')}
              </p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !isFormValid} 
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Keluarkan Barang'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
