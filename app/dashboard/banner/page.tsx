
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { getQueryClient } from '@/lib/getQueryClient'
import { bannerQuery } from '@/api/banner.actions'
import BannerTable from './banner-tables'
import { columns } from './banner-tables/columns'
import { Button } from '@/components/ui/button'
import AddBannerDialog from './_components/addBannerDialog'


 function BannerPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(bannerQuery)
  return (
    <PageContainer scrollable>
      <div className="flex flex-row items-center justify-between mb-4">
      <Heading description='Manage Categories' title={`Banners` }/>
     <AddBannerDialog />
      </div>
      <Separator className='my-4' />
      <HydrationBoundary state={dehydrate(queryClient)}>
      <BannerTable  columns={columns}/>
      </HydrationBoundary>
      
    </PageContainer>
  )
}

export default BannerPage