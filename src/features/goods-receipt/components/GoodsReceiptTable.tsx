// src/features/goods-receipt/components/GoodsReceiptTable.tsx
'use client';

import { Search, Plus, Archive, ArrowDownLeft } from 'lucide-react';
import { useGoodsReceiptTable } from '../hooks/useGoodsReceiptTable';
import GoodsReceiptFormModal from './GoodsReceiptFormModal';
import { Pagination } from '@/components/ui/Pagination';
import type { GoodsReceiptTableProps } from '../types/goods-receipt.types';

export default function GoodsReceiptTable({ 
  data, 
  total, 
  currentPage, 
  limit, 
  searchQuery, 
  items, 
  suppliers, 
  canCreate 
}: GoodsReceiptTableProps) {
  const {
    isModalOpen,
    openModal,
    closeModal,
    searchInput,
    setSearchInput,
    handleSearch,
    handlePageChange,
  } = useGoodsReceiptTable({ searchQuery });

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
          <form onSubmit={handleSearch} className="w-full sm:w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari transaksi / barang..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
            />
          </form>

          {canCreate && (
            <button 
              type="button"
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium shadow-xs"
            >
              <Plus size={16} />
              <span>Tambah Transaksi</span>
            </button>
          )}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-190">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3.5 px-5">Kode</th>
                <th className="py-3.5 px-5">Tanggal</th>
                <th className="py-3.5 px-5 min-w-50">Barang</th>
                <th className="py-3.5 px-5">Supplier</th>
                <th className="py-3.5 px-5 text-center">Qty Masuk</th>
                <th className="py-3.5 px-5 text-right">Total Nilai</th>
                <th className="py-3.5 px-5">Pencatat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <Archive className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">Belum ada barang masuk</p>
                      <p className="text-slate-400 text-xs mt-0.5">Catatan penerimaan stok barang akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {row.receipt_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-xs whitespace-nowrap">
                      {new Date(row.receipt_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-medium text-slate-900 block leading-tight">
                        {row.item?.name || '-'}
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {row.item?.category?.name || '-'} • {row.item?.unit?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-xs">
                      {row.supplier?.name || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 tabular-nums">
                        <ArrowDownLeft size={12} className="text-emerald-600" />
                        +{row.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900 text-right tabular-nums whitespace-nowrap">
                      Rp {Number(row.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {row.user?.name || '-'}
                      </span>
                    </td>
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
              Menampilkan <span className="font-medium text-slate-900">{(currentPage - 1) * limit + 1}</span> hingga{' '}
              <span className="font-medium text-slate-900">{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-slate-900">{total}</span> data
            </div>
            <Pagination
              page={currentPage}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <GoodsReceiptFormModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        items={items}
        suppliers={suppliers}
      />
    </div>
  );
}
