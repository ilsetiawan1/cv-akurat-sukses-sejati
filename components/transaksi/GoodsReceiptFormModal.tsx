// components/transaksi/GoodsReceiptFormModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { addGoodsReceiptAction } from '@/lib/actions/goods-receipt.actions';
import toast from 'react-hot-toast';

import type { ItemWithRelations } from '@/types/item.types';
import type { Supplier } from '@/types/supplier.types';

export interface ReceiptModalItem extends ItemWithRelations {
  current_stock: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ReceiptModalItem[];
  suppliers: Supplier[];
}

export default function GoodsReceiptFormModal({ isOpen, onClose, items, suppliers }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    supplier_id: '',
    quantity: '',
    harga_satuan: '',
    receipt_date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        item_id: formData.item_id,
        supplier_id: formData.supplier_id,
        quantity: Number(formData.quantity),
        harga_satuan: Number(formData.harga_satuan),
        receipt_date: formData.receipt_date
      };

      const result = await addGoodsReceiptAction(payload);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Barang masuk berhasil disimpan & stok diupdate');
        setFormData({ item_id: '', supplier_id: '', quantity: '', harga_satuan: '', receipt_date: new Date().toISOString().split('T')[0] });
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
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Tambah Barang Masuk</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Barang <span className="text-red-500">*</span></label>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white"
            >
              <option value="">Pilih Barang...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.item_code} - {item.name} (Stok: {item.current_stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier <span className="text-red-500">*</span></label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white"
              >
                <option value="">Pilih Supplier...</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="receipt_date"
                value={formData.receipt_date}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kuantitas Masuk <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga Satuan (Rp) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="harga_satuan"
                value={formData.harga_satuan}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mt-2">
            <p className="text-sm text-purple-700 font-medium mb-1">Total Nilai Barang Masuk</p>
            <p className="text-2xl font-bold text-[#7C3AED]">
              Rp {((Number(formData.quantity) || 0) * (Number(formData.harga_satuan) || 0)).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="mt-4 flex flex-col-reverse md:flex-row gap-3 justify-end sticky bottom-0 bg-white pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-70 flex justify-center">
              {isSubmitting ? 'Memproses...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
