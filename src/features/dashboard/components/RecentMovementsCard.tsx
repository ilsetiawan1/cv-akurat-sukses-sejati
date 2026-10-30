// src/features/dashboard/components/RecentMovementsCard.tsx
import Link from 'next/link';
import { Clock, ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { RecentMovement } from '../services/dashboard.service';

interface RecentMovementsCardProps {
  movements: RecentMovement[];
}

export function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 lg:p-6 flex flex-col justify-between hover:border-slate-300/80 transition-all">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm lg:text-base font-bold text-slate-900 tracking-tight">
            Aktivitas Mutasi Terkini
          </h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] lg:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Real-time</span>
          </span>
        </div>
        <p className="text-xs lg:text-sm text-slate-400 mb-3.5">
          5 transaksi barang masuk dan keluar terakhir di sistem
        </p>

        {/* List Transaksi */}
        <div className="mt-1">
          {movements.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Clock size={28} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="font-semibold text-slate-700 text-xs lg:text-sm">Belum ada aktivitas operasional</p>
              <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5 leading-relaxed">
                Pergerakan barang masuk & keluar akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {movements.map((mov) => {
                const isEntry = mov.type === 'IN';
                return (
                  <div 
                    key={mov.id} 
                    className="p-2.5 lg:p-3 rounded-xl hover:bg-slate-50/90 transition-all flex items-center justify-between gap-3 border border-transparent hover:border-slate-100 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 lg:w-9.5 lg:h-9.5 rounded-xl flex items-center justify-center shrink-0 border ${
                        isEntry 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200/70' 
                          : 'bg-slate-100 text-slate-600 border-slate-200/70'
                      }`}>
                        {isEntry ? (
                          <ArrowDownLeft size={17} className="text-emerald-600" />
                        ) : (
                          <ArrowUpRight size={17} className="text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs lg:text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900">
                          {mov.itemName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] lg:text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                            {mov.code}
                          </span>
                          <span className="text-[10px] lg:text-xs text-slate-400">
                            • {isEntry ? 'Barang Masuk' : 'Barang Keluar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs lg:text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-md border ${
                          isEntry 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                            : 'text-slate-700 bg-slate-100 border-slate-200/60'
                        }`}
                      >
                        {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                      </span>
                      <p className="text-[10px] lg:text-xs text-slate-400 whitespace-nowrap mt-1 tabular-nums">
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
          className="inline-flex items-center justify-between w-full py-2.5 lg:py-3 px-3.5 lg:px-4 rounded-xl bg-slate-50/70 hover:bg-blue-50/70 hover:text-blue-700 hover:border-blue-200/60 border border-slate-200/70 text-xs lg:text-sm font-semibold text-slate-700 transition-all group shadow-2xs"
        >
          <span>Buka Seluruh Laporan Mutasi</span>
          <ArrowRight size={15} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
