// src/features/settings/components/ProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import { updateProfileAction } from '@/features/settings/actions/settings.actions';
import toast from 'react-hot-toast';
import { Camera, Save } from 'lucide-react';
import type { User } from '@/features/users/types/user.types';

interface Props {
  user: User;
  companyName: string;
  companyAddress: string;
}

function formatUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hour}:${min} WIB`;
}

export default function ProfileForm({ user, companyName, companyAddress }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto profil maksimal 5 MB');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, WebP)');
      e.target.value = '';
      return;
    }

    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Menyimpan pembaruan profil...');
    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateProfileAction(formData);
      if (res.success) {
        toast.success('Profil dan identitas perusahaan berhasil disimpan!', { id: toastId });
        const passInput = document.getElementById('password') as HTMLInputElement;
        if (passInput) passInput.value = '';
      } else {
        toast.error(res.error || 'Terjadi kesalahan saat menyimpan', { id: toastId });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memproses form';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const updatedAtText = user.updated_at ? formatUpdatedAt(user.updated_at) : null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 md:p-6 rounded-2xl shadow-xs border border-slate-200/80 max-w-3xl">
      <input type="hidden" name="current_avatar" value={user.avatar_url || ''} />

      {/* Avatar & Identitas Akun */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-6 border-b border-slate-100">
        <div className="flex flex-col items-center gap-2.5">
          <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
            {previewAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-slate-400">{user.name.charAt(0).toUpperCase()}</span>
            )}
            <div
              className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white" size={20} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
          >
            Ubah Foto Profil
          </button>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Informasi Akun</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola identitas diri dan kredensial login akun Anda.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              required
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-colors outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              required
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-colors outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Password Baru{' '}
              <span className="text-slate-400 font-normal">(Kosongkan jika tidak ingin mengganti)</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-colors outline-none"
            />
          </div>
        </div>
      </div>

      {/* Informasi Perusahaan */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Identitas Perusahaan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Informasi ini digunakan sebagai kop surat resmi laporan persediaan (PDF/Cetak).
            </p>
          </div>
          {updatedAtText && (
            <span className="text-xs text-slate-400 font-normal shrink-0">
              Terakhir diperbarui: {updatedAtText}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Nama Perusahaan</label>
            <input
              type="text"
              name="company_name"
              defaultValue={companyName}
              placeholder="CV. AKURAT SUKSES SEJATI"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-colors outline-none font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Alamat Perusahaan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              name="company_address"
              defaultValue={companyAddress}
              placeholder="Alamat kantor..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-colors outline-none text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-blue-800 shadow-2xs transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  );
}
