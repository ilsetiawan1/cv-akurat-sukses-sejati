'use client';

import { useState } from 'react';
import { manageCategoryAction } from '@/lib/actions/settings.actions';
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
        toast.success(action === 'add' ? 'Kategori ditambahkan' : 'Kategori diperbarui', { id: toastId });
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
    
    const toastId = toast.loading('Menghapus kategori...');
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
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kategori Barang</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola kelompok jenis barang (Misal: ANALITIK, SPAREPART).</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setFormData({name: '', description: ''}); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md shadow-purple-200"
        >
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
              <th className="px-5 py-4 font-semibold">Nama Kategori</th>
              <th className="px-5 py-4 font-semibold">Deskripsi</th>
              <th className="px-5 py-4 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-sm">
            {isAdding && (
              <tr className="bg-purple-50/50">
                <td className="px-5 py-4">
                  <input autoFocus type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama..." className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100" />
                </td>
                <td className="px-5 py-4">
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi..." className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100" />
                </td>
                <td className="px-5 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleSave('add')} disabled={loading} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"><Check size={18}/></button>
                  <button onClick={() => setIsAdding(false)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><X size={18}/></button>
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <td className="px-5 py-4">
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100" />
                    </td>
                    <td className="px-5 py-4">
                      <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100" />
                    </td>
                    <td className="px-5 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleSave('edit', cat.id)} disabled={loading} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"><Check size={18}/></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"><X size={18}/></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-5 py-4 text-gray-600">{cat.description || '-'}</td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => { setEditingId(cat.id); setFormData({ name: cat.name, description: cat.description || '' }); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block mr-2 transition-colors"
                      >
                        <Edit2 size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg inline-block transition-colors"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && !isAdding && (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500 text-sm font-medium">Belum ada data kategori.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
