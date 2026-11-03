// src/features/users/components/UserFormModal.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { createUserAction, updateUserAction, updatePermissionsAction } from '@/features/users/actions/user.actions';
import type { UserWithPermissions, FeatureKey, PermissionInput } from '@/features/users/types/user.types';

const FEATURES: { key: FeatureKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'hak_akses', label: 'Hak Akses' },
  { key: 'data_master', label: 'Data Master' },
  { key: 'transaksi', label: 'Transaksi' },
  { key: 'laporan', label: 'Laporan' },
  { key: 'pengaturan', label: 'Pengaturan' },
];

const CRUD_FIELDS = ['can_create', 'can_read', 'can_update', 'can_delete'] as const;
type CrudField = (typeof CRUD_FIELDS)[number];
const CRUD_LABELS: Record<CrudField, string> = {
  can_create: 'Create',
  can_read: 'Read',
  can_update: 'Update',
  can_delete: 'Delete',
};

type PermissionState = Record<FeatureKey, Record<CrudField, boolean>>;

function buildDefaultPermissions(): PermissionState {
  return {
    dashboard: { can_create: false, can_read: true, can_update: false, can_delete: false },
    hak_akses: { can_create: false, can_read: true, can_update: false, can_delete: false },
    data_master: { can_create: false, can_read: true, can_update: false, can_delete: false },
    transaksi: { can_create: false, can_read: true, can_update: false, can_delete: false },
    laporan: { can_create: false, can_read: true, can_update: false, can_delete: false },
    pengaturan: { can_create: false, can_read: true, can_update: false, can_delete: false },
  };
}

function initPermissions(user?: UserWithPermissions | null): PermissionState {
  const defaults = buildDefaultPermissions();
  if (!user?.user_permissions) return defaults;
  user.user_permissions.forEach((p) => {
    if (p.feature in defaults) {
      defaults[p.feature] = {
        can_create: p.can_create,
        can_read: p.can_read,
        can_update: p.can_update,
        can_delete: p.can_delete,
      };
    }
  });
  return defaults;
}

interface UserFormModalProps {
  open: boolean;
  user?: UserWithPermissions | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormModal({ open, user, onClose, onSuccess }: UserFormModalProps) {
  const isEdit = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [permissions, setPermissions] = useState<PermissionState>(() => initPermissions(user));

  useEffect(() => {
    if (open) {
      startTransition(() => {
        setPermissions(initPermissions(user));
        setError('');
      });
    }
  }, [open, user]);

  function togglePerm(feature: FeatureKey, field: CrudField) {
    setPermissions((prev) => ({
      ...prev,
      [feature]: { ...prev[feature], [field]: !prev[feature][field] },
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        let userId = user?.id ?? '';

        if (!isEdit) {
          const result = await createUserAction({
            name: fd.get('name') as string,
            email: fd.get('email') as string,
            password: fd.get('password') as string,
            role: fd.get('role') as 'super_admin' | 'admin',
          });
          if (!result.success) {
            setError(result.error);
            return;
          }
          userId = result.data!.id;
        } else {
          const result = await updateUserAction(user!.id, {
            name: fd.get('name') as string,
            role: fd.get('role') as 'super_admin' | 'admin',
            status: fd.get('status') as 'active' | 'inactive',
          });
          if (!result.success) {
            setError(result.error);
            return;
          }
        }

        const permArray: PermissionInput[] = FEATURES.map(({ key }) => ({
          feature: key,
          can_create: permissions[key].can_create,
          can_read: permissions[key].can_read,
          can_update: permissions[key].can_update,
          can_delete: permissions[key].can_delete,
        }));

        const permResult = await updatePermissionsAction({ userId, permissions: permArray });
        if (!permResult.success) {
          setError(permResult.error);
          return;
        }

        onSuccess();
        onClose();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs flex items-center justify-between p-4 md:p-5 border-b border-slate-100 z-20">
          <h2 className="text-base md:text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={user?.name}
                placeholder="Masukkan nama lengkap staf"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={user?.email}
                disabled={isEdit}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400"
              />
            </div>

            {!isEdit && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 karakter"
                    className="w-full px-3.5 pr-10 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Role Akses</label>
              <select
                name="role"
                defaultValue={user?.role ?? 'admin'}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all bg-white cursor-pointer text-slate-700"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {isEdit && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Status Akun</label>
                <select
                  name="status"
                  defaultValue={user?.status ?? 'active'}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all bg-white cursor-pointer text-slate-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {/* Permission Table */}
          <div>
            <p className="text-xs font-medium text-slate-700 mb-2">Matriks Hak Akses Modul</p>
            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-200/70">
                  <tr>
                    <th className="text-left px-3.5 py-2.5 font-semibold text-slate-800 uppercase tracking-wider">Modul</th>
                    {CRUD_FIELDS.map((c) => (
                      <th
                        key={c}
                        className="text-center px-2 py-2.5 font-semibold text-slate-800 uppercase tracking-wider w-16"
                      >
                        {CRUD_LABELS[c]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {FEATURES.map(({ key, label }) => (
                    <tr key={key} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3.5 py-2.5 font-medium text-slate-800">{label}</td>
                      {CRUD_FIELDS.map((c) => (
                        <td key={c} className="px-2 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={permissions[key][c]}
                            onChange={() => togglePerm(key, c)}
                            className="w-4 h-4 rounded accent-[#1E3A8A] cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {isPending && (
                <Loader2 size={13} className="animate-spin" />
              )}
              <span>{isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
