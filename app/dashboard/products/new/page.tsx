import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import AddEditProductForm from '../_components/AddEditProductForm'

function AddProductPage() {
  return (
    <PageContainer scrollable>
        <Heading title='Add Product' description='Add New Product '/>
        <Separator className='my-4' />

        <AddEditProductForm isEdit={false}/>
    </PageContainer>
  )
}

export default AddProductPage