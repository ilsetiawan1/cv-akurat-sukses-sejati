// src/features/inventory/components/InventoryTable.tsx
'use client';

import { Search, Download, PackageOpen, RotateCcw } from 'lucide-react';
import { useInventoryTable } from '../hooks/useInventoryTable';
import { Pagination } from '@/components/ui/Pagination';
import InventoryStatCards from './InventoryStatCards';
import InventoryMobileCardList from './InventoryMobileCardList';
import type { InventoryTableProps } from '../types/inventory.types';

export default function InventoryTable({ 
  data, 
  total, 
  currentPage, 
  limit, 
  searchQuery, 
  selectedCategory,
  selectedStatus,
  categories,
  stats
}: InventoryTableProps) {
  const {
    searchInput,
    setSearchInput,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleResetFilters,
    handlePageChange,
    hasActiveFilters,
    exportToCSV,
    getStockStatus,
  } = useInventoryTable({ 
    data, 
    searchQuery, 
    selectedCategory, 
    selectedStatus 
  });

  return (
    <div className="w-full space-y-4">
      {/* Quick Stat Summary Cards */}
      <InventoryStatCards
        stats={stats}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Table Toolbar with Filters */}
        <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-56 md:w-52 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
              />
            </form>

            {/* Filter Dropdowns (2 columns on mobile, flex on tablet/desktop) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
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

              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-slate-800 bg-white cursor-pointer truncate"
              >
                <option value="">Semua Status</option>
                <option value="safe">Stok Aman (≥ 5)</option>
                <option value="low">Stok Menipis (&lt; 5)</option>
                <option value="empty">Stok Habis (0)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                title="Reset semua filter"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Export Action */}
          <button 
            type="button"
            onClick={exportToCSV}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Download size={15} className="text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* 1. Mobile View: Card List (< md) */}
        <div className="block md:hidden">
          <InventoryMobileCardList
            data={data}
            hasActiveFilters={hasActiveFilters}
            getStockStatus={getStockStatus}
          />
        </div>

        {/* 2. Desktop View: Full Table (>= md) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-190">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                <th className="py-3.5 px-5">Kode</th>
                <th className="py-3.5 px-5 min-w-50">Nama Barang</th>
                <th className="py-3.5 px-5">Kategori & Satuan</th>
                <th className="py-3.5 px-5 text-right">Nilai HPP</th>
                <th className="py-3.5 px-5 text-center">Stok Tersedia</th>
                <th className="py-3.5 px-5">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                        <PackageOpen className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm">Tidak ada barang yang cocok</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {hasActiveFilters 
                          ? 'Coba sesuaikan kata kunci pencarian atau filter kategori/status.' 
                          : 'Catatan persediaan akan muncul setelah ada transaksi barang masuk.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((inv) => {
                  const stockStatus = getStockStatus(inv.stock);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {inv.item?.item_code || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-800 block leading-tight max-w-64 truncate">
                          {inv.item?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs text-slate-600 block">
                          {inv.item?.category?.name || '-'}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Satuan: {inv.item?.unit?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-800 text-right tabular-nums whitespace-nowrap">
                        Rp {Number(inv.hpp).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`text-sm font-medium tabular-nums ${stockStatus.textClass}`}>
                          {inv.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockStatus.badgeClass}`}>
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
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-slate-800 tabular-nums">{(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, total)}</span> dari{' '}
              <span className="font-medium text-slate-800 tabular-nums">{total}</span> data
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
    </div>
  );
}
