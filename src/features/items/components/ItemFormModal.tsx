// src/features/items/components/ItemFormModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { ItemWithRelations, Category, Unit } from '@/features/items/types/item.types';
import { addItemAction, editItemAction } from '@/features/items/actions/item.actions';
import toast from 'react-hot-toast';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ItemWithRelations | null;
  categories: Category[];
  units: Unit[];
}

export default function ItemFormModal({ isOpen, onClose, item, categories, units }: ItemFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prevTrack, setPrevTrack] = useState<{ id?: string; isOpen: boolean }>({ id: item?.id, isOpen });
  const [formData, setFormData] = useState({
    name: item?.name ?? '',
    category_id: item?.category_id || '',
    unit_id: item?.unit_id || '',
    price: item ? item.price.toString() : ''
  });

  if (prevTrack.id !== item?.id || prevTrack.isOpen !== isOpen) {
    setPrevTrack({ id: item?.id, isOpen });
    setFormData({
      name: item?.name ?? '',
      category_id: item?.category_id || '',
      unit_id: item?.unit_id || '',
      price: item ? item.price.toString() : ''
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        category_id: formData.category_id || null,
        unit_id: formData.unit_id || null,
        price: Number(formData.price) || 0
      };

      let result;
      if (item) {
        result = await editItemAction(item.id, payload);
      } else {
        result = await addItemAction(payload);
      }

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(item ? 'Barang berhasil diperbarui' : 'Barang berhasil ditambahkan');
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs flex items-center justify-between p-4 md:p-5 border-b border-slate-100 z-20">
          <h2 className="text-base md:text-lg font-semibold text-slate-900">
            {item ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-5 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1.5">
                Nama Suku Cadang / Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400"
                placeholder="Contoh: Aki GS Astra Premium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="category_id" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Kategori
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="unit_id" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Satuan
                </label>
                <select
                  id="unit_id"
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="">Pilih Satuan...</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-xs font-medium text-slate-700 mb-1.5">
                Harga Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="100"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all font-medium tabular-nums placeholder:text-slate-400"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-2xs"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
