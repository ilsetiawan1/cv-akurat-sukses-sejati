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
  Boxes,
  LogOut,
  X,
  ExternalLink,
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
        icon: <Boxes size={16} />,
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
          'fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm lg:shadow-none select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* ── Header: Logo Brand ── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-50 shrink-0 gap-3">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-85"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
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
              <p className="text-[10px] text-slate-400 font-semibold truncate tracking-wider uppercase">
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

        {/* ── Flat Clean Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
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
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group',
                        active
                          ? 'bg-white border border-slate-200/80 text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            'transition-colors shrink-0',
                            active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100/80 text-slate-500 border border-slate-200/50">
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

        {/* ── Bottom Section: Shortcut + Profile ── */}
        <div className="p-3 border-t border-slate-50 shrink-0 space-y-2">
          {/* Quick link button to catalog */}
          <Link
            href="/data-master/barang"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-100 text-slate-600 text-xs font-medium transition-all group"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-700" />
              <span>Katalog Barang</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200/60 px-1.5 py-0.5 rounded-md">
              Buka ↗
            </span>
          </Link>

          {/* User profile card */}
          <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-2 shadow-2xs gap-2">
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
