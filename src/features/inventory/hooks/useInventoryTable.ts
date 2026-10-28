// src/features/inventory/hooks/useInventoryTable.ts
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import type { InventoryWithItem, StockStatusInfo } from '../types/inventory.types';

export interface UseInventoryTableOptions {
  data: InventoryWithItem[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
}

export function useInventoryTable({ 
  data, 
  searchQuery, 
  selectedCategory, 
  selectedStatus 
}: UseInventoryTableOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const updateFilters = (updates: { search?: string; category?: string; status?: string; page?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      const trimmed = updates.search.trim();
      if (trimmed) params.set('search', trimmed);
      else params.delete('search');
    }

    if (updates.category !== undefined) {
      if (updates.category) params.set('category', updates.category);
      else params.delete('category');
    }

    if (updates.status !== undefined) {
      if (updates.status) params.set('status', updates.status);
      else params.delete('status');
    }

    params.set('page', updates.page || '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateFilters({ category: categoryId });
  };

  const handleStatusChange = (status: string) => {
    updateFilters({ status });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    const params = new URLSearchParams();
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedStatus);

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }

    const headers = ['Kode Persediaan', 'Kode Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Stok Saat Ini', 'HPP'];
    const csvContent = [
      headers.join(','),
      ...data.map((inv) => [
        inv.inventory_code,
        inv.item?.item_code || '-',
        `"${inv.item?.name?.replace(/"/g, '""') || '-'}"`,
        `"${inv.item?.category?.name || '-'}"`,
        `"${inv.item?.unit?.name || '-'}"`,
        inv.stock,
        inv.hpp,
      ].join(',')),
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
    toast.success('Data persediaan berhasil diekspor!');
  };

  const getStockStatus = (stock: number): StockStatusInfo => {
    if (stock === 0) {
      return {
        level: 'empty',
        label: 'Habis',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
        textClass: 'text-rose-600',
      };
    }
    if (stock < 5) {
      return {
        level: 'low',
        label: 'Menipis',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
        textClass: 'text-amber-600',
      };
    }
    return {
      level: 'safe',
      label: 'Aman',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      textClass: 'text-slate-900',
    };
  };

  return {
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
  };
}
