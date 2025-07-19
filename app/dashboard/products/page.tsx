
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { columns } from './_components/products_tables/columns'
import { getQueryClient } from '@/lib/getQueryClient'
import CategoryTable from './_components/products_tables/index'
import { productsQuery } from '@/api/products.actions'
import ProductsTable from './_components/products_tables/index'


 async function ProductsPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(productsQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-start justify-between mb-4">
      <Heading description='Manage Products' title={`Products`}/>
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default ProductsPage