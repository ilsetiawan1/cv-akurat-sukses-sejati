// components/layout/Sidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Database, ShoppingCart, FileText, Settings, ChevronDown, Package, Truck, ArrowDownToLine, ArrowUpFromLine, Boxes, LogOut, X, Search } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth.actions';
import type { UserWithPermissions } from '@/types/user.types';
import { cn } from '@/lib/utils';
import { useMobileNav } from './MobileNavProvider';

interface SidebarProps {
  user: UserWithPermissions;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/beranda', icon: <LayoutDashboard size={18} /> },
  { label: 'Hak Akses', href: '/hak-akses', icon: <Users size={18} /> },
  {
    label: 'Data Master',
    icon: <Database size={18} />,
    children: [
      { label: 'Data Supplier', href: '/data-master/supplier', icon: <Truck size={15} /> },
      { label: 'Data Barang', href: '/data-master/barang', icon: <Package size={15} /> },
    ],
  },
  {
    label: 'Transaksi',
    icon: <ShoppingCart size={18} />,
    children: [
      { label: 'Data Persediaan', href: '/transaksi/persediaan', icon: <Boxes size={15} /> },
      { label: 'Data Barang Masuk', href: '/transaksi/barang-masuk', icon: <ArrowDownToLine size={15} /> },
      { label: 'Data Barang Keluar', href: '/transaksi/barang-keluar', icon: <ArrowUpFromLine size={15} /> },
    ],
  },
  { label: 'Laporan', href: '/laporan', icon: <FileText size={18} /> },
  { label: 'Pengaturan', href: '/pengaturan', icon: <Settings size={18} /> },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useMobileNav();

  const initialOpen = navItems.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children) {
      acc[item.label] = item.children.some((c) => pathname.startsWith(c.href));
    }
    return acc;
  }, {});

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(initialOpen);

  function toggleDropdown(label: string) {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* ── Logo & Mobile Close Button ── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0 gap-3">
          <Link href="/beranda" className="flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-80">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
              <Image 
                src="/logo-cv-akurat-sukses-sejati.png" 
                alt="Logo CV Akurat Sukses Sejati" 
                fill
                className="object-contain"
                priority
                sizes="36px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm sm:text-[15px] text-gray-900 leading-tight truncate">
                CV Akurat
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium truncate uppercase tracking-wider">
                Sukses Sejati
              </p>
            </div>
          </Link>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 -mr-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Search (Opsional, hanya UI mock) ── */}
        <div className="px-3 py-4 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50/80 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 transition-colors cursor-text">
            <Search size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Pencarian menu...</span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              const isDropdownOpen = openDropdowns[item.label] ?? false;
              const hasActiveChild = item.children.some((c) => isActive(c.href));

              return (
                <div key={item.label} className="mb-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      hasActiveChild ? 'bg-purple-50 text-[#7C3AED]' : 'text-gray-600 hover:bg-purple-50/50 hover:text-[#7C3AED]',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn("transition-colors", hasActiveChild ? "text-[#7C3AED]" : "text-gray-400 group-hover:text-[#7C3AED]")}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn('transition-transform duration-200 text-gray-400', isDropdownOpen && 'rotate-180')}
                    />
                  </button>

                  <div className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    isDropdownOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <div className="ml-[18px] pl-3 border-l border-gray-200 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200',
                              isActive(child.href) 
                                ? 'bg-[#7C3AED] text-white font-medium shadow-sm shadow-purple-200' 
                                : 'text-gray-500 hover:text-[#7C3AED] hover:bg-purple-50/50',
                            )}
                          >
                            <span className={cn(
                              "transition-colors", 
                              isActive(child.href) ? 'text-white/80' : 'text-gray-400'
                            )}>
                              {child.icon}
                            </span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1',
                  isActive(item.href!) 
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-200' 
                    : 'text-gray-600 hover:bg-purple-50/50 hover:text-[#7C3AED]',
                )}
              >
                <span className={cn("transition-colors", isActive(item.href!) ? "text-white/80" : "text-gray-400")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Profile + Logout ── */}
        <div className="border-t border-gray-100 p-4 shrink-0 bg-gray-50/50">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/pengaturan?tab=profil"
              className="flex items-center gap-3 flex-1 min-w-0 group"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center text-[#7C3AED] text-xs font-bold shrink-0 uppercase ring-2 ring-white shadow-sm group-hover:ring-purple-100 transition-all">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.substring(0, 2)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#7C3AED] transition-colors">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate mt-0.5">{user.role.replace('_', ' ')}</p>
              </div>
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Keluar"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
