// components/layout/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Clock, LayoutDashboard, Boxes, ArrowDownToLine, ArrowUpFromLine, FileText, Truck, Package, Users, Settings } from 'lucide-react';
import { useMobileNav } from './MobileNavProvider';

const routeTitleMap: Record<string, { section: string; title: string; icon: React.ReactNode }> = {
  '/dashboard': { section: 'Operasional', title: 'Dashboard', icon: <LayoutDashboard size={14} /> },
  '/transaksi/persediaan': { section: 'Operasional', title: 'Status Persediaan', icon: <Boxes size={14} /> },
  '/transaksi/barang-masuk': { section: 'Operasional', title: 'Barang Masuk', icon: <ArrowDownToLine size={14} /> },
  '/transaksi/barang-keluar': { section: 'Operasional', title: 'Barang Keluar', icon: <ArrowUpFromLine size={14} /> },
  '/laporan': { section: 'Operasional', title: 'Laporan Mutasi', icon: <FileText size={14} /> },
  '/data-master/supplier': { section: 'Master Data', title: 'Kelola Supplier', icon: <Truck size={14} /> },
  '/data-master/barang': { section: 'Master Data', title: 'Kelola Barang', icon: <Package size={14} /> },
  '/hak-akses': { section: 'Sistem', title: 'Kelola Akun Staf', icon: <Users size={14} /> },
  '/pengaturan': { section: 'Sistem', title: 'Pengaturan Sistem', icon: <Settings size={14} /> },
};

export function Header() {
  const { setIsOpen } = useMobileNav();
  const pathname = usePathname();
  const [currentDateString, setCurrentDateString] = useState<string>('');

  useEffect(() => {
    function updateDate() {
      const now = new Date();
      const formatted = now.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentDateString(`${formatted} • ${time} WIB`);
    }

    updateDate();
    const interval = setInterval(updateDate, 30000);
    return () => clearInterval(interval);
  }, []);

  const routeInfo = routeTitleMap[pathname] || {
    section: 'Operasional',
    title: 'Dashboard',
    icon: <LayoutDashboard size={14} />,
  };

  return (
    <header className="sticky top-0 z-30 h-14 w-full bg-[#f8f9fc]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 border-b border-slate-100/80 transition-colors">
      {/* Left: Mobile hamburger + Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200/60"
          aria-label="Buka navigasi"
        >
          <Menu size={20} />
        </button>

        {/* Clean Breadcrumb (matching screenshot) */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{routeInfo.section}</span>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <span className="text-slate-600">{routeInfo.icon}</span>
            <span>{routeInfo.title}</span>
          </div>
        </div>
      </div>

      {/* Right: Live Clock Pill (matching screenshot) */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-2xs text-[11px] font-medium text-slate-600">
          <Clock size={12} className="text-slate-400" />
          <span className="tabular-nums">{currentDateString || 'Memuat waktu...'}</span>
        </div>
      </div>
    </header>
  );
}
