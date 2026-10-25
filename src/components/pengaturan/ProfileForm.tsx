'use client';

import { useState, useRef } from 'react';
import { updateProfileAction } from '@/lib/actions/settings.actions';
import toast from 'react-hot-toast';
import { Camera, Save } from 'lucide-react';
import type { User } from '@/types/user.types';

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
  return `${day}/${month}/${year} - Jam ${hour}:${min} WIB`;
}

export default function ProfileForm({ user, companyName, companyAddress }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Menyimpan pembaruan profil...');
    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateProfileAction(formData);
      if (res.success) {
        toast.success('Profil dan Pengaturan berhasil diperbarui!', { id: toastId });
        const passInput = document.getElementById('password') as HTMLInputElement;
        if (passInput) passInput.value = '';
      } else {
        toast.error(res.error || 'Terjadi kesalahan', { id: toastId });
      }
    } catch {
      toast.error('Gagal memproses form', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const updatedAtText = user.updated_at ? formatUpdatedAt(user.updated_at) : null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <input type="hidden" name="current_avatar" value={user.avatar_url || ''} />

      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-10 border-b border-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full border-4 border-purple-50 bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
            {previewAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
            )}
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-medium text-[#7C3AED] hover:text-purple-700"
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

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Informasi Akun</h3>
            <p className="text-sm text-gray-500 mb-3">Kelola identitas dan kredensial login Anda.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password Baru{' '}
              <span className="text-gray-400 font-normal">(Kosongkan jika tidak ingin ganti)</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors outline-none"
            />
          </div>
        </div>
      </div>

      {/* Informasi Perusahaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Informasi Perusahaan</h3>
          <p className="text-sm text-gray-500 mb-4">
            Data ini akan digunakan secara global sebagai Kop Surat Laporan PDF.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Nama Perusahaan</label>
            {updatedAtText && (
              <span className="text-xs text-gray-400 font-normal">(Terakhir diperbarui: {updatedAtText})</span>
            )}
          </div>
          <input
            type="text"
            name="company_name"
            defaultValue={companyName}
            placeholder="CV. AKURAT SUKSES SEJATI"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Alamat Perusahaan{' '}
              <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            {updatedAtText && (
              <span className="text-xs text-gray-400 font-normal">(Terakhir diperbarui: {updatedAtText})</span>
            )}
          </div>
          <input
            type="text"
            name="company_address"
            defaultValue={companyAddress}
            placeholder="Alamat kantor..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#7C3AED] to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-md shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  );
}
