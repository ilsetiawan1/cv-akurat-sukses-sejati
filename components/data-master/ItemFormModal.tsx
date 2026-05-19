// components/data-master/ItemFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ItemWithRelations, Category, Unit } from '@/types/item.types';
import { addItemAction, editItemAction } from '@/lib/actions/item.actions';
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

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    unit_id: '',
    price: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category_id: item.category_id || '',
        unit_id: item.unit_id || '',
        price: item.price.toString()
      });
    } else {
      setFormData({
        name: '',
        category_id: '',
        unit_id: '',
        price: ''
      });
    }
  }, [item, isOpen]);

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
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 md:p-6 border-b z-20">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {item ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-6 gap-5">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
                placeholder="Contoh: Aki GS Astra Premium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white"
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Satuan
                </label>
                <select
                  id="unit_id"
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white"
                >
                  <option value="">Pilih Satuan...</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Harga Jual (Rp) <span className="text-red-500">*</span>
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all font-mono"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex flex-col-reverse md:flex-row justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
