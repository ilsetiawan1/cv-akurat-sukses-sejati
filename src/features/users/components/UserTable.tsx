// src/features/users/components/UserTable.tsx
'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Search, Download, Pencil, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsersAction, deleteUserAction } from '@/features/users/actions/user.actions';
import { UserFormModal } from '@/features/users/components/UserFormModal';
import UserMobileCardList from '@/features/users/components/UserMobileCardList';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import type { UserWithPermissions } from '@/features/users/types/user.types';

const LIMIT = 10;

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover border border-slate-200/80 shrink-0"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#1E3A8A] text-xs font-semibold flex items-center justify-center uppercase select-none border border-slate-200/80 shrink-0">
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          : 'bg-slate-100 text-slate-600 border border-slate-200/60'
      }`}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

function TableSkeleton() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <tr key={i}>
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function UserTable({
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}: {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}) {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserWithPermissions | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserWithPermissions | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback((p: number, q: string) => {
    startTransition(async () => {
      const result = await getUsersAction(p, LIMIT, q);
      if (result.success && result.data) {
        setUsers(result.data.data);
        setTotal(result.data.total);
      }
      setShowSkeleton(false);
    });
  }, []);

  useEffect(() => {
    loadUsers(1, '');
  }, [loadUsers]);

  useEffect(() => {
    if (!showSkeleton) loadUsers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  function handleAdd() {
    setEditUser(null);
    setModalOpen(true);
  }

  function handleEdit(user: UserWithPermissions) {
    setEditUser(user);
    setModalOpen(true);
  }

  function handleModalSuccess() {
    loadUsers(page, search);
  }

  function handleDeletePrompt(user: UserWithPermissions) {
    setDeleteTarget(user);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteUserAction(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (!result.success) {
      toast.error(result.error || 'Gagal menghapus pengguna');
    } else {
      toast.success('Pengguna berhasil dihapus');
      loadUsers(page, search);
    }
  }

  function handleExport() {
    if (users.length === 0) {
      toast.error('Tidak ada data pengguna untuk diekspor');
      return;
    }
    const headers = ['ID Pengguna', 'Nama', 'Email', 'Role', 'Status'];
    const rows = users.map((u) => [
      u.user_code,
      `"${u.name.replaceAll('"', '""')}"`,
      `"${u.email.replaceAll('"', '""')}"`,
      u.role,
      u.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_pengguna_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isLoading = showSkeleton || isPending;

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Header Action Bar */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-100">
          {/* Sisi Kiri: Search Input */}
          <div className="w-full md:max-w-xs lg:max-w-sm relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sisi Kanan: Ekspor & Tambah Pengguna */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
              title="Ekspor CSV"
            >
              <Download size={14} className="text-slate-500" />
              <span>CSV</span>
            </button>
            {canCreate && (
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
              >
                <Plus size={15} />
                <span>Tambah Pengguna</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden">
          <UserMobileCardList
            data={users}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDeletePrompt}
          />
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 text-slate-800 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Staf</th>
                <th className="py-3 px-4">ID Pengguna</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                {(canUpdate || canDelete) && (
                  <th className="py-3 px-4 text-center w-24">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm" suppressHydrationWarning>
              {isLoading ? (
                <TableSkeleton />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={canUpdate || canDelete ? 6 : 5} className="py-12 px-4 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <Shield className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm">Tidak ada pengguna ditemukan</p>
                      <p className="text-slate-400 text-xs mt-0.5">Daftar pengguna dan staf sistem akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} avatarUrl={user.avatar_url} />
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        {user.user_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          user.role === 'super_admin'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                        }`}
                      >
                        {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={user.status} />
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {canUpdate && (
                            <button
                              type="button"
                              onClick={() => handleEdit(user)}
                              className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50/80 rounded-lg transition-colors cursor-pointer"
                              title="Edit pengguna"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeletePrompt(user)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors cursor-pointer"
                              title="Hapus pengguna"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-slate-800">{(page - 1) * LIMIT + 1}</span> -{' '}
              <span className="font-medium text-slate-800">{Math.min(page * LIMIT, total)}</span> dari{' '}
              <span className="font-medium text-slate-800">{total}</span> pengguna
            </div>
            {total > LIMIT && (
              <Pagination
                page={page}
                total={total}
                limit={LIMIT}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        open={modalOpen}
        user={editUser}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus pengguna "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
