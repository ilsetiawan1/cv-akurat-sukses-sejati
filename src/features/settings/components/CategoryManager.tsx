// src/features/settings/components/CategoryManager.tsx
'use client';

import { useState } from 'react';
import { manageCategoryAction } from '@/features/settings/actions/settings.actions';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (action: 'add' | 'edit', id?: string) => {
    if (!formData.name) return toast.error('Nama kategori wajib diisi');
    
    setLoading(true);
    const toastId = toast.loading('Menyimpan kategori...');
    try {
      const res = await manageCategoryAction(action, { id, ...formData });
      if (res.success) {
        toast.success(action === 'add' ? 'Kategori berhasil ditambahkan' : 'Kategori berhasil diperbarui', { id: toastId });
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
      } else {
        toast.error(res.error || 'Gagal menyimpan kategori', { id: toastId });
      }
    } catch {
      toast.error('Gagal menghubungi server', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"? Pastikan tidak ada barang yang menggunakannya.`)) return;
    
    const toastId = toast.loading('Menyimpan perubahan...');
    try {
      const res = await manageCategoryAction('delete', { id });
      if (res.success) {
        toast.success('Kategori berhasil dihapus', { id: toastId });
      } else {
        toast.error(res.error || 'Gagal menghapus kategori', { id: toastId });
      }
    } catch {
      toast.error('Gagal menghapus kategori', { id: toastId });
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xs border border-slate-200/80 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Kategori Barang</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola kelompok jenis suku cadang otomotif (Contoh: AKI, SPAREPART, OLI).</p>
        </div>
        <button 
          type="button"
          onClick={() => { setIsAdding(true); setFormData({ name: '', description: '' }); }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] text-white text-xs font-medium rounded-xl hover:bg-blue-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 text-slate-800 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
              <th className="px-4 py-3">Nama Kategori</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-xs">
            {isAdding && (
              <tr className="bg-blue-50/40">
                <td className="px-4 py-2.5">
                  <input
                    autoFocus
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama kategori..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 bg-white"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 bg-white"
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleSave('add')}
                      disabled={loading}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Simpan"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Batal"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 bg-white"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 bg-white"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleSave('edit', cat.id)}
                          disabled={loading}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Simpan"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Batal"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-slate-900">{cat.name}</td>
                    <td className="px-4 py-3 text-slate-600">{cat.description || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          type="button"
                          onClick={() => { setEditingId(cat.id); setFormData({ name: cat.name, description: cat.description || '' }); }}
                          className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50/80 rounded-lg transition-colors cursor-pointer"
                          title="Edit kategori"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors cursor-pointer"
                          title="Hapus kategori"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && !isAdding && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-400 text-xs">
                  Belum ada data kategori suku cadang.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
