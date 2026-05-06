// app/(dashboard)/hak-akses/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Download, Pencil, Trash2, Shield } from 'lucide-react';
import { getUsersAction, deleteUserAction } from '@/lib/actions/user.actions';
import { UserFormModal } from '@/components/hak-akses/UserFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import type { UserWithPermissions } from '@/types/user.types';

const LIMIT = 10;

// Avatar: inisial nama
function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover border border-gray-100" />;
  }
  return (
    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 text-sm font-bold flex items-center justify-center uppercase select-none">
      {name.charAt(0)}
    </div>
  );
}

// Badge status
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
    }`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function HakAksesPage() {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserWithPermissions | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<UserWithPermissions | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const result = await getUsersAction(page, LIMIT, search);
    if (result.success && result.data) {
      setUsers(result.data.data);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  function handleAdd() { setEditUser(null); setModalOpen(true); }
  function handleEdit(user: UserWithPermissions) { setEditUser(user); setModalOpen(true); }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteUserAction(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    fetchUsers();
  }

  // Export CSV sederhana
  function handleExport() {
    const headers = ['ID Pengguna', 'Nama', 'Email', 'Role', 'Status'];
    const rows = users.map((u) => [u.user_code, u.name, u.email, u.role, u.status]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hak-akses-pengguna.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hak Akses Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola akun dan hak akses pengguna sistem</p>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Export
            </button>
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Plus size={15} />
              Tambah Pengguna Baru
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3.5 font-medium text-gray-500 w-8">
                  <input type="checkbox" className="w-4 h-4 rounded accent-purple-600" />
                </th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">Nama</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">ID Pengguna</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Shield size={32} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-gray-400 text-sm">Tidak ada pengguna ditemukan</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" className="w-4 h-4 rounded accent-purple-600" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} avatarUrl={user.avatar_url} />
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{user.user_code}</td>
                    <td className="px-4 py-3.5 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.role === 'super_admin'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(user)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isLoading && total > LIMIT && (
          <div className="px-4 py-4 border-t border-gray-100">
            <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <UserFormModal
        open={modalOpen}
        user={editUser}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Pengguna"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}