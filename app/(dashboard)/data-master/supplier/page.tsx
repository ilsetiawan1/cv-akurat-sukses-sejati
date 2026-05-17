import { listSuppliers } from '@/lib/services/supplier.service';
import SupplierTable from '@/components/data-master/SupplierTable';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SupplierPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const limit = 10;

  const { data, total } = await listSuppliers(page, limit, search);

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Data Supplier</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Kelola data master supplier untuk keperluan pengadaan barang masuk.
        </p>
      </div>
      
      <SupplierTable 
        data={data} 
        total={total} 
        currentPage={page} 
        limit={limit} 
        searchQuery={search || ''} 
      />
    </div>
  );
}
