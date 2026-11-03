// src/features/suppliers/components/SupplierMobileCardList.tsx
'use client';

import { Edit2, Trash2, Phone, Mail, MapPin, UserCheck, Archive } from 'lucide-react';
import type { Supplier } from '../types/supplier.types';

export interface SupplierMobileCardListProps {
  data: Supplier[];
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

function getInitials(name: string) {
  return name.substring(0, 2).toUpperCase();
}

export default function SupplierMobileCardList({
  data,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: SupplierMobileCardListProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <Archive className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Tidak ada data supplier</p>
          <p className="text-slate-400 text-xs mt-0.5">Daftar mitra supplier akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {data.map((item) => (
        <div key={item.id} className="p-4 space-y-3">
          {/* Baris 1: Avatar, Nama Supplier & Kode */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1E3A8A] border border-slate-200/80 flex items-center justify-center font-medium text-xs shrink-0 select-none overflow-hidden">
                {item.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(item.name)}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {item.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-2xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                    {item.supplier_code}
                  </span>
                  {item.contact_name && (
                    <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
                      • <UserCheck size={11} className="text-slate-400" /> {item.contact_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Aksi Cepat Mobile */}
            {(canUpdate || canDelete) && (
              <div className="flex items-center gap-1 shrink-0">
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit supplier"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus supplier"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Baris 2: Kontak & Telepon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            {item.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700 tabular-nums">{item.phone}</span>
              </div>
            )}
            {item.email && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail size={12} className="text-slate-400 shrink-0" />
                <span className="truncate text-slate-600">{item.email}</span>
              </div>
            )}
            {item.address && (
              <div className="flex items-start gap-1.5 col-span-full mt-0.5">
                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 text-2xs leading-relaxed">{item.address}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

