// components/laporan/ExportButton.tsx
'use client';

import { FileDown, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  targetId: string;
  filename: string;
}

export default function ExportButton({ targetId, filename }: Props) {
  const exportPrint = () => {
    // Native HTML Print - Bebas Canvas, Teks Super Tajam
    window.print();
  };

  const exportCSV = () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    const tables = element.querySelectorAll('table');
    if (tables.length === 0) return toast.error('Tidak ada data tabel');

    const visibleTable = Array.from(tables).find(t => t.offsetParent !== null) || tables[0];
    
    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = visibleTable.querySelectorAll('tr');
    
    rows.forEach((row) => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols).map(c => `"${c.textContent?.replace(/"/g, '""').trim()}"`);
      csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan CSV berhasil diunduh');
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto print:hidden">
      <button 
        onClick={exportCSV}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-all shadow-sm"
      >
        <FileDown size={18} />
        <span>Ekspor CSV</span>
      </button>
      <button 
        onClick={exportPrint}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 text-sm font-semibold transition-all shadow-md shadow-purple-200"
      >
        <Printer size={18} />
        <span>Ekspor PDF</span>
      </button>
    </div>
  );
}
