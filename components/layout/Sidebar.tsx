// components/layout/Sidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Database, ShoppingCart, FileText, Settings, ChevronDown, Package, Truck, ArrowDownToLine, ArrowUpFromLine, Boxes, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth.actions';
import type { UserWithPermissions } from '@/types/user.types';
import { cn } from '@/lib/utils';

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
    <aside className="w-55 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <svg
          width="36"
          height="36"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4L4 20H10V40H22V28H26V40H38V20H44L24 4Z"
            fill="#D97706"
            fillOpacity="0.15"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 40V30H30V40"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 22L24 8L40 22"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-sm text-gray-400">Search</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = openDropdowns[item.label] ?? false;
            const hasActiveChild = item.children.some((c) => isActive(c.href));

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    hasActiveChild ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-600 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform', isOpen && 'rotate-180')}
                  />
                </button>

                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.href) ? 'text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600',
                        )}
                      >
                        <span className={cn(isActive(child.href) ? 'text-purple-600' : 'text-gray-400')}>{child.icon}</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href!) ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-600 hover:text-white',
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Profile + Logout ── */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/pengaturan/profil"
            className="flex items-center gap-2.5 flex-1 min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold shrink-0 uppercase">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </Link>

          {/* Logout: <form action> dengan logoutAction yang return void + redirect */}
          <form action={logoutAction}>
            <button
              type="submit"
              title="Keluar"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
