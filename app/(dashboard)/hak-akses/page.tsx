// app/(dashboard)/hak-akses/page.tsx

import { UserTable } from '@/components/hak-akses/UserTable';


export default function HakAksesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hak Akses Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola akun dan hak akses pengguna sistem</p>
      </div>

      <UserTable />
    </div>
  );
}
