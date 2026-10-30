// src/features/goods-receipt/hooks/useGoodsReceiptForm.ts
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { addGoodsReceiptAction } from '@/features/goods-receipt/actions/goods-receipt.actions';
import type { 
  GoodsReceiptFormData, 
  ReceiptModalItem,
  UseGoodsReceiptFormReturn 
} from '../types/goods-receipt.types';
import type { Supplier } from '@/types';

export interface UseGoodsReceiptFormOptions {
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  initialItemId?: string;
  onClose: () => void;
}

const INITIAL_FORM_DATA: GoodsReceiptFormData = {
  item_id: '',
  supplier_id: '',
  quantity: '',
  harga_satuan: '',
  receipt_date: new Date().toISOString().split('T')[0],
};

export function useGoodsReceiptForm({ 
  items, 
  initialItemId,
  onClose 
}: UseGoodsReceiptFormOptions): UseGoodsReceiptFormReturn {
  const initialItem = initialItemId 
    ? items.find((item) => item.id === initialItemId || item.inventory_id === initialItemId) 
    : undefined;

  const resolvedItemId = initialItem ? initialItem.id : (initialItemId || '');

  const [formData, setFormData] = useState<GoodsReceiptFormData>(() => ({
    ...INITIAL_FORM_DATA,
    item_id: resolvedItemId,
    supplier_id: initialItem?.last_supplier_id || '',
    harga_satuan: initialItem?.last_purchase_price ? String(initialItem.last_purchase_price) : '',
    receipt_date: new Date().toISOString().split('T')[0],
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = items.find((item) => item.id === formData.item_id);
  const quantityNum = Number(formData.quantity) || 0;
  const unitPriceNum = Number(formData.harga_satuan) || 0;
  const totalPrice = quantityNum * unitPriceNum;
  const currentStock = selectedItem?.current_stock ?? 0;
  const estimatedNewStock = currentStock + quantityNum;

  // Reactive validation contract matching useGoodsIssueForm standard
  const isFormValid = Boolean(
    formData.item_id && 
    formData.supplier_id && 
    quantityNum > 0 && 
    unitPriceNum >= 0 &&
    Boolean(formData.receipt_date)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'item_id') {
      const selected = items.find((item) => item.id === value);
      setFormData((prev) => ({
        ...prev,
        item_id: value,
        supplier_id: selected?.last_supplier_id || prev.supplier_id,
        harga_satuan: selected?.last_purchase_price ? String(selected.last_purchase_price) : prev.harga_satuan,
      }));
      return;
    }
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

    if (!isFormValid) {
      toast.error('Harap lengkapi semua data barang, supplier, kuantitas, dan harga satuan!');
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
    quantityNum,
    unitPriceNum,
    totalPrice,
    currentStock,
    estimatedNewStock,
    isFormValid,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
