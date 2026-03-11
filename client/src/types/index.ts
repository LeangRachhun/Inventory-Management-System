//User type
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  address?: string;
}
//Category type
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  __v?: number;
}
//supplier type
export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  __v?: number;
}
// product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  supplier: Supplier;
  isDelete: boolean;
  ccreatedAt?: string;
  lastUpdated?: string;
  __v?: number;
}

export interface Order {
  _id: string;
  user: User; // populated or not
  product: Product; // populated or not
  quantity: number;
  totalPrice: number;
  orderDate: Date;
  __v?: number;
}
