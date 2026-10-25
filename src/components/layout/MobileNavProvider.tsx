'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MobileNavContextType {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const MobileNavContext = createContext<MobileNavContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);

  // Tutup sidebar otomatis saat rute berubah di mobile
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setIsOpen(false);
  }

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <MobileNavContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export const useMobileNav = () => useContext(MobileNavContext);
