import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CV Akurat Sukses Sejati',
    short_name: 'Akurat Suksestama',
    description: 'Sistem Informasi Persediaan Barang Otomotif CV Akurat Sukses Sejati',
    start_url: '/beranda',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#7C3AED',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
