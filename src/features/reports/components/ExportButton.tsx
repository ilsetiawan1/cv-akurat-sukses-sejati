// src/features/reports/components/ExportButton.tsx
'use client';

import { Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  targetId: string;
  filename: string;
}

export default function ExportButton({ targetId, filename }: ExportButtonProps) {
  const exportPrint = () => {
    // Native HTML Print - Bebas Canvas, Teks Super Tajam
    window.print();
  };

  const exportCSV = () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    const tables = element.querySelectorAll('table');
    if (tables.length === 0) {
      toast.error('Tidak ada data tabel untuk diekspor');
      return;
    }

    const visibleTable = Array.from(tables).find((t) => t.offsetParent !== null) || tables[0];
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    const rows = visibleTable.querySelectorAll('tr');
    
    rows.forEach((row) => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols).map((c) => {
        const text = (c.textContent || '').trim().replaceAll('"', '""');
        return `"${text}"`;
      });
      csvContent += rowData.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan CSV berhasil diunduh');
  };

  return (
    <div className="flex items-center gap-2 print:hidden shrink-0">
      <button 
        type="button"
        onClick={exportCSV}
        className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
        title="Unduh laporan dalam format CSV"
      >
        <Download size={15} className="text-slate-500" />
        <span>CSV</span>
      </button>
      <button 
        type="button"
        onClick={exportPrint}
        className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-all text-xs sm:text-sm font-medium shadow-xs cursor-pointer active:scale-[0.99] shrink-0 whitespace-nowrap"
        title="Cetak atau simpan laporan ke PDF"
      >
        <Printer size={15} />
        <span>PDF</span>
      </button>
    </div>
  );
}
