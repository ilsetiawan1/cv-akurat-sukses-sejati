// src/features/goods-receipt/hooks/useGoodsReceiptTable.ts
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteGoodsReceiptAction } from '../actions/goods-receipt.actions';
import type { GoodsReceiptWithRelations } from '../types/goods-receipt.types';

export interface UseGoodsReceiptTableOptions {
  data: GoodsReceiptWithRelations[];
  searchQuery: string;
  selectedCategory?: string;
  selectedMonth?: string;
  canCreate?: boolean;
  initialItemId?: string;
}

export function useGoodsReceiptTable({ 
  data,
  searchQuery, 
  selectedCategory = '',
  selectedMonth = '',
  canCreate = true,
  initialItemId 
}: UseGoodsReceiptTableOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlItemId = searchParams.get('item_id') || initialItemId;

  const [manualOpen, setManualOpen] = useState(false);
  const [manualItemId, setManualItemId] = useState<string | undefined>(undefined);
  const [dismissedUrlItemId, setDismissedUrlItemId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceiptWithRelations | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Modal create is open if triggered via query param (and not dismissed) or opened manually
  const isUrlActive = Boolean(urlItemId && canCreate && dismissedUrlItemId !== urlItemId);
  const isModalOpen = isUrlActive || manualOpen;
  const activeItemId = isUrlActive ? urlItemId : manualItemId;

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset ke page 1 jika filter berubah (kecuali perpindahan page itu sendiri)
    if (!('page' in newParams)) {
      params.set('page', '1');
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const openModal = (itemId?: string) => {
    setManualItemId(itemId);
    setManualOpen(true);
  };

  const closeModal = () => {
    setManualOpen(false);
    setManualItemId(undefined);
    if (urlItemId) {
      setDismissedUrlItemId(urlItemId);
    }

    // Clean up item_id from URL query without reloading the page
    if (searchParams.has('item_id')) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('item_id');
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || undefined });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category || undefined });
  };

  const handleMonthChange = (month: string) => {
    updateFilters({ month: month || undefined });
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

  const openDetail = (receipt: GoodsReceiptWithRelations) => {
    setSelectedReceipt(receipt);
  };

  const closeDetail = () => {
    setSelectedReceipt(null);
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    const result = await deleteGoodsReceiptAction(receiptId);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success('Transaksi barang masuk berhasil dibatalkan dan stok dikembalikan!');
      setSelectedReceipt(null);
    }
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedMonth);

  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data barang masuk untuk diexport');
      return;
    }

    const headers = [
      'Kode Transaksi',
      'Tanggal Penerimaan',
      'Kode Barang',
      'Nama Barang',
      'Kategori',
      'Satuan',
      'Supplier',
      'Qty Masuk',
      'Total Nilai (Rp)',
      'Pencatat',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((row) => [
        row.receipt_code,
        row.receipt_date,
        row.item?.item_code || '-',
        `"${row.item?.name?.replace(/"/g, '""') || '-'}"`,
        `"${row.item?.category?.name || '-'}"`,
        `"${row.item?.unit?.name || '-'}"`,
        `"${row.supplier?.name?.replace(/"/g, '""') || '-'}"`,
        row.quantity,
        row.total_price,
        `"${row.user?.name?.replace(/"/g, '""') || '-'}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const monthTag = selectedMonth ? `_${selectedMonth}` : '';
    link.setAttribute('download', `barang_masuk${monthTag}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data barang masuk berhasil diekspor!');
  };

  return {
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
  };
}
