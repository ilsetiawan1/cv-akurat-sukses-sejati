// components/transaksi/GoodsIssueTable.tsx
'use client';

import { useState } from 'react';
import { Search, Plus, ExternalLink } from 'lucide-react';
import type { GoodsIssueWithRelations } from '@/types/transaction.types';
import GoodsIssueFormModal, { type IssueModalItem } from './GoodsIssueFormModal';
import { Pagination } from '../ui/Pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props {
  data: GoodsIssueWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  items: IssueModalItem[];
  canCreate: boolean;
}

export default function GoodsIssueTable({ 
  data, total, currentPage, limit, searchQuery, items, canCreate 
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set('search', searchInput);
    else params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="w-full sm:w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama barang keluar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all"
            />
          </form>

          <div className="flex w-full sm:w-auto gap-3">
            {canCreate && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] transition-colors text-sm font-medium shadow-sm shadow-purple-200"
              >
                <Plus size={16} />
                <span>Keluarkan Barang</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-[#8E95A9] text-xs font-semibold border-b border-gray-100 uppercase tracking-wider">
                <th className="py-4 px-5">Kode Transaksi</th>
                <th className="py-4 px-5">Tanggal</th>
                <th className="py-4 px-5 min-w-[200px]">Barang</th>
                <th className="py-4 px-5 text-center">Qty Keluar</th>
                <th className="py-4 px-5 text-right">Total HPP</th>
                <th className="py-4 px-5">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <ExternalLink className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-900">Belum ada barang keluar</p>
                      <p className="text-gray-400 text-xs mt-1">Data pengeluaran stok akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                        {row.issue_code}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-600">
                      {new Date(row.issue_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-900">
                      {row.item?.name || '-'}
                      <div className="text-xs text-gray-500 font-normal mt-0.5">
                        {row.item?.category?.name || '-'} • {row.item?.unit?.name || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-red-500">
                      -{row.quantity}
                    </td>
                    <td className="py-4 px-5 font-medium text-gray-900 text-right">
                      Rp {Number(row.total_hpp).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {row.user?.name || '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', p.toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
            />
          </div>
        )}
      </div>

      <GoodsIssueFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        items={items}
      />
    </div>
  );
}
