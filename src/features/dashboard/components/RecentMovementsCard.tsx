// src/features/dashboard/components/RecentMovementsCard.tsx
import Link from 'next/link';
import { Clock, ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { RecentMovement } from '../services/dashboard.service';

interface RecentMovementsCardProps {
  movements: RecentMovement[];
}

export function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 lg:p-6 flex flex-col justify-between hover:border-slate-300/80 transition-colors">
      <div>
        {/* Card Header (Clean & Bebas Badge Soup) */}
        <div>
          <h3 className="text-sm lg:text-base font-semibold text-slate-900 tracking-tight">
            Aktivitas Mutasi Terkini
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-3.5">
            5 transaksi barang masuk dan keluar terakhir di sistem
          </p>
        </div>

        {/* List Transaksi */}
        <div className="mt-1">
          {movements.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Clock size={28} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="font-medium text-slate-700 text-xs lg:text-sm">Belum ada aktivitas operasional</p>
              <p className="text-2xs lg:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Pergerakan barang masuk & keluar akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {movements.map((mov) => {
                const isEntry = mov.type === 'IN';
                return (
                  <div 
                    key={mov.id} 
                    className="p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 border border-slate-100/70"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isEntry 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' 
                          : 'bg-rose-50 text-rose-600 border-rose-200/60'
                      }`}>
                        {isEntry ? (
                          <ArrowDownLeft size={16} className="text-emerald-600" />
                        ) : (
                          <ArrowUpRight size={16} className="text-rose-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                          {mov.itemName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-2xs font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                            {mov.code}
                          </span>
                          <span className="text-2xs text-slate-400">
                            • {isEntry ? 'Barang Masuk' : 'Barang Keluar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-medium tabular-nums px-2 py-0.5 rounded-md border ${
                          isEntry 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                            : 'text-rose-700 bg-rose-50 border-rose-200/60'
                        }`}
                      >
                        {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                      </span>
                      <p className="text-2xs text-slate-400 whitespace-nowrap mt-0.5 tabular-nums">
                        {mov.date
                          ? new Date(mov.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3.5 mt-2">
        <Link
          href="/laporan"
          className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 border border-slate-200/70 text-xs font-medium text-slate-700 transition-colors group shadow-2xs"
        >
          <span>Buka Seluruh Laporan Mutasi</span>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
