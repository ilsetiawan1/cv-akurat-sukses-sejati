'use client';

import { Menu } from 'lucide-react';
import { useMobileNav } from './MobileNavProvider';

export function Header() {
  const { setIsOpen } = useMobileNav();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between lg:hidden h-16 px-4 sm:px-6 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-[#7C3AED] hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="font-bold text-gray-900 truncate">
          CV Akurat Sukses Sejati
        </div>
      </div>
    </header>
  );
}
