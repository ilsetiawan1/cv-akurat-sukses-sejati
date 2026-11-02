// src/features/goods-issue/hooks/useGoodsIssueTable.ts
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteGoodsIssueAction } from '../actions/goods-issue.actions';
import type { GoodsIssueWithRelations } from '../types/goods-issue.types';

export interface UseGoodsIssueTableOptions {
  data: GoodsIssueWithRelations[];
  searchQuery: string;
  selectedCategory?: string;
  selectedMonth?: string;
}

export function useGoodsIssueTable({ 
  data,
  searchQuery, 
  selectedCategory = '',
  selectedMonth = '',
}: UseGoodsIssueTableOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GoodsIssueWithRelations | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (!('page' in newParams)) {
      params.set('page', '1');
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || undefined });
  };

  const handleCategoryChange = (catId: string) => {
    updateFilters({ category: catId || undefined });
  };

  const handleMonthChange = (monthKey: string) => {
    updateFilters({ month: monthKey || undefined });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedMonth);

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
  };

  const openDetail = (issue: GoodsIssueWithRelations) => {
    setSelectedIssue(issue);
  };

  const closeDetail = () => {
    setSelectedIssue(null);
  };

  const handleDeleteIssue = async (issueId: string) => {
    const res = await deleteGoodsIssueAction(issueId);
    if (!res.success) {
      toast.error(res.error || 'Gagal membatalkan transaksi');
      throw new Error(res.error);
    }
    toast.success('Transaksi pengeluaran berhasil dibatalkan dan stok dikembalikan');
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data transaksi untuk diekspor');
      return;
    }

    const headers = [
      'Kode Transaksi',
      'Tanggal',
      'Nama Barang',
      'Kategori',
      'Satuan',
      'Qty Keluar',
      'Total Beban HPP',
      'Pencatat'
    ];

    const rows = data.map((item) => [
      `"${item.issue_code}"`,
      `"${new Date(item.issue_date).toLocaleDateString('id-ID')}"`,
      `"${item.item?.name?.replace(/"/g, '""') || '-'}"`,
      `"${item.item?.category?.name?.replace(/"/g, '""') || '-'}"`,
      `"${item.item?.unit?.name?.replace(/"/g, '""') || '-'}"`,
      item.quantity,
      item.total_hpp,
      `"${item.user?.name?.replace(/"/g, '""') || '-'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const periodTag = selectedMonth ? `_${selectedMonth}` : '';
    const dateTag = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `barang_keluar${periodTag}_${dateTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data transaksi berhasil diekspor ke CSV');
  };

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    selectedIssue,
    openDetail,
    closeDetail,
    handleDeleteIssue,
    searchInput,
    setSearchInput,
    handleSearch,
    handleCategoryChange,
    handleMonthChange,
    handleResetFilters,
    hasActiveFilters,
    exportToCSV,
    handlePageChange,
  };
}
