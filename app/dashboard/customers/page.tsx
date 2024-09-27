import { Metadata } from 'next';
import Table from '@/app/ui/customers/table';
import { TableRowSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="w-full">
      <Suspense key={query + currentPage} fallback={<TableRowSkeleton />}>
        <Table query={query} /*currentPage={currentPage}*/ />
      </Suspense>
    </div>
  );
}
