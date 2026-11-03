// src/features/dashboard/components/CriticalStockCard.tsx
import Link from 'next/link';
import { CheckCircle2, ArrowRight, AlertTriangle, Plus } from 'lucide-react';
import type { LowStockItem } from '../services/dashboard.service';

interface CriticalStockCardProps {
  lowStockCount: number;
  lowStockItems: LowStockItem[];
}

export function CriticalStockCard({ lowStockCount, lowStockItems }: CriticalStockCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 lg:p-6 flex flex-col justify-between hover:border-slate-300/80 transition-colors">
      <div>
        {/* Card Header (Clean & Minimalist Status) */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm lg:text-base font-semibold text-slate-900 tracking-tight">
            Peringatan Stok Kritis
          </h3>

          {lowStockCount > 0 ? (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md">
              {lowStockCount} barang menipis
            </span>
          ) : (
            <span className="text-xs font-normal text-slate-500">
              Semua stok aman
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 mb-3.5">
          Daftar suku cadang dengan stok menipis di bawah ambang batas (≤ 5 unit)
        </p>

        {/* List Barang Menipis */}
        <div className="mt-1">
          {lowStockItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={20} className="text-emerald-500 stroke-[2]" />
              </div>
              <p className="text-xs lg:text-sm font-medium text-slate-800">Semua Persediaan Aman</p>
              <p className="text-2xs lg:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Tidak ada barang dengan stok di bawah batas minimum saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {lowStockItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 border border-slate-100/70"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
                      <AlertTriangle size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-2xs font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                          {item.itemCode}
                        </span>
                        <span className="text-2xs text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/70 px-2 py-0.5 rounded-md tabular-nums">
                      {item.stock} {item.unit}
                    </span>
                    <Link
                      href={`/transaksi/barang-masuk?item_id=${item.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg shadow-2xs transition-colors shrink-0"
                    >
                      <Plus size={12} className="text-slate-500" />
                      <span>Restock</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3.5 mt-2">
        <Link
          href="/transaksi/persediaan"
          className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 border border-slate-200/70 text-xs font-medium text-slate-700 transition-colors group shadow-2xs"
        >
          <span>Kelola Status Persediaan Lengkap</span>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
