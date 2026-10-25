// src/features/dashboard/components/RecentMovementsCard.tsx
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { RecentMovement } from '../services/dashboard.service';

interface RecentMovementsCardProps {
  movements: RecentMovement[];
}

export function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Aktivitas Mutasi Terkini
          </h3>
          <span className="text-[10px] font-medium text-slate-400">Real-time</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          5 transaksi barang masuk dan keluar terakhir di sistem
        </p>

        {/* List Transaksi Langsung Tanpa Search Bar */}
        <div className="mt-2">
          {movements.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <Clock size={28} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="font-semibold text-slate-700 text-xs">Belum ada aktivitas operasional</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Pergerakan barang masuk & keluar akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {movements.map((mov) => {
                const isEntry = mov.type === 'IN';
                return (
                  <div key={mov.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isEntry ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {mov.itemName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {mov.code} • {isEntry ? 'Barang Masuk' : 'Barang Keluar'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          isEntry ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                      </span>
                      <p className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
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

      <div className="pt-4 border-t border-slate-50 mt-3">
        <Link
          href="/laporan"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
        >
          <span>Buka Seluruh Laporan Mutasi</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
