// src/features/suppliers/components/SupplierTable.tsx
'use client';

import { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Download, Archive } from 'lucide-react';
import type { Supplier } from '@/features/suppliers/types/supplier.types';
import SupplierFormModal from './SupplierFormModal';
import SupplierMobileCardList from './SupplierMobileCardList';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { deleteSupplierAction } from '@/features/suppliers/actions/supplier.actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface SupplierTableProps {
  data: Supplier[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function SupplierTable({ 
  data, 
  total, 
  currentPage, 
  limit, 
  searchQuery,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}: SupplierTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteSupplierAction(supplierToDelete.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Supplier berhasil dihapus');
      }
    } catch {
      toast.error('Gagal menghapus supplier');
    } finally {
      setIsConfirmOpen(false);
      setSupplierToDelete(null);
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data supplier untuk diekspor');
      return;
    }
    
    const headers = ['ID Supplier', 'Nama', 'Kontak', 'Email', 'Telepon', 'Alamat'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.supplier_code,
        `"${item.name.replaceAll('"', '""')}"`,
        `"${(item.contact_name || '').replaceAll('"', '""')}"`,
        item.email || '',
        `"${item.phone || ''}"`,
        `"${(item.address || '').replaceAll('"', '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_supplier_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data supplier berhasil diekspor ke CSV');
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Table Toolbar with Search on left & Actions on right */}
        <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-100">
          {/* SISI KIRI: Search Bar Mandiri */}
          <div className="w-full md:w-auto md:flex-1 md:max-w-sm lg:max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama atau kode supplier..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white shadow-2xs"
              />
            </form>
          </div>

          {/* SISI KANAN: Export CSV & Tambah Supplier */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end shrink-0">
            <button 
              type="button"
              onClick={exportToCSV}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Download size={15} className="text-slate-500" />
              <span>CSV</span>
            </button>

            {canCreate && (
              <button 
                type="button"
                onClick={() => {
                  setSelectedSupplier(null);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-all text-xs sm:text-sm font-medium shadow-xs cursor-pointer active:scale-[0.99] shrink-0 whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Supplier Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Mobile View: Card List (< md) */}
        <div className="block md:hidden">
          <SupplierMobileCardList 
            data={data}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDeletePrompt}
          />
        </div>

        {/* 2. Desktop View: Responsive Table (>= md) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-190">
            <thead>
              <tr className="bg-slate-50/75 text-slate-800 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3.5 px-5 min-w-50">Nama Supplier</th>
                <th className="py-3.5 px-5">ID Supplier</th>
                <th className="py-3.5 px-5">Kontak Person</th>
                <th className="py-3.5 px-5">Email</th>
                <th className="py-3.5 px-5">No. Telepon</th>
                <th className="py-3.5 px-5">Alamat</th>
                {(canUpdate || canDelete) && (
                  <th className="py-3.5 px-5 text-center w-24">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={canUpdate || canDelete ? 7 : 6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <Archive className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm">Belum ada data supplier</p>
                      <p className="text-slate-400 text-xs mt-0.5">Daftar mitra supplier rekanan akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#1E3A8A] border border-slate-200/80 flex items-center justify-center font-medium text-xs shrink-0 select-none overflow-hidden">
                          {item.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{getInitials(item.name)}</span>
                          )}
                        </div>
                        <span className="font-medium text-slate-900 group-hover:text-blue-900 leading-tight">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {item.supplier_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-xs">
                      {item.contact_name || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-xs">
                      {item.email || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium text-xs tabular-nums">
                      {item.phone || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 text-xs max-w-48 truncate" title={item.address || ''}>
                      {item.address || '-'}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          {canUpdate && (
                            <button 
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="p-1.5 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit data supplier"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              type="button"
                              onClick={() => handleDeletePrompt(item)}
                              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus supplier"
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
        {total > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-slate-800 tabular-nums">{(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-slate-800 tabular-nums">{total}</span> data
            </div>
            <Pagination
              page={currentPage}
              total={total}
              limit={limit}
              onPageChange={(page) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', page.toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <SupplierFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        supplier={selectedSupplier} 
      />

      <ConfirmDialog
        open={isConfirmOpen}
        title="Hapus Supplier"
        description={`Apakah Anda yakin ingin menghapus supplier "${supplierToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
