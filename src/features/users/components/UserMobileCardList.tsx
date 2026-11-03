// src/features/users/components/UserMobileCardList.tsx
'use client';

import Image from 'next/image';
import { Pencil, Trash2, Shield, Mail } from 'lucide-react';
import type { UserWithPermissions } from '../types/user.types';

export interface UserMobileCardListProps {
  data: UserWithPermissions[];
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (user: UserWithPermissions) => void;
  onDelete: (user: UserWithPermissions) => void;
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover border border-slate-200/80 shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1E3A8A] text-xs font-semibold flex items-center justify-center uppercase select-none border border-slate-200/80 shrink-0">
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

export default function UserMobileCardList({
  data,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: UserMobileCardListProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <Shield className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Tidak ada pengguna ditemukan</p>
          <p className="text-slate-400 text-xs mt-0.5">Daftar pengguna dan staf sistem akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {data.map((user) => (
        <div key={user.id} className="p-4 space-y-2.5">
          {/* Baris 1: Avatar, Nama & Aksi */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={user.name} avatarUrl={user.avatar_url} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-2xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                    {user.user_code}
                  </span>
                  <span
                    className={`text-2xs font-medium px-2 py-0.5 rounded-full ${
                      user.role === 'super_admin'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                        : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
              </div>
            </div>

            {/* Aksi Cepat Mobile */}
            {(canUpdate || canDelete) && (
              <div className="flex items-center gap-1 shrink-0">
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit pengguna"
                  >
                    <Pencil size={15} />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus pengguna"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Baris 2: Email & Status */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/80">
            <div className="flex items-center gap-1.5 text-slate-600 truncate mr-2">
              <Mail size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium shrink-0 ${
                user.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

