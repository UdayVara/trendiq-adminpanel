
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { getQueryClient } from '@/lib/getQueryClient'
import { columns } from './transaction-tables/columns'
import { transactionQuery } from '@/api/transaction.actions'
import TransactionTable from './transaction-tables'


 function TransactionPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(transactionQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-center justify-between mb-4">
      <Heading description='View Transactions' title={`Transaction` }/>
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default TransactionPage