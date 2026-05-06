// components/beranda/StatCard.tsx

'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number; // persentase vs bulan lalu, bisa negatif
  sparklineData?: number[];
}

// Sparkline SVG sederhana tanpa library eksternal
function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: 'green' | 'red';
}) {
  if (!data || data.length < 2) return null;

  const width = 80;
  const height = 32;
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

  const stroke = color === 'green' ? '#22c55e' : '#ef4444';
  const fill = color === 'green' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';

  // Area path (tutup ke bawah)
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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

// Data sparkline dummy yang terlihat natural
const DEFAULT_SPARKLINES: Record<string, number[]> = {
  up: [3, 5, 4, 7, 6, 8, 9, 11, 10, 13],
  down: [13, 11, 12, 9, 10, 8, 7, 6, 8, 5],
  flat: [6, 7, 6, 8, 7, 9, 8, 9, 8, 10],
};

export function StatCard({ title, value, change, sparklineData }: StatCardProps) {
  const isPositive = change >= 0;
  const isZero = change === 0;

  const data =
    sparklineData ??
    (isZero ? DEFAULT_SPARKLINES.flat : isPositive ? DEFAULT_SPARKLINES.up : DEFAULT_SPARKLINES.down);

  const color = isZero ? 'green' : isPositive ? 'green' : 'red';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold text-gray-900 tabular-nums">
          {value.toLocaleString('id-ID')}
        </span>
        <Sparkline data={data} color={color} />
      </div>

      {/* Change badge */}
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp size={14} className="text-green-500 shrink-0" />
        ) : (
          <TrendingDown size={14} className="text-red-500 shrink-0" />
        )}
        <span
          className={`text-xs font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </div>
  );
}