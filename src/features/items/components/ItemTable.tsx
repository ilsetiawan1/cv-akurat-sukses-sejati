// src/features/items/components/ItemTable.tsx
'use client';

import { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Download, PackageOpen, Filter } from 'lucide-react';
import type { ItemWithRelations, Category, Unit } from '@/features/items/types/item.types';
import ItemFormModal from './ItemFormModal';
import ItemMobileCardList from './ItemMobileCardList';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { deleteItemAction } from '@/features/items/actions/item.actions';
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

  const handleDeletePrompt = (item: ItemWithRelations) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
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
      toast.error('Tidak ada data barang untuk diekspor');
      return;
    }
    
    const headers = ['Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Harga Jual'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.item_code,
        `"${item.name.replaceAll('"', '""')}"`,
        `"${(item.category?.name || '-').replaceAll('"', '""')}"`,
        `"${(item.unit?.name || '-').replaceAll('"', '""')}"`,
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
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Header Action Bar */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-100">
          {/* Sisi Kiri: Search Input */}
          <form onSubmit={handleSearch} className="w-full md:max-w-xs lg:max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari kode atau nama barang..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400"
            />
          </form>

          {/* Sisi Kanan: Kategori Filter & Tombol Aksi */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-44">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={categoryQuery}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all bg-white cursor-pointer text-slate-700"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="button"
              onClick={exportToCSV}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
              title="Ekspor CSV"
            >
              <Download size={14} className="text-slate-500" />
              <span>CSV</span>
            </button>

            {canCreate && (
              <button 
                type="button"
                onClick={() => {
                  setSelectedItem(null);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
              >
                <Plus size={15} />
                <span>Tambah Barang</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden">
          <ItemMobileCardList
            data={data}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDeletePrompt}
            onCategoryFilter={handleCategoryFilter}
          />
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 text-slate-800 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Suku Cadang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4 text-right">Harga Jual</th>
                {(canUpdate || canDelete) && (
                  <th className="py-3 px-4 text-center w-24">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={canUpdate || canDelete ? 6 : 5} className="py-12 px-4 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <PackageOpen className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm">Tidak ada data barang</p>
                      <p className="text-slate-400 text-xs mt-0.5">Coba sesuaikan filter atau tambahkan barang baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200/60">
                        {item.item_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.category ? (
                        <button 
                          type="button"
                          onClick={() => handleCategoryFilter(item.category!.id)}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 hover:bg-slate-200/60 transition-colors cursor-pointer"
                        >
                          {item.category.name}
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.unit ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200/60">
                          {item.unit.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium tabular-nums text-slate-900 text-right">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {canUpdate && (
                            <button 
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50/80 rounded-lg transition-colors cursor-pointer"
                              title="Edit barang"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              type="button"
                              onClick={() => handleDeletePrompt(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors cursor-pointer"
                              title="Hapus barang"
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
          <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-slate-800">{(currentPage - 1) * limit + 1}</span> -{' '}
              <span className="font-medium text-slate-800">{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-slate-800">{total}</span> data
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
