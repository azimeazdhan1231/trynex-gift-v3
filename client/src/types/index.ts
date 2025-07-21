// Cart Item type for the frontend store
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  customDesign?: any;
  product: {
    id: number;
    name: string;
    namebn: string;
    price: string;
    images: string[];
    isCustomizable: boolean;
  };
}

// Product types
export interface Product {
  id: number;
  name: string;
  namebn: string;
  description: string;
  descriptionbn: string;
  price: string;
  originalPrice?: string;
  category: string;
  subcategory?: string;
  images: string[];
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  isCustomizable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: {
    street: string;
    district: string;
    thana: string;
    postalCode?: string;
  };
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    customDesign?: any;
  }>;
  subtotal: string;
  deliveryFee: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  namebn: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

// Design Editor types
export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
}

export interface CanvasData {
  width: number;
  height: number;
  elements: DesignElement[];
}

// Custom Design types
export interface CustomDesign {
  id: number;
  sessionId: string;
  productId: number;
  designData: {
    elements: Array<{
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      content?: string;
      imageUrl?: string;
    }>;
    canvas: {
      width: number;
      height: number;
    };
  };
  previewUrl?: string;
  createdAt: string;
}

// Contact Message types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

// Promo types
export interface Promo {
  id: number;
  code: string;
  title: string;
  titlebn: string;
  description?: string;
  discountType: string;
  discountValue: string;
  minOrderAmount?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
}