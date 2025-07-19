
import { enviromentQuery, fetchEnviroments } from '@/api/enviroment.actions'
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary, useQuery } from '@tanstack/react-query'
import React from 'react'
import EnviromentTable from './env-tables/index'
import { Separator } from '@/components/ui/separator'
import AddEditEnviromentDialog from './_components/AddEditEnviromentDialog'
import { columns } from './env-tables/columns'
import { getQueryClient } from '@/lib/getQueryClient'


 function EnviromentPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(enviromentQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-start justify-between mb-4">
      <Heading description='Manage Enviroments' title={`Enviroments`}/>
      
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <EnviromentTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default EnviromentPage