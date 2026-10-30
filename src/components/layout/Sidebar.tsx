// components/layout/Sidebar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Warehouse,
  LogOut,
  X,
} from 'lucide-react';
import { logoutAction } from '@/features/auth/actions/auth.actions';
import type { UserWithPermissions } from '@/features/users/types/user.types';
import { cn } from '@/lib/utils';
import { useMobileNav } from './MobileNavProvider';

interface SidebarProps {
  user: UserWithPermissions;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
    feature?: 'dashboard' | 'hak_akses' | 'data_master' | 'transaksi' | 'laporan' | 'pengaturan';
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Operasional Gudang',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard size={16} />,
        feature: 'dashboard',
      },
      {
        label: 'Status Persediaan',
        href: '/transaksi/persediaan',
        icon: <Warehouse size={16} />,
        feature: 'transaksi',
        badge: 'Stok',
      },
      {
        label: 'Barang Masuk',
        href: '/transaksi/barang-masuk',
        icon: <ArrowDownToLine size={16} />,
        feature: 'transaksi',
      },
      {
        label: 'Barang Keluar',
        href: '/transaksi/barang-keluar',
        icon: <ArrowUpFromLine size={16} />,
        feature: 'transaksi',
      },
      {
        label: 'Laporan Mutasi',
        href: '/laporan',
        icon: <FileText size={16} />,
        feature: 'laporan',
      },
    ],
  },
  {
    title: 'Pengaturan Master',
    items: [
      {
        label: 'Kelola Supplier',
        href: '/data-master/supplier',
        icon: <Truck size={16} />,
        feature: 'data_master',
      },
      {
        label: 'Kelola Barang',
        href: '/data-master/barang',
        icon: <Package size={16} />,
        feature: 'data_master',
      },
      {
        label: 'Kelola Akun Staf',
        href: '/hak-akses',
        icon: <Users size={16} />,
        feature: 'hak_akses',
      },
      {
        label: 'Pengaturan Sistem',
        href: '/pengaturan',
        icon: <Settings size={16} />,
        feature: 'pengaturan',
      },
    ],
  },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useMobileNav();

  function isItemVisible(feature?: string) {
    if (user.role === 'super_admin') return true;
    if (!feature) return true;
    const perm = user.user_permissions?.find((p) => p.feature === feature);
    return !!perm?.can_read;
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 w-64 h-screen overflow-hidden bg-linear-to-b from-[#F6F9FD] via-[#FAFCFE] to-[#F1F6FC] border-r border-slate-200/70 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm lg:shadow-none select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Soft Ambient Aerodynamic Curves & Precision Contours */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85" 
          viewBox="0 0 256 960" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sideGrad1" x1="0" y1="0" x2="256" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.07" />
              <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="sideGrad2" x1="256" y1="280" x2="0" y2="680" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.05" />
              <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.005" />
            </linearGradient>
            <linearGradient id="sideGrad3" x1="0" y1="650" x2="256" y2="960" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.03" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.07" />
            </linearGradient>
            <pattern id="techDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3B82F6" fillOpacity="0.07" />
            </pattern>
          </defs>

          {/* Top Aerodynamic Sweep Ribbon */}
          <path 
            d="M-20 -20 Q120 40 180 140 T280 260 L280 -20 Z" 
            fill="url(#sideGrad1)" 
          />
          <path 
            d="M-20 60 Q100 120 150 220 T280 320" 
            stroke="#3B82F6" 
            strokeWidth="1" 
            strokeOpacity="0.09" 
            strokeDasharray="4 4" 
            fill="none"
          />
          {/* Orbital Caliper Rings */}
          <circle cx="210" cy="110" r="75" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.08" fill="none" />
          <circle cx="210" cy="110" r="45" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.10" strokeDasharray="3 3" fill="none" />

          {/* Mid-Sidebar Technical Dot Grid Watermark */}
          <rect x="150" y="320" width="90" height="170" fill="url(#techDots)" opacity="0.35" />

          {/* Mid Flow Contour Ribbon */}
          <path 
            d="M280 300 C170 370 110 470 190 580 C230 630 280 660 280 710 L280 300 Z" 
            fill="url(#sideGrad2)" 
          />
          <path 
            d="M280 350 C180 410 130 495 205 590 C245 640 280 670 280 710" 
            stroke="#2563EB" 
            strokeWidth="1.2" 
            strokeOpacity="0.08" 
            fill="none" 
          />

          {/* Bottom Organic Swell & Concentric Tech Arcs */}
          <path 
            d="M-30 680 C80 660 160 760 110 860 C80 920 10 950 -30 980 Z" 
            fill="url(#sideGrad3)" 
          />
          <path 
            d="M-20 720 C70 700 135 780 95 870" 
            stroke="#3B82F6" 
            strokeWidth="1.2" 
            strokeOpacity="0.10" 
            fill="none" 
          />
          <circle cx="20" cy="880" r="110" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.07" fill="none" />
          <circle cx="20" cy="880" r="70" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.09" strokeDasharray="4 3" fill="none" />
        </svg>

        {/* ── Header: Logo Brand ── */}
        <div className="relative z-10 flex items-center justify-between px-5 h-16 border-b border-blue-100/60 bg-white/40 backdrop-blur-xs shrink-0 gap-3">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-85"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-blue-100/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              <Image
                src="/logo-cv-akurat-sukses-sejati.png"
                alt="Logo CV Akurat Sukses Sejati"
                width={26}
                height={26}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm text-slate-900 leading-tight truncate">
                CV Akurat
              </h1>
              <p className="text-[10px] text-blue-700/90 font-bold truncate tracking-wider uppercase">
                Sukses Sejati
              </p>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 -mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => isItemVisible(item.feature));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1.5 block">
                  {section.title}
                </span>

                {visibleItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative',
                        active
                          ? 'bg-white border border-blue-200/90 text-blue-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            'transition-colors shrink-0',
                            active ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-700'
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors',
                          active
                            ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                            : 'bg-white/80 text-slate-500 border-slate-200/60'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom Section: User Profile ── */}
        <div className="relative z-10 p-3 border-t border-blue-100/60 bg-white/40 backdrop-blur-xs shrink-0">
          {/* User profile card */}
          <div className="flex items-center justify-between rounded-xl bg-white/95 border border-slate-200/80 p-2 shadow-2xs gap-2">
            <Link
              href="/pengaturan?tab=profil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 flex-1 min-w-0 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 tracking-wider">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  user.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate capitalize leading-tight">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Keluar dari akun"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
