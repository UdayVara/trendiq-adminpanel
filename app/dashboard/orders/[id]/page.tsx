"use client"

import { useState } from "react"
import { ArrowLeft, Package2, Bell, Edit, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchOrderById, updateOrderStatusService } from "@/api/order.actions"
import { format } from "date-fns"
import { orderStatus } from "@/constants/data"
import { toast } from "sonner"

// Mock data - in a real app, this would come from an API
const getOrderById = (id: string) => {
  const orders = [
    {
      id: "86363264-8a90-4673-9b35-585d09f08ccc",
      user: {
        name: "Ujjval",
        email: "ujjval@gmail.com",
      },
      products: [
        {
          name: "Premium Cotton T-Shirt",
          size: "L",
          color: "Navy Blue",
          quantity: 2,
          price: 1299,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          name: "Casual Jeans",
          size: "32",
          color: "Dark Blue",
          quantity: 1,
          price: 1098,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      subtotal: 2397,
      discount: 159,
      gst: 18,
      tax: 216,
      finalAmount: 2237,
      status: "confirmed",
      createdAt: "02/07/2025 11:01 PM",
      shippingAddress: {
        name: "Ujjval",
        street: "123 Main Street, Apt 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 9876543210",
      },
      orderHistory: [
        { status: "Order Placed", date: "02/07/2025 11:01 PM", completed: true },
        { status: "Payment Confirmed", date: "02/07/2025 11:05 PM", completed: true },
        { status: "Processing", date: "03/07/2025 09:30 AM", completed: true },
        { status: "Shipped", date: "04/07/2025 02:15 PM", completed: false },
        { status: "Delivered", date: "", completed: false },
      ],
    },
    {
      id: "14ffcb20-e0f7-4350-8871-0632a3087090",
      user: {
        name: "Uday",
        email: "uday.test@yopmail.com",
      },
      products: [
        {
          name: "Wireless Headphones",
          size: "One Size",
          color: "Black",
          quantity: 1,
          price: 749,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      subtotal: 749,
      discount: 37,
      gst: 18,
      tax: 67,
      finalAmount: 711,
      status: "confirmed",
      createdAt: "16/06/2025 10:48 PM",
      shippingAddress: {
        name: "Uday",
        street: "456 Park Avenue",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91 9876543211",
      },
      orderHistory: [
        { status: "Order Placed", date: "16/06/2025 10:48 PM", completed: true },
        { status: "Payment Confirmed", date: "16/06/2025 10:52 PM", completed: true },
        { status: "Processing", date: "", completed: false },
        { status: "Shipped", date: "", completed: false },
        { status: "Delivered", date: "", completed: false },
      ],
    },
    {
      id: "fbf77a16-8258-4acf-9529-10ac73ebbb80",
      user: {
        name: "Uday Vara",
        email: "varatuday@gmail.com",
      },
      products: [
        {
          name: "Gaming Mouse",
          size: "One Size",
          color: "RGB",
          quantity: 1,
          price: 2999,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          name: "Mechanical Keyboard",
          size: "Full Size",
          color: "Black",
          quantity: 1,
          price: 4998,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      subtotal: 3497,
      discount: 174,
      gst: 18,
      tax: 315,
      finalAmount: 3322,
      status: "pending",
      createdAt: "11/06/2025 08:26 PM",
      shippingAddress: {
        name: "Uday Vara",
        street: "789 Tech Park, Building A",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        phone: "+91 9876543212",
      },
      orderHistory: [
        { status: "Order Placed", date: "11/06/2025 08:26 PM", completed: true },
        { status: "Payment Confirmed", date: "", completed: false },
        { status: "Processing", date: "", completed: false },
        { status: "Shipped", date: "", completed: false },
        { status: "Delivered", date: "", completed: false },
      ],
    },
  ]

  return orders.find((order) => order.id === id)
}

const statusColors = {
  "pending": { "label": "Pending", "color": "#FFA500" },
  "confirmed": { "label": "Confirmed", "color": "#1E90FF" },
  "cancelled": { "label": "Cancelled", "color": "#FF4C4C" },
  "refunded": { "label": "Refunded", "color": "#8B008B" },
  "packed": { "label": "Packed", "color": "#9370DB" },
  "shipped": { "label": "Shipped", "color": "#20B2AA" },
  "outForDelivery": { "label": "OutForDelivery", "color": "#FFD700" },
  "delivered": { "label": "Delivered", "color": "#32CD32" }
}


export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.id as string
  const order = getOrderById(orderId)
  const queryClient = useQueryClient();
  const {data,isLoading} = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId)
  })

  
  console.log("data",data)
  if (!data && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Order Not Found</h1>
          <Link href="/dashboard/orders">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }
// Example: orderUpdateHistory from DB
const completedStatuses = data?.orderUpdateHistory.map(step => step.status) || [];

const hasCancelledOrRefunded = completedStatuses.includes("cancelled") || completedStatuses.includes("refunded");

const statusesToShow = hasCancelledOrRefunded
  ? ["cancelled", "refunded"].filter(status => completedStatuses.includes(status))
  : Object.keys(statusColors).filter(status =>
      !["pending", "confirmed"].includes(status)
    );
  if(!data && isLoading){
    return <div className="animate-pulse space-y-6 p-6 bg-[#0d0c13] text-white rounded-md w-full mx-auto">
  {/* Order Header */}
  <div className="flex items-center justify-between">
    <div className="space-y-2">
      <div className="h-5 w-40 bg-gray-700 rounded" />
      <div className="h-4 w-64 bg-gray-800 rounded" />
    </div>
    <div className="h-8 w-24 bg-purple-700 rounded" />
  </div>

  {/* Product Card */}
  <div className="flex gap-4 bg-[#14121c] p-4 rounded-lg">
    <div className="h-24 w-20 bg-gray-700 rounded" />
    <div className="flex flex-col justify-between w-full">
      <div className="h-5 w-48 bg-gray-700 rounded" />
      <div className="flex gap-4 mt-2">
        <div className="h-6 w-10 bg-gray-800 rounded" />
        <div className="h-6 w-12 bg-gray-800 rounded" />
        <div className="h-6 w-8 bg-gray-800 rounded" />
      </div>
      <div className="h-5 w-16 bg-gray-600 rounded mt-2" />
    </div>
  </div>

  {/* Payment Breakdown */}
  <div className="space-y-2">
    <div className="h-5 w-40 bg-gray-700 rounded" />
    <div className="flex justify-between">
      <div className="h-4 w-32 bg-gray-800 rounded" />
      <div className="h-4 w-12 bg-gray-800 rounded" />
    </div>
    <div className="flex justify-between">
      <div className="h-4 w-32 bg-gray-800 rounded" />
      <div className="h-4 w-12 bg-green-800 rounded" />
    </div>
    <div className="flex justify-between mt-2 font-semibold text-lg">
      <div className="h-6 w-32 bg-gray-700 rounded" />
      <div className="h-6 w-20 bg-gray-600 rounded" />
    </div>
  </div>

  {/* Payment Method */}
  <div className="h-16 bg-gray-800 rounded w-full mt-4" />

  {/* Customer Info + Order Actions */}
  <div className="grid  grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* Customer Details */}
    <div className="space-y-3">
      <div className="h-5 w-40 bg-gray-700 rounded" />
      <div className="h-4 w-48 bg-gray-800 rounded" />
      <div className="h-4 w-64 bg-gray-800 rounded" />
    </div>

    {/* Order Status Actions */}
    <div className="space-y-3">
      <div className="h-5 w-40 bg-gray-700 rounded" />
      <div className="h-10 w-full bg-gray-800 rounded" />
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-blue-800 rounded" />
        <div className="h-10 w-32 bg-green-800 rounded" />
      </div>
      <div className="h-10 w-full bg-red-800 rounded" />
    </div>
  </div>
</div>

  }

  
  const updateOrderStatus = async (newStatus: string) => {
    // setCurrentStatus(newStatus)
    // In a real app, this would make an API call

    try{
      const res = await updateOrderStatusService(orderId, newStatus);

      if (res.success) {
        await queryClient.refetchQueries({ queryKey: ['order', orderId] });
        toast.success(res.message);
      } else {
        toast.error(res.message);
        console.error(`Failed to update order ${orderId} to status: ${newStatus}`);
      }
    }catch(error:any) {
      toast.error(error?.message || "Something Went Wrong")
      console.log(`Updating order ${orderId} to status: ${newStatus} Failed`,error)
    }
  }
const statusOptions = Object.values(orderStatus);
console.log("display color",statusColors?.[data?.data?.status]?.color)
  return (
    <>
   
    {data?.data && <div className="min-h-screen ">


      {/* Main Content */}
      <div >
        {/* Header */}
        <header className="border-b ">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              
              <div>
                <h1 className="text-2xl font-semibold text-white">Order Details</h1>
                <div className="text-sm text-gray-400">Order ID: #{data?.data?.orderId}...</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`bg-[${statusColors?.[data?.data?.status]?.color}] !bg-none border text-sm px-3 py-1`}>
                {data?.data?.status.toUpperCase()}
              </Badge>
              <Link href="/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Order Details Content */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Products and Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products */}
              <Card className="border-0 w-full p-0">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Package2 className="w-5 h-5" />
                    Products ({data?.data?.products.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.data?.products.map((product:any, index:any) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4  rounded-lg border "
                    >
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-700"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-100 text-lg">{product.title}</h4>
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Size:</span>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {product.size}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Color:</span>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {product.color}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Qty:</span>
                            <span className="text-gray-100">{product.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-100 text-lg">₹{product.amount}</div>
                        <div className="text-sm text-gray-400">per item</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
<Separator />
              {/* Payment Breakdown */}
              <Card className="p-0 border-0">
                <CardHeader>
                  <CardTitle className="text-gray-100">Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({data?.data.products.length} items)</span>
                      <span>₹{data?.data.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Discount Applied</span>
                      <span className="text-green-400">-₹{Math.floor(data?.data.totalDiscount)}</span>
                    </div>
                    {/* <div className="flex justify-between text-gray-300">
                      <span>GST ({order.gst}%)</span>
                      <span>₹{order.tax}</span>
                    </div> */}
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between font-semibold text-xl text-gray-100">
                      <span>Total Amount</span>
                      <span>₹{data?.data?.finalAmount}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4  rounded-lg border ">
                    <div className="text-sm text-gray-400 mb-2">Payment Method</div>
                    <div className="text-gray-100">Credit Card ending in ****1234</div>
                    <div className="text-sm text-gray-400 mt-1">Paid on {format(new Date(data?.data?.createdAt), 'dd/MM/yyyy hh:mm a')}</div>
                  </div>
                </CardContent>
              </Card>
<Separator  />
              {/* Order Timeline */}
              <Card className="p-0 border-0">
                <CardHeader>
                  <CardTitle className="text-gray-100">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            "bg-green-500/20 border-2 border-green-500"
                              
                          }`}
                        >
                          
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium "text-gray-100" `}>
                            {"Order Placed"}
                          </div>
                           <div className="text-sm text-gray-500">{format(new Date(data?.data?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>
                        </div>
                      </div>
                    {
                      data?.data?.status === "cancelled" && (
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              "bg-red-500/20 border-2 border-red-500"
                            }`}
                          >
                            <XCircle className={`w-4 h-4 text-[${statusColors?.[data?.data?.status]?.color}]`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Order Cancelled"}
                            </div>
                            <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "cancelled")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>
                          </div>
                        </div>
                      )
                    }
                    {
                      data?.data?.status == "refunded" && (
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              "bg-red-500/20 border-2 border-purple-500"
                            }`}
                          >
                            <XCircle className={`w-4 h-4 text-[${statusColors?.[data?.data?.status]?.color}]`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Order Refunded"}
                            </div>
                            <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "refunded")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>
                          </div>
                        </div>
                      )
                    }   
                    {
                      data?.data?.status != "cancelled" && data?.data?.status != "refunded" && (
                        <>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              data?.orderUpdateHistory?.find((step) => step.to === "packed") ?"bg-green-500/20 border-2 border-green-500" :"bg-neutral-600/20 border-2 border-neutral-600"
                            }`}
                          >
                            <CheckCircle className={` w-4 h-4 ${data?.orderUpdateHistory?.find((step) => step.to === "packed") ? "text-green-400" : "text-neutral-600"} `} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Packed"}
                            </div>
                            <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "packed")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              data?.orderUpdateHistory?.find((step) => step.to === "shipped") ?"bg-green-500/20 border-2 border-green-500" :"bg-neutral-600/20 border-2 border-neutral-600"
                            }`}
                          >
                            <CheckCircle className={` w-4 h-4 ${data?.orderUpdateHistory?.find((step) => step.to === "shipped") ? "text-green-400" : "text-neutral-600"} `} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Shipped"}
                            </div>
                            { data?.orderUpdateHistory?.find((step) => step.to === "shipped") && <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "shipped")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              data?.orderUpdateHistory?.find((step) => step.to === "outForDelivery") ?"bg-green-500/20 border-2 border-green-500" :"bg-neutral-600/20 border-2 border-neutral-600"
                            }`}
                          >
                            <CheckCircle className={` w-4 h-4 ${data?.orderUpdateHistory?.find((step) => step.to === "outForDelivery") ? "text-green-400" : "text-neutral-600"} `} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Out For Delivery"}
                            </div>
                            { data?.orderUpdateHistory?.find((step) => step.to === "outForDelivery") && <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "outForDelivery")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              data?.orderUpdateHistory?.find((step) => step.to === "delivered") ?"bg-green-500/20 border-2 border-green-500" :"bg-neutral-600/20 border-2 border-neutral-600"
                            }`}
                          >
                            <CheckCircle className={` w-4 h-4 ${data?.orderUpdateHistory?.find((step) => step.to === "delivered") ? "text-green-400" : "text-neutral-600"} `} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium "text-gray-100" `}>
                              {"Delivered"}
                            </div>
                            { data?.orderUpdateHistory?.find((step) => step.to === "delivered") && <div className="text-sm text-gray-500">{format(new Date(data?.orderUpdateHistory?.find((step) => step.to === "delivered")?.createdAt), 'dd/MM/yyyy hh:mm a')} </div>}
                          </div>
                        </div>
                        </>
                      )
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Customer & Status */}
            <div className="space-y-6">
              {/* Customer Details */}
              <Card className="p-0">
                <CardHeader>
                  <CardTitle className="text-gray-100">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-100 text-lg">{data?.data.user.username}</div>
                    <div className="text-sm text-gray-400">{data?.data?.user.email}</div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <h4 className="font-medium text-gray-100 mb-3">Shipping Address</h4>
                    <div className="text-sm text-gray-300 space-y-1 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <div className="font-medium">{data?.data?.address.name}</div>
                      <div>{data?.data?.address.address}</div>
                   
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Management */}
              <Card className="p-0">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Update Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Current Status</label>
                    <Select value={data?.data?.status} onValueChange={updateOrderStatus}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem key={"pending"} value={"pending"}>
                          Pending
                        </SelectItem>

                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      onClick={() => updateOrderStatus("shipped")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Ship Order
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus("delivered")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Delivered
                    </Button>
                  </div>

                  <Button
                    onClick={() => updateOrderStatus("refunded")}
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-100">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Order Date:</span>
                    <span>{format(new Date(data?.data?.createdAt), 'dd/MM/yyyy hh:mm a')}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Order ID:</span>
                    <span className="font-mono max-w-[40%]" ># {data?.data?.orderId}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Items:</span>
                    <span>{data?.data?.products.length} products</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between font-semibold text-gray-100">
                    <span>Total:</span>
                    <span>₹{data?.data?.finalAmount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>} </>
  )
}
