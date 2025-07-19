import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Enviroment = {
  key: string;
  value: string;
  id: string;
};
export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl:string;
  gender:string;
};
export type Banner = {
  defaultImage:string;
  mobileImage:string;
  id:string;
  createdAt:Date;
}
export type Size = {
  id: string;
  name: string;
  category:Category;
  description: string;
};

export enum gender {
  male="male",
  female="female",
  unisex="unisex"
}
export type Product = {
  title: string;
  description: string;
  markupDescription?:string;
  size: Size;
  category: Category;
  imageUrl: string;
  id: string;
  price:number;
  discount:number;
  createdAt:Date;
  updated_at: Date;
  stock:number;
  minimum_stock:number;
  gender:gender;
  isTrending:boolean;
  color:string;
  product_inventory:productVariant[]
};

export type productVariant = {
  id:string;
  sizeId:string,
  size?:Size;
  stock:number;
  minimum_stock:number;
  price:number;
  discount:number;
  productId:string
}

export type UserType = {
    id: string;
    username: string;
    email: string;
    password: string;
    token: string | null;
    profile: any | null; // Replace `any` with a proper profile type if known
    source: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    isDeleted: boolean;
  };
export type Transaction = {
  id: string;
  amount: number;
  userId: string;
  sessionId: string;
  status: 'open' | 'closed' | string; // Adjust possible status values as needed
  paymentStatus: 'paid' | 'unpaid' | 'failed' | string;
  orderId: string;
  createdAt: string; // or `Date` if parsed
  updatedAt: string; // or `Date` if parsed
  user: UserType
};

type OrderSummary = {
  username: string;
  email: string;
  orderId: string;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  createdAt: string; // or Date, if parsed
  status: string;
  address: {
    id: string;
    street?: string;
    city?: string;
    state?: string;
    addrss?: string;
    pincode?: string;
    [key: string]: any; // optional fallback for unknown keys
  };
};

export enum orderStatus {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  refunded = "refunded",
  packed = "packed",
  shipped = "shipped",
  outForDelivery = "outForDelivery",
  delivered = "delivered"
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  
  {
    title: 'Purchases',
    url: '/dashboard/orders',
    icon: 'products',
    shortcut: ['o', 'o'],
    isActive: true,
    items: [
      {
        title: 'Order',
        url: '/dashboard/orders',
        icon: 'products',
        shortcut: ['o', 'o']
      },
      {
        title: 'Transaction',
        url: '/dashboard/transactions',
        icon: 'logs',
        shortcut: ['c', 'c']
      },
    ] // No child items
  },
  {
    title: 'Product',
    url: '/dashboard/products',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: true,
    items: [
      {
        title: 'Banner',
        url: '/dashboard/banner',
        icon: 'category',
        shortcut: ['b', 'b']
      },
      {
        title: 'Category',
        url: '/dashboard/categories',
        icon: 'category',
        shortcut: ['c', 'c']
      },
      {
        title: 'Sizes',
        url: '/dashboard/sizes',
        icon: 'size',
        shortcut: ['s', 's']
      },
      {
        title: 'Products',
        url: '/dashboard/products',
        icon: 'product',
        shortcut: ['p', 'p']
      },
     
    ] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Enviorments',
    url: '/dashboard/enviroments',
    icon: 'enviroment',
    shortcut: ['e', 'e'],
    isActive: true,
    items: [] // No child items
  }
];
