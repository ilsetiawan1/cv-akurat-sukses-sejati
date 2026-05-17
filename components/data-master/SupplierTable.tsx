'use client';

import { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Download, FileText } from 'lucide-react';
import type { Supplier } from '@/types/supplier.types';
import SupplierFormModal from './SupplierFormModal';
import { Pagination } from '../ui/Pagination';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { deleteSupplierAction } from '@/lib/actions/supplier.actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface SupplierTableProps {
  data: Supplier[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
}

export default function SupplierTable({ data, total, currentPage, limit, searchQuery }: SupplierTableProps) {
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

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteSupplierAction(supplierToDelete.id);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus supplier');
    } finally {
      setIsConfirmOpen(false);
      setSupplierToDelete(null);
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }
    
    const headers = ['ID Supplier', 'Nama', 'Kontak', 'Email', 'Telepon', 'Alamat'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.supplier_code,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${(item.contact_name || '').replace(/"/g, '""')}"`,
        item.email || '',
        `"${item.phone || ''}"`,
        `"${(item.address || '').replace(/"/g, '""')}"`
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
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Action Bar */}
        <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="w-full md:w-auto relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition-all"
            />
          </form>

          <div className="flex w-full md:w-auto gap-3">
            <button 
              onClick={() => {
                setSelectedSupplier(null);
                setIsModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Plus size={16} className="text-gray-500" />
              <span>Tambah Supplier Baru</span>
            </button>

            <button 
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6035BB] text-white rounded-lg hover:bg-[#5229a8] transition-colors text-sm font-medium"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] text-[#8E95A9] text-xs font-semibold border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-not-allowed opacity-50" disabled />
                </th>
                <th className="py-4 px-4 min-w-[200px] whitespace-nowrap">Nama Supplier</th>
                <th className="py-4 px-4 min-w-[120px] whitespace-nowrap">ID Supplier</th>
                <th className="py-4 px-4 min-w-[150px] whitespace-nowrap">Nama Kontak</th>
                <th className="py-4 px-4 min-w-[200px] whitespace-nowrap">Email</th>
                <th className="py-4 px-4 min-w-[200px] whitespace-nowrap">Alamat</th>
                <th className="py-4 px-4 min-w-[150px] whitespace-nowrap">No. Telepon</th>
                <th className="py-4 px-4 text-center whitespace-nowrap w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-900">Tidak ada data</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center font-semibold text-xs shrink-0 text-white shadow-sm overflow-hidden">
                          {item.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="drop-shadow-sm">{getInitials(item.name)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.supplier_code}</td>
                    <td className="py-3 px-4 text-gray-500">{item.contact_name || '-'}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{item.email || '-'}</td>
                    <td className="py-3 px-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]">{item.address || '-'}</span>
                        {item.address && <span className="text-gray-300">•••</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.phone || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <button 
                          onClick={() => {
                            setSupplierToDelete(item);
                            setIsConfirmOpen(true);
                          }}
                          className="hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="hover:text-[#7C3AED] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-center bg-white">
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
