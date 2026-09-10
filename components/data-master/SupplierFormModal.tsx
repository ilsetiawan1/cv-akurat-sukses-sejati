'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Supplier } from '@/types/supplier.types';
import { addSupplierAction, editSupplierAction } from '@/lib/actions/supplier.actions';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
}

export default function SupplierFormModal({ isOpen, onClose, supplier }: SupplierFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [prevTrack, setPrevTrack] = useState<{ id?: string; isOpen: boolean }>({ id: supplier?.id, isOpen });
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact_name: supplier?.contact_name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || ''
  });

  if (prevTrack.id !== supplier?.id || prevTrack.isOpen !== isOpen) {
    setPrevTrack({ id: supplier?.id, isOpen });
    setFormData({
      name: supplier?.name || '',
      contact_name: supplier?.contact_name || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || ''
    });
    setError('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let result;
      if (supplier) {
        result = await editSupplierAction(supplier.id, formData);
      } else {
        result = await addSupplierAction(formData);
      }

      if (!result.success) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col z-10">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 md:p-6 border-b z-20">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {supplier ? 'Edit Supplier' : 'Tambah Supplier'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-6 gap-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Supplier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-[#7C3AED] outline-none transition-all"
                placeholder="Contoh: PT Auto Parts"
              />
            </div>

            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Kontak
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-[#7C3AED] outline-none transition-all"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
                  placeholder="email@perusahaan.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all resize-none"
                placeholder="Alamat lengkap supplier"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t flex flex-col-reverse md:flex-row justify-end gap-3 sticky bottom-0 bg-white">
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
