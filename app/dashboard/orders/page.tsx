
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { getQueryClient } from '@/lib/getQueryClient'
import { columns } from './order-tables/columns'
import { transactionQuery } from '@/api/transaction.actions'
import TransactionTable from './order-tables'
import OrderTable from './order-tables'
import { OrderQuery } from '@/api/order.actions'


 function OrderPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(OrderQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-center justify-between mb-4">
      <Heading description='Manage Orders' title={`Orders` }/>
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default OrderPage