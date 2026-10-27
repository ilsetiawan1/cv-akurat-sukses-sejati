// src/features/goods-receipt/hooks/useGoodsReceiptForm.ts
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { addGoodsReceiptAction } from '@/features/goods-receipt/actions/goods-receipt.actions';
import type { GoodsReceiptFormData, ReceiptModalItem } from '../types/goods-receipt.types';
import type { Supplier } from '@/types';

export interface UseGoodsReceiptFormOptions {
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  onClose: () => void;
}

const INITIAL_FORM_DATA: GoodsReceiptFormData = {
  item_id: '',
  supplier_id: '',
  quantity: '',
  harga_satuan: '',
  receipt_date: new Date().toISOString().split('T')[0],
};

export function useGoodsReceiptForm({ items, onClose }: UseGoodsReceiptFormOptions) {
  const [formData, setFormData] = useState<GoodsReceiptFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = items.find((item) => item.id === formData.item_id);
  const quantityNum = Number(formData.quantity) || 0;
  const unitPriceNum = Number(formData.harga_satuan) || 0;
  const totalPrice = quantityNum * unitPriceNum;
  const currentStock = selectedItem?.current_stock ?? 0;
  const estimatedNewStock = currentStock + quantityNum;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      receipt_date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_id || !formData.supplier_id || !formData.quantity || !formData.harga_satuan) {
      toast.error('Harap lengkapi semua data barang, supplier, kuantitas, dan harga satuan!');
      return;
    }

    if (quantityNum <= 0) {
      toast.error('Kuantitas barang masuk harus lebih dari 0!');
      return;
    }

    if (unitPriceNum < 0) {
      toast.error('Harga satuan tidak boleh bernilai negatif!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        item_id: formData.item_id,
        supplier_id: formData.supplier_id,
        quantity: quantityNum,
        harga_satuan: unitPriceNum,
        receipt_date: formData.receipt_date,
      };

      const result = await addGoodsReceiptAction(payload);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Barang masuk berhasil dicatat & HPP terupdate!');
        resetForm();
        onClose();
      }
    } catch {
      toast.error('Gagal memproses transaksi barang masuk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    selectedItem,
    totalPrice,
    currentStock,
    estimatedNewStock,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
