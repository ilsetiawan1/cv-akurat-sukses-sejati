// src/features/goods-issue/hooks/useGoodsIssueForm.ts
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { addGoodsIssueAction } from '@/features/goods-issue/actions/goods-issue.actions';
import type { GoodsIssueFormData, IssueModalItem } from '../types/goods-issue.types';

export interface UseGoodsIssueFormOptions {
  items: IssueModalItem[];
  onClose: () => void;
}

const INITIAL_FORM_DATA: GoodsIssueFormData = {
  item_id: '',
  quantity: '',
  issue_date: new Date().toISOString().split('T')[0],
};

export function useGoodsIssueForm({ items, onClose }: UseGoodsIssueFormOptions) {
  const [formData, setFormData] = useState<GoodsIssueFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = items.find((item) => item.id === formData.item_id);
  const quantityNum = Number(formData.quantity) || 0;
  const currentStock = selectedItem?.current_stock ?? 0;
  const currentHpp = Number(selectedItem?.current_hpp) || 0;
  const totalHpp = quantityNum * currentHpp;
  const isQuantityExceeds = Boolean(selectedItem && quantityNum > currentStock);
  const remainingStock = Math.max(0, currentStock - quantityNum);
  const isFormValid = Boolean(formData.item_id && quantityNum > 0 && !isQuantityExceeds);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      issue_date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_id || quantityNum <= 0) {
      toast.error('Harap pilih barang dan masukkan kuantitas keluar!');
      return;
    }

    if (isQuantityExceeds) {
      toast.error(`Kuantitas keluar (${quantityNum}) melebihi sisa stok gudang (${currentStock})!`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        item_id: formData.item_id,
        quantity: quantityNum,
        issue_date: formData.issue_date,
      };

      const result = await addGoodsIssueAction(payload);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Barang keluar berhasil dicatat & stok berkurang!');
        resetForm();
        onClose();
      }
    } catch {
      toast.error('Gagal memproses transaksi barang keluar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    selectedItem,
    quantityNum,
    currentStock,
    currentHpp,
    totalHpp,
    isQuantityExceeds,
    remainingStock,
    isFormValid,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
