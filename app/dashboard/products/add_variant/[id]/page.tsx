import { fetchProductById } from '@/api/products.actions'
import React from 'react'
import AddEditProductForm from '../../_components/AddEditProductForm'
import { redirect } from 'next/navigation'

async function Page({
    params,
  }: {
    params: { id: string }
  }) {

    const res = await fetchProductById(params.id)
    
    // console.log(res)
    if(res?.success){
      return <AddEditProductForm product={res.data} isEdit={false} isVariant />
    }else{
      return redirect('/dashboard/products')
    }

  
}

export default Page