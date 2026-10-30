// src/features/goods-receipt/components/GoodsReceiptTable.tsx
'use client';

import { Search, Plus, Archive, ArrowDownLeft, Download, RotateCcw, Eye } from 'lucide-react';
import { useGoodsReceiptTable } from '../hooks/useGoodsReceiptTable';
import GoodsReceiptFormModal from './GoodsReceiptFormModal';
import ReceiptDetailModal from './ReceiptDetailModal';
import ReceiptStatCards from './ReceiptStatCards';
import ReceiptMobileCardList from './ReceiptMobileCardList';
import { Pagination } from '@/components/ui/Pagination';
import type { GoodsReceiptTableProps } from '../types/goods-receipt.types';

export default function GoodsReceiptTable({ 
  data, 
  total, 
  currentPage, 
  limit, 
  searchQuery, 
  selectedCategory,
  selectedMonth,
  categories,
  monthOptions,
  stats,
  items, 
  suppliers, 
  canCreate,
  canDelete = false,
  initialItemId 
}: GoodsReceiptTableProps) {
  const {
    isModalOpen,
    activeItemId,
    selectedReceipt,
    openModal,
    closeModal,
    openDetail,
    closeDetail,
    handleDeleteReceipt,
    searchInput,
    setSearchInput,
    handleSearch,
    handleCategoryChange,
    handleMonthChange,
    handleResetFilters,
    hasActiveFilters,
    exportToCSV,
    handlePageChange,
  } = useGoodsReceiptTable({ 
    data,
    searchQuery, 
    selectedCategory,
    selectedMonth,
    canCreate, 
    initialItemId 
  });

  return (
    <div className="w-full space-y-4">
      {/* Quick Stat Summary Cards */}
      <ReceiptStatCards stats={stats} />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Table Toolbar with Search, Filters, and Actions */}
        <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-56 md:w-52 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari transaksi / barang..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
              />
            </form>

            {/* Filter Dropdowns (2 columns on mobile, flex on desktop) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-800 bg-white cursor-pointer truncate"
              >
                <option value="">Semua Periode</option>
                {monthOptions.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-800 bg-white cursor-pointer truncate"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                title="Reset semua filter"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Actions: Export CSV & Tambah Transaksi (2 columns on mobile, flex on desktop) */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <button 
              type="button"
              onClick={exportToCSV}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Download size={15} className="text-slate-500" />
              <span>Export CSV</span>
            </button>

            {canCreate && (
              <button 
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-all text-xs sm:text-sm font-medium shadow-xs cursor-pointer active:scale-[0.99] shrink-0 whitespace-nowrap"
              >
                <Plus size={15} />
                <span>+ Transaksi</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Mobile View: Card List (< md) */}
        <div className="block md:hidden">
          <ReceiptMobileCardList 
            data={data} 
            onSelectReceipt={openDetail} 
          />
        </div>

        {/* 2. Desktop View: Responsive Table (>= md) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-190">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 text-xs font-medium border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3.5 px-5">Kode</th>
                <th className="py-3.5 px-5">Tanggal</th>
                <th className="py-3.5 px-5 min-w-50">Barang</th>
                <th className="py-3.5 px-5">Supplier</th>
                <th className="py-3.5 px-5 text-center">Qty Masuk</th>
                <th className="py-3.5 px-5 text-right">Total Nilai</th>
                <th className="py-3.5 px-5">Pencatat</th>
                <th className="py-3.5 px-5 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <Archive className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm">Belum ada barang masuk</p>
                      <p className="text-slate-400 text-xs mt-0.5">Catatan penerimaan stok barang akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => openDetail(row)}
                    className="hover:bg-slate-50/75 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 group-hover:border-slate-300">
                        {row.receipt_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 text-xs whitespace-nowrap">
                      {new Date(row.receipt_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-medium text-slate-800 block leading-tight group-hover:text-blue-900">
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
                      <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 tabular-nums">
                        <ArrowDownLeft size={12} className="text-emerald-600" />
                        +{row.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-800 text-right tabular-nums whitespace-nowrap">
                      Rp {Number(row.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {row.user?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openDetail(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Lihat detail transaksi"
                      >
                        <Eye size={15} />
                      </button>
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
              Menampilkan <span className="font-medium text-slate-800">{(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-slate-800">{total}</span> data
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

      {/* Form Modal Tambah Transaksi */}
      {isModalOpen && (
        <GoodsReceiptFormModal 
          key={activeItemId || 'new-receipt'}
          isOpen={isModalOpen} 
          onClose={closeModal}
          items={items}
          suppliers={suppliers}
          initialItemId={activeItemId}
        />
      )}

      {/* Detail Modal Transaksi */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        isOpen={Boolean(selectedReceipt)}
        onClose={closeDetail}
        onDelete={handleDeleteReceipt}
        canDelete={canDelete}
      />
    </div>
  );
}
