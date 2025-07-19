'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  ShoppingCart,
  Eye,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {format} from "date-fns"
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/api/products.actions';
import AddEditVariant from '../../products/_components/AddEditVariant';

// Sample product data - in real app, this would come from API/database
const productData = {
  id: '1',
  name: 'Venom: Eddie Brock',
  description: '100% Cotton premium quality t-shirt with high-definition print',
  gender: 'Male',
  category: 'Oversize T-Shirts',
  size: 'M, L, XL',
  mrp: 999,
  discount: 49.95,
  finalPrice: 949.05,
  image: '/placeholder.svg?height=400&width=400',
  trending: true,
  stock: 45,
  sku: 'VEB001',
  status: 'Active',
  material: '100% Cotton',
  tags: ['superhero', 'marvel', 'casual', 'trendy'],
  createdAt: '2024-01-10',
  updatedAt: '2024-01-15'
};

// Sample inventory data
const inventoryData = [
  { size: 'S', stock: 15, reserved: 2, available: 13, reorderLevel: 10 },
  { size: 'M', stock: 25, reserved: 5, available: 20, reorderLevel: 15 },
  { size: 'L', stock: 18, reserved: 3, available: 15, reorderLevel: 12 },
  { size: 'XL', stock: 12, reserved: 1, available: 11, reorderLevel: 8 }
];

// Sample recent orders
const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2024-01-15',
    quantity: 2,
    size: 'M',
    amount: 1898.1,
    status: 'Delivered'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-01-14',
    quantity: 1,
    size: 'L',
    amount: 949.05,
    status: 'Shipped'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    date: '2024-01-13',
    quantity: 3,
    size: 'XL',
    amount: 2847.15,
    status: 'Processing'
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Wilson',
    email: 'sarah@example.com',
    date: '2024-01-12',
    quantity: 1,
    size: 'S',
    amount: 949.05,
    status: 'Delivered'
  },
  {
    id: 'ORD-005',
    customer: 'Tom Brown',
    email: 'tom@example.com',
    date: '2024-01-11',
    quantity: 2,
    size: 'M',
    amount: 1898.1,
    status: 'Cancelled'
  }
];

export default function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(productData);
  const [activeTab, setActiveTab] = useState('overview');

  const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0);
  const totalReserved = inventoryData.reduce(
    (sum, item) => sum + item.reserved,
    0
  );
  const totalAvailable = inventoryData.reduce(
    (sum, item) => sum + item.available,
    0
  );

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
    console.log('Saving product data:', editData);
  };

  const handleCancel = () => {
    setEditData(productData);
    setIsEditing(false);
  };

  const { data } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProductById(params.id),
    placeholderData: keepPreviousData
  });
  console.log('order', data);
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/products">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{productData.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    SKU: #{data?.data?.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <Link href={`/dashboard/products/edit/${data?.data?.id}`}>
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Product Image and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="relative mb-6 aspect-square">
                    <Image
                      src={data?.data?.imageUrl || '/placeholder.svg'}
                      alt={productData.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          productData.status === 'Active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {productData.status}
                      </Badge>
                      {productData.trending && (
                        <Badge variant="outline" className="text-orange-600">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          MRP:
                        </span>
                        <span className="font-medium">
                          ₹{data?.data?.product_inventory[0]?.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Discount:
                        </span>
                        <span className="font-medium">
                          {data?.data?.product_inventory[0]?.discount}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Final Price:
                        </span>
                        <span className="font-semibold text-green-600">
                          ₹
                          {Math.floor(
                            data?.data?.product_inventory[0]?.price -
                              (data?.data?.product_inventory[0]?.price *
                                data?.data?.product_inventory[0]?.discount) /
                                100
                          ) || 0}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Category:
                        </span>
                        <span className="font-medium">
                          {data?.data?.category?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Gender:
                        </span>
                        <span className="font-medium capitalize">
                          {data?.data?.gender}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Stock:
                        </span>
                        <Badge
                          variant={
                            totalStock > 50
                              ? 'default'
                              : totalStock > 20
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {totalStock} units
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {productData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                      <CardDescription>
                        {isEditing
                          ? 'Edit product details below'
                          : 'View and manage product information'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isEditing ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Product Name</Label>
                              <Input
                                id="name"
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    name: e.target.value
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    description: e.target.value
                                  })
                                }
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={editData.category}
                                onValueChange={(value) =>
                                  setEditData({ ...editData, category: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="T-Shirts">
                                    T-Shirts
                                  </SelectItem>
                                  <SelectItem value="Oversize T-Shirts">
                                    Oversize T-Shirts
                                  </SelectItem>
                                  <SelectItem value="Solid T-Shirt">
                                    Solid T-Shirt
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Select
                                value={editData.gender}
                                onValueChange={(value) =>
                                  setEditData({ ...editData, gender: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Unisex">Unisex</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="mrp">MRP (₹)</Label>
                              <Input
                                id="mrp"
                                type="number"
                                value={editData.mrp}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    mrp: Number(e.target.value)
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="discount">Discount (%)</Label>
                              <Input
                                id="discount"
                                type="number"
                                value={editData.discount}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    discount: Number(e.target.value)
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="material">Material</Label>
                              <Input
                                id="material"
                                value={editData.material}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    material: e.target.value
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="trending">Mark as Trending</Label>
                              <Switch
                                id="trending"
                                checked={editData.trending}
                                onCheckedChange={(checked) =>
                                  setEditData({
                                    ...editData,
                                    trending: checked
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Product Name
                              </Label>
                              <p className="text-base">{data?.data?.title}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Description
                              </Label>
                              <p className="text-base">
                                {data?.data?.description}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Category
                              </Label>
                              <p className="text-base">
                                {data?.data?.category?.name}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Gender
                              </Label>
                              <p className="text-base capitalize">
                                {data?.data?.gender}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Created Date
                              </Label>
                              <p className="text-base">
                                {data?.data?.createdAt}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Last Updated
                              </Label>
                              <p className="text-base">
                                {data?.data?.updatedAt}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Available Sizes
                              </Label>
                              <p className="text-base">
                                {data?.data?.product_inventory
                                  ?.map((item) => item.size?.name)
                                  ?.join(' , ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">
                          {data?.data?.product_inventory?.reduce(
                            (acc: any, item: any) => acc + item.stock,
                            0
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Stock
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-orange-600">
                          {data?.data?.product_inventory?.reduce(
                            (acc: any, item: any) => acc + item.minimum_stock,
                            0
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reserved
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-600">
                          {data?.data?.product_inventory?.reduce(
                            (acc: any, item: any) =>
                              acc + (item.stock - item.minimum_stock),
                            0
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Available
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="flex w-full flex-row items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Inventory Details
                        </CardTitle>
                        <CardDescription>
                          Current stock levels and availability by size
                        </CardDescription>
                      </div>
                      <AddEditVariant
                        isEdit={false}
                        availableSizes={data?.data?.product_inventory}
                        productId={data?.data.id}
                        categoryId={data?.data?.category.id}
                      />
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>Total Stock</TableHead>
                            <TableHead>Reserved</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.data?.product_inventory?.map((item) => (
                            <TableRow key={item.size?.id}>
                              <TableCell className="font-medium">
                                {item.size?.name}
                              </TableCell>
                              <TableCell>{item.stock}</TableCell>
                              <TableCell className="text-orange-600">
                                {item.minimum_stock}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {item.stock - item.minimum_stock}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    item.stock > item.minimum_stock
                                      ? 'default'
                                      : 'destructive'
                                  }
                                >
                                  {item.stock > item.minimum_stock
                                    ? 'In Stock'
                                    : 'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <AddEditVariant
                                  availableSizes={data?.data?.product_inventory}
                                  productId={data?.data.id}
                                  categoryId={data?.data?.category.id}
                                  inventory={item}
                                  isEdit
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Recent Orders (Last 5)
                      </CardTitle>
                      <CardDescription>
                        Latest orders for this product
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.data?.order?.length > 0 &&
                            data?.data?.order.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                  {order.orderId}
                                </TableCell>
                                <TableCell>{order.user?.username}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {order.user?.email}
                                </TableCell>
                                <TableCell className='text-nowrap'>
                                  {format(new Date(order.createdAt), 'dd-MM-yyyy')}
                                </TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.size?.name}</TableCell>
                                <TableCell>₹{order.amount}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      order.status === 'pending'
                                        ? 'warning'
                                        : order.status === 'confirmed'
                                        ? 'info'
                                        : order.status === 'cancelled'
                                        ? 'destructive'
                                        : order.status === 'packed'
                                        ? 'secondary'
                                        : order.status === 'shipped'
                                        ? 'outline'
                                        : order.status === 'outForDelivery'
                                        ? 'primary'
                                        : order.status === 'delivered'
                                        ? 'success'
                                        : order.status === 'refunded'
                                        ? 'success'
                                        : 'warning'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Sales Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Total Sales (30 days):
                            </span>
                            <span className="font-semibold">₹45,230</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Units Sold:
                            </span>
                            <span className="font-semibold">48 units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Avg. Order Value:
                            </span>
                            <span className="font-semibold">₹942</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Return Rate:
                            </span>
                            <span className="font-semibold text-green-600">
                              2.1%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Product Views
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Page Views (30 days):
                            </span>
                            <span className="font-semibold">1,247</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Unique Visitors:
                            </span>
                            <span className="font-semibold">892</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Conversion Rate:
                            </span>
                            <span className="font-semibold">3.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Wishlist Adds:
                            </span>
                            <span className="font-semibold">156</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Size Popularity</CardTitle>
                      <CardDescription>
                        Most popular sizes based on sales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { size: 'M', percentage: 35, sales: 17 },
                          { size: 'L', percentage: 28, sales: 13 },
                          { size: 'XL', percentage: 22, sales: 11 },
                          { size: 'S', percentage: 15, sales: 7 }
                        ].map((item) => (
                          <div
                            key={item.size}
                            className="flex items-center gap-4"
                          >
                            <div className="w-8 text-sm font-medium">
                              {item.size}
                            </div>
                            <div className="h-3 flex-1 rounded-full bg-muted">
                              <div
                                className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <div className="w-20 text-sm text-muted-foreground">
                              {item.sales} sales
                            </div>
                            <div className="w-12 text-sm font-medium">
                              {item.percentage}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600">
                          4.8
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Average Rating
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-purple-600">
                          127
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Reviews
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-600">
                          94%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Satisfaction Rate
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
