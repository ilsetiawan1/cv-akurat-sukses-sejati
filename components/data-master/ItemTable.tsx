// components/data-master/ItemTable.tsx
'use client';

import { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Download, PackageOpen, Filter } from 'lucide-react';
import type { ItemWithRelations, Category, Unit } from '@/types/item.types';
import ItemFormModal from './ItemFormModal';
import { Pagination } from '../ui/Pagination';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { deleteItemAction } from '@/lib/actions/item.actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface ItemTableProps {
  data: ItemWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  categoryQuery: string;
  categories: Category[];
  units: Unit[];
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function ItemTable({ 
  data, total, currentPage, limit, searchQuery, categoryQuery, 
  categories, units, canCreate = true, canUpdate = true, canDelete = true 
}: ItemTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithRelations | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchInput, categoryQuery);
  };

  const handleCategoryFilter = (categoryId: string) => {
    updateFilters(searchInput, categoryId);
  };

  const updateFilters = (search: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set('search', search);
    else params.delete('search');
    
    if (category) params.set('category', category);
    else params.delete('category');
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEdit = (item: ItemWithRelations) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteItemAction(itemToDelete.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Barang berhasil dihapus');
      }
    } catch {
      toast.error('Gagal menghapus barang');
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }
    
    const headers = ['Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Harga Jual'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.item_code,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category?.name || '-'}"`,
        `"${item.unit?.name || '-'}"`,
        item.price
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_barang_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Action Bar */}
        <div className="p-4 md:p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <form onSubmit={handleSearch} className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
              />
            </form>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={categoryQuery}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all bg-white appearance-none cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <button 
              onClick={exportToCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Download size={16} className="text-gray-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {canCreate && (
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] transition-colors text-sm font-medium shadow-sm shadow-purple-200"
              >
                <Plus size={16} />
                <span>Tambah Barang</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-[#8E95A9] text-xs font-semibold border-b border-gray-100 uppercase tracking-wider">
                <th className="py-4 px-5">Kode</th>
                <th className="py-4 px-5">Nama Barang</th>
                <th className="py-4 px-5">Kategori</th>
                <th className="py-4 px-5">Satuan</th>
                <th className="py-4 px-5 text-right">Harga Jual</th>
                {(canUpdate || canDelete) && (
                  <th className="py-4 px-5 text-center w-24">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={canUpdate || canDelete ? 6 : 5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <PackageOpen className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-900">Tidak ada data barang</p>
                      <p className="text-gray-400 text-xs mt-1">Coba sesuaikan filter atau tambahkan barang baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-mono text-xs">
                        {item.item_code}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-semibold text-gray-900">{item.name}</td>
                    <td className="py-3 px-5 text-gray-600">
                      {item.category ? (
                        <button 
                          onClick={() => handleCategoryFilter(item.category!.id)}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 hover:bg-purple-100 transition-colors"
                        >
                          {item.category.name}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-gray-600">
                      {item.unit ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                          {item.unit.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-5 font-semibold text-gray-900 text-right">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="py-3 px-5">
                        <div className="flex items-center justify-center gap-1">
                          {canUpdate && (
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-[#7C3AED] hover:bg-purple-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              onClick={() => {
                                setItemToDelete(item);
                                setIsConfirmOpen(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
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
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-gray-900">{(currentPage - 1) * limit + 1}</span> hingga{' '}
              <span className="font-medium text-gray-900">{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-gray-900">{total}</span> data
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

      <ItemFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem}
        categories={categories}
        units={units}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        title="Hapus Barang"
        description={`Apakah Anda yakin ingin menghapus barang "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan jika barang belum memiliki histori persediaan.`}
        confirmLabel="Hapus"
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
