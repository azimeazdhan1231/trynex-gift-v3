export const COMPANY_INFO = {
  name: "TryneX Lifestyle",
  nameBn: "ট্রাইনেক্স লাইফস্টাইল",
  phone: "+8801940689487",
  email: "trynex-lifestyle@gmail.com",
  paymentNumber: "01747292277",
  website: "https://trynex-lifestyle.netlify.app",
  address: "Dhaka, Bangladesh",
  addressBn: "ঢাকা, বাংলাদেশ"
};

export const CATEGORIES = [
  { name: "T-Shirts", namebn: "টি-শার্ট", slug: "t-shirts", icon: "👕" },
  { name: "Mugs", namebn: "মগ", slug: "mugs", icon: "☕" },
  { name: "Bags", namebn: "ব্যাগ", slug: "bags", icon: "👜" },
  { name: "Caps & Hats", namebn: "ক্যাপ ও হ্যাট", slug: "caps-hats", icon: "🧢" },
  { name: "Phone Cases", namebn: "ফোন কেস", slug: "phone-cases", icon: "📱" },
  { name: "Canvas Prints", namebn: "ক্যানভাস প্রিন্ট", slug: "canvas-prints", icon: "🖼️" },
];

export const CUSTOMIZABLE_PRODUCTS = [
  "T-Shirts", "Mugs", "Bags", "Caps & Hats", "Phone Cases", "Canvas Prints"
];

export const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", namebn: "বিকাশ", icon: "📱" },
  { id: "nagad", name: "Nagad", namebn: "নগদ", icon: "💰" },
  { id: "upay", name: "Upay", namebn: "উপায়", icon: "💳" },
  { id: "cod", name: "Cash on Delivery", namebn: "ক্যাশ অন ডেলিভারি", icon: "💵" },
];

export const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"
];

export const DELIVERY_FEE = 120;

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", labelBn: "অপেক্ষমান", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", labelBn: "নিশ্চিত", color: "bg-blue-500" },
  { value: "processing", label: "Processing", labelBn: "প্রক্রিয়াকরণ", color: "bg-purple-500" },
  { value: "shipped", label: "Shipped", labelBn: "পাঠানো হয়েছে", color: "bg-indigo-500" },
  { value: "delivered", label: "Delivered", labelBn: "ডেলিভার", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", labelBn: "বাতিল", color: "bg-red-500" },
];

export const DELIVERY_ZONES = {
  dhaka: { fee: 70, freeAbove: 1500 },
  outside: { fee: 120, freeAbove: 1500 }
};

export const CUSTOMIZABLE_PRODUCTS = [
  "T-Shirt",
  "Hoodie", 
  "Coffee Mug",
  "Canvas Print",
  "Phone Case",
  "Notebook",
  "Pillow",
  "Water Bottle"
];