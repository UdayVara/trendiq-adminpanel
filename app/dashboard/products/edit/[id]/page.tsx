import { fetchProductById } from '@/api/products.actions'
import React from 'react'
import AddEditProductForm from '../../_components/AddEditProductForm'
import { redirect } from 'next/navigation'
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

async function Page({
    params,
  }: {
    params: { id: string }
  }) {

    const res = await fetchProductById(params.id)
    // console.log(res)
    if(res?.success){
      return <PageContainer scrollable>
              <Heading title='Edit Product' description='Edit Product '/>
              <Separator className='my-4' />
      
              <AddEditProductForm product={res.data} isEdit={true} />
          </PageContainer>
      
      
    }else{
      return redirect('/dashboard/products')
    }

  
}

export default Page