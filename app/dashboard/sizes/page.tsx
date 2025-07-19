import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { columns } from './size-tables/columns';
import { getQueryClient } from '@/lib/getQueryClient';
import CategoryTable from './size-tables/index';
import { categoryQuery } from '@/api/categories.actions';
import AddEditCategoryDialog from './_components/AddEditSizeDialog';
import { sizeQuery } from '@/api/size.actions';
import SizeTable from './size-tables/index';
import AddEditSizeDialog from './_components/AddEditSizeDialog';

function SizePage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(sizeQuery);
  return (
    <PageContainer scrollable>
      <div className="mb-4 flex flex-row items-start justify-between">
        <Heading description="Manage Sizes" title={`Sizes`} />
      </div>
      <Separator className="my-4" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SizeTable columns={columns} />
      </HydrationBoundary>
    </PageContainer>
  );
}

export default SizePage;
