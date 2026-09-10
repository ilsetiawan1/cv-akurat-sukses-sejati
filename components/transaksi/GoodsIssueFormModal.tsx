// components/transaksi/GoodsIssueFormModal.tsx
'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { addGoodsIssueAction } from '@/lib/actions/goods-issue.actions';
import toast from 'react-hot-toast';

import type { ItemWithRelations } from '@/types/item.types';

export interface IssueModalItem extends ItemWithRelations {
  current_stock: number;
  current_hpp: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: IssueModalItem[];
}

export default function GoodsIssueFormModal({ isOpen, onClose, items }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: '',
    issue_date: new Date().toISOString().split('T')[0]
  });

  const selectedItem = items.find(i => i.id === formData.item_id);
  const qty = Number(formData.quantity) || 0;
  
  const isQuantityExceeds = selectedItem && qty > selectedItem.current_stock;
  const isFormValid = formData.item_id && qty > 0 && !isQuantityExceeds;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        item_id: formData.item_id,
        quantity: qty,
        issue_date: formData.issue_date
      };

      const result = await addGoodsIssueAction(payload);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Barang keluar berhasil disimpan & stok dipotong');
        setFormData({ item_id: '', quantity: '', issue_date: new Date().toISOString().split('T')[0] });
        onClose();
      }
    } catch {
      toast.error('Gagal memproses transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 md:p-6 border-b z-20">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Catat Barang Keluar</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pilih Barang <span className="text-red-500">*</span></label>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white"
            >
              <option value="">Pilih Barang dari Persediaan...</option>
              {items.filter(i => i.current_stock > 0).map(item => (
                <option key={item.id} value={item.id}>
                  {item.item_code} - {item.name} (Sisa Stok: {item.current_stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Keluar <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kuantitas Keluar <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                className={`w-full px-3.5 py-2.5 border rounded-xl outline-none transition-all ${
                  isQuantityExceeds 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]'
                }`}
              />
              {isQuantityExceeds && (
                <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500">
                  <AlertCircle size={14} />
                  <span>Kuantitas melebihi sisa stok gudang!</span>
                </div>
              )}
            </div>
          </div>

          {selectedItem && !isQuantityExceeds && qty > 0 && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-2">
              <p className="text-sm text-blue-700 font-medium mb-1">Total HPP Berjalan (Pengeluaran)</p>
              <p className="text-2xl font-bold text-blue-900">
                Rp {((qty * (Number(selectedItem.current_hpp) || 0))).toLocaleString('id-ID')}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse md:flex-row gap-3 justify-end sticky bottom-0 bg-white pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !isFormValid} 
              className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            >
              {isSubmitting ? 'Memproses...' : 'Keluarkan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
