// components/transaksi/InventoryTable.tsx
'use client';

import { useState } from 'react';
import { Search, Download, PackageOpen } from 'lucide-react';
import type { InventoryWithItem } from '@/types/inventory.types';
import { Pagination } from '../ui/Pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface InventoryTableProps {
  data: InventoryWithItem[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
}

export default function InventoryTable({ 
  data, total, currentPage, limit, searchQuery 
}: InventoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchInput);
  };

  const updateFilters = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set('search', search);
    else params.delete('search');
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }
    
    const headers = ['Kode Persediaan', 'Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Stok Saat Ini', 'HPP'];
    const csvContent = [
      headers.join(','),
      ...data.map(inv => [
        inv.inventory_code,
        inv.item?.item_code || '-',
        `"${inv.item?.name?.replace(/"/g, '""') || '-'}"`,
        `"${inv.item?.category?.name || '-'}"`,
        `"${inv.item?.unit?.name || '-'}"`,
        inv.stock,
        inv.hpp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_persediaan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Action Bar */}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="w-full sm:w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
            />
          </form>

          <button 
            onClick={exportToCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Download size={16} className="text-gray-500" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-[#8E95A9] text-xs font-semibold border-b border-gray-100 uppercase tracking-wider">
                <th className="py-4 px-5">Kode Barang</th>
                <th className="py-4 px-5 min-w-[200px]">Nama Barang</th>
                <th className="py-4 px-5">Kategori / Satuan</th>
                <th className="py-4 px-5 text-right">HPP</th>
                <th className="py-4 px-5 text-center">Stok Tersedia</th>
                <th className="py-4 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <PackageOpen className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-900">Belum ada pergerakan stok</p>
                      <p className="text-gray-400 text-xs mt-1">Data persediaan akan muncul setelah ada input barang masuk.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((inv) => {
                  const stockStatus = inv.stock === 0 
                    ? { label: 'Habis', color: 'bg-red-50 text-red-600 border-red-100' }
                    : inv.stock < 5 
                      ? { label: 'Menipis', color: 'bg-orange-50 text-orange-600 border-orange-100' }
                      : { label: 'Aman', color: 'bg-green-50 text-green-700 border-green-100' };

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-mono text-xs">
                          {inv.item?.item_code || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-gray-900 truncate max-w-[250px]">
                        {inv.item?.name || '-'}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 truncate max-w-[100px]">
                            {inv.item?.category?.name || '-'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-600">
                            {inv.item?.unit?.name || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-medium text-gray-900 text-right">
                        Rp {Number(inv.hpp).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`text-sm font-bold ${inv.stock === 0 ? 'text-red-500' : inv.stock < 5 ? 'text-orange-500' : 'text-gray-900'}`}>
                          {inv.stock}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
}
