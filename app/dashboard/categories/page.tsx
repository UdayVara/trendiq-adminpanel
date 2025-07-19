
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { columns } from './cat-tables/columns'
import { getQueryClient } from '@/lib/getQueryClient'
import CategoryTable from './cat-tables/index'
import { categoryQuery } from '@/api/categories.actions'
import AddEditCategoryDialog from './_components/AddEditCategoryDialog'


 function EnviromentPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(categoryQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-start justify-between mb-4">
      <Heading description='Manage Categories' title={`Categories`}/>
      
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default EnviromentPage