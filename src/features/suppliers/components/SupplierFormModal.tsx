// src/features/suppliers/components/SupplierFormModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Supplier } from '@/features/suppliers/types/supplier.types';
import { addSupplierAction, editSupplierAction } from '@/features/suppliers/actions/supplier.actions';

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 md:p-6 border-b border-slate-100 z-20">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
            {supplier ? 'Edit Data Supplier' : 'Tambah Supplier Baru'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-6 gap-4 sm:gap-5">
          {error && (
            <div className="p-3 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Nama Supplier <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
                placeholder="Contoh: PT Auto Parts Indonesia"
              />
            </div>

            <div>
              <label htmlFor="contact_name" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Nama Kontak Person
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
                  placeholder="kontak@autoparts.co.id"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Alamat Kantor / Gudang
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all resize-none placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
                placeholder="Alamat lengkap supplier rekanan"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#1E3A8A] rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.99]"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
