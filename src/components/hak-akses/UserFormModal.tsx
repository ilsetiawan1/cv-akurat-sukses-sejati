// components/hak-akses/UserFormModal.tsx

'use client';

import { useState, useEffect, useTransition } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { createUserAction, updateUserAction, updatePermissionsAction } from '@/lib/actions/user.actions';
import type { UserWithPermissions, FeatureKey, PermissionInput } from '@/types/user.types';

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

// Tipe eksplisit untuk permission state
type PermissionState = Record<FeatureKey, Record<CrudField, boolean>>;

// FIX: Buat object dengan key FeatureKey secara eksplisit
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

  // FIX: Inisialisasi state langsung dari props/user, bukan via useEffect
  // Gunakan key prop di parent untuk re-mount komponen saat user berubah
  const [permissions, setPermissions] = useState<PermissionState>(() => initPermissions(user));

  // FIX: Ganti useEffect + setState dengan derived state reset saat open berubah
  // Pakai useEffect hanya untuk reset (tidak untuk derived state update)
  useEffect(() => {
    if (open) {
      // Reset saat modal dibuka — ini adalah "sync with external prop", bukan cascading
      startTransition(() => {
        setPermissions(initPermissions(user));
        setError('');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

        // Simpan permissions
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {/* ── Form Fields ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={user?.name}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={user?.email}
                disabled={isEdit}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {!isEdit && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 karakter"
                    className="w-full px-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                name="role"
                defaultValue={user?.role ?? 'admin'}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status"
                  defaultValue={user?.status ?? 'active'}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {/* ── Permission Table ── */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Hak Akses Fitur</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Fitur</th>
                    {CRUD_FIELDS.map((c) => (
                      <th
                        key={c}
                        className="text-center px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide w-20"
                      >
                        {CRUD_LABELS[c]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {FEATURES.map(({ key, label }) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{label}</td>
                      {CRUD_FIELDS.map((c) => (
                        <td
                          key={c}
                          className="px-3 py-3 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={permissions[key][c]}
                            onChange={() => togglePerm(key, c)}
                            className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {isPending && (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              )}
              {isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
