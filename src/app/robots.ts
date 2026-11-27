// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/transaksi/', '/laporan/', '/hak-akses/', '/pengaturan/'],
    },
    sitemap: 'https://cv-akurat-sukses-sejati.vercel.app/sitemap.xml',
  };
}
