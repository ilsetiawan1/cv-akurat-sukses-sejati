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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 lg:p-6 flex flex-col justify-between hover:border-slate-300/80 transition-all">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm lg:text-base font-bold text-slate-900 tracking-tight">
            Peringatan Stok Kritis
          </h3>

          {lowStockCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] lg:text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs ring-1 ring-rose-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{lowStockCount} Perlu Restock</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] lg:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Semua Stok Aman</span>
            </span>
          )}
        </div>
        <p className="text-xs lg:text-sm text-slate-400 mb-3.5">
          Daftar suku cadang dengan stok menipis di bawah ambang batas (≤ 5 unit)
        </p>

        {/* List Barang Menipis */}
        <div className="mt-1">
          {lowStockItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 size={24} className="text-emerald-500 stroke-[2]" />
              </div>
              <p className="text-xs lg:text-sm font-bold text-slate-800">Semua Persediaan Aman</p>
              <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Tidak ada barang dengan stok di bawah batas minimum saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-2.5 lg:p-3 rounded-xl hover:bg-rose-50/40 transition-all flex items-center justify-between gap-3 border border-transparent hover:border-rose-100 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 lg:w-9.5 lg:h-9.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center shrink-0">
                      <AlertTriangle size={17} className="text-amber-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] lg:text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {item.itemCode}
                        </span>
                        <span className="text-[10px] lg:text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/50">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs lg:text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg tabular-nums">
                      {item.stock} {item.unit}
                    </span>
                    <Link
                      href={`/transaksi/barang-masuk?item_id=${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-xs font-medium rounded-xl shadow-2xs transition-all shrink-0"
                    >
                      <Plus size={13} className="text-emerald-700" />
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
          className="inline-flex items-center justify-between w-full py-2.5 lg:py-3 px-3.5 lg:px-4 rounded-xl bg-slate-50/70 hover:bg-blue-50/70 hover:text-blue-700 hover:border-blue-200/60 border border-slate-200/70 text-xs lg:text-sm font-semibold text-slate-700 transition-all group shadow-2xs"
        >
          <span>Kelola Status Persediaan Lengkap</span>
          <ArrowRight size={15} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
