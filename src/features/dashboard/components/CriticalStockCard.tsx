// src/features/dashboard/components/CriticalStockCard.tsx
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { LowStockItem } from '../services/dashboard.service';

interface CriticalStockCardProps {
  lowStockCount: number;
  lowStockItems: LowStockItem[];
}

export function CriticalStockCard({ lowStockCount, lowStockItems }: CriticalStockCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-1">
          {/* Title tanpa icon sesuai permintaan user */}
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Peringatan Stok Kritis
          </h3>

          {lowStockCount > 0 ? (
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {lowStockCount} Perlu Restock
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-500" />
              Stok Aman
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Daftar suku cadang dengan stok menipis di bawah ambang minimum (&le; 5 unit)
        </p>

        {/* List Barang Menipis */}
        <div className="divide-y divide-slate-100 mt-2">
          {lowStockItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-800">Semua Persediaan Aman</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Tidak ada barang dengan stok menipis di bawah batas minimum saat ini.
              </p>
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.itemCode}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-nowrap">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-rose-600 tabular-nums">
                    {item.stock} {item.unit}
                  </span>
                  <div>
                    <Link
                      href={`/transaksi/barang-masuk?item_id=${item.id}`}
                      className="text-[11px] font-semibold text-slate-900 hover:underline mt-0.5 inline-block"
                    >
                      + Restock
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50 mt-3">
        <Link
          href="/transaksi/persediaan"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
        >
          <span>Kelola Status Persediaan Lengkap</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
