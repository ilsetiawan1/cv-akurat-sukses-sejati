// components/beranda/StatCard.tsx

'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  sparklineData?: number[];
  isCurrency?: boolean;
  badgeLabel?: string;
}

// Sparkline SVG minimalis
function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: 'emerald' | 'rose' | 'slate';
}) {
  if (!data || data.length < 2) return null;

  const width = 72;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const stroke =
    color === 'emerald' ? '#10b981' : color === 'rose' ? '#f43f5e' : '#94a3b8';
  const fill =
    color === 'emerald'
      ? 'rgba(16,185,129,0.06)'
      : color === 'rose'
      ? 'rgba(244,63,94,0.06)'
      : 'rgba(148,163,184,0.06)';

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="shrink-0"
    >
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEFAULT_SPARKLINES: Record<string, number[]> = {
  up: [4, 6, 5, 8, 7, 9, 11, 10, 13],
  down: [13, 11, 12, 9, 10, 8, 7, 6, 5],
  flat: [6, 7, 6, 8, 7, 8, 7, 8, 8],
};

export function StatCard({
  title,
  value,
  change,
  sparklineData,
  isCurrency = false,
  badgeLabel,
}: StatCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const data =
    sparklineData ??
    (change === 0
      ? DEFAULT_SPARKLINES.flat
      : isPositive
      ? DEFAULT_SPARKLINES.up
      : DEFAULT_SPARKLINES.down);

  const color = isPositive ? 'emerald' : isNegative ? 'rose' : 'slate';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all p-4 sm:p-5 flex flex-col justify-between h-full shadow-xs group">
      {/* Zona 1: Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {badgeLabel && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Zona 2: Slot Nilai Utama + Sparkline (Terkunci Tinggi Simetris) */}
      <div className="min-h-[56px] flex items-end justify-between gap-2 my-2">
        <div className="flex items-baseline gap-1 min-w-0">
          {isCurrency && (
            <span className="text-sm font-semibold text-slate-400">Rp</span>
          )}
          <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight truncate">
            {value.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="shrink-0 pl-1">
          <Sparkline data={data} color={color} />
        </div>
      </div>

      {/* Zona 3: Footer Tren & Periode (Simetris di Dasar Kartu) */}
      <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
              <TrendingUp size={12} className="stroke-[2.5]" />
              +{change}%
            </span>
          ) : isNegative ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200/60">
              <TrendingDown size={12} className="stroke-[2.5]" />
              {change}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200/60">
              <Minus size={12} className="stroke-[2.5]" />
              0%
            </span>
          )}
          <span className="text-[10px] sm:text-[11px] text-slate-400">vs bulan lalu</span>
        </div>
      </div>
    </div>
  );
}