
export const seedCategories = [
  {
    name: "Custom T-Shirts",
    namebn: "কাস্টম টি-শার্ট",
    slug: "custom-t-shirts",
    description: "High-quality custom printed t-shirts",
    icon: "👕",
    isActive: true,
    sortOrder: 1
  },
  {
    name: "Tote Bags",
    namebn: "টোট ব্যাগ",
    slug: "tote-bags",
    description: "Eco-friendly custom tote bags",
    icon: "👜",
    isActive: true,
    sortOrder: 2
  },
  {
    name: "Hoodies",
    namebn: "হুডি",
    slug: "hoodies",
    description: "Comfortable custom hoodies",
    icon: "🧥",
    isActive: true,
    sortOrder: 3
  },
  {
    name: "Mugs",
    namebn: "মগ",
    slug: "mugs",
    description: "Custom printed mugs",
    icon: "☕",
    isActive: true,
    sortOrder: 4
  },
  {
    name: "Stickers",
    namebn: "স্টিকার",
    slug: "stickers",
    description: "Custom vinyl stickers",
    icon: "🏷️",
    isActive: true,
    sortOrder: 5
  }
];

export const seedProducts = [
  {
    name: "Custom T-Shirt",
    namebn: "কাস্টম টি-শার্ট",
    description: "High-quality 100% cotton t-shirt with custom design printing. Perfect for personal use, events, or promotional purposes.",
    descriptionbn: "উচ্চ মানের ১০০% কটন টি-শার্ট যা কাস্টম ডিজাইন প্রিন্টিং সহ। ব্যক্তিগত ব্যবহার, ইভেন্ট বা প্রচারণার জন্য উপযুক্ত।",
    price: "599.00",
    originalPrice: "799.00",
    category: "Custom T-Shirts",
    subcategory: "Regular Fit",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop"
    ],
    tags: ["cotton", "custom", "comfortable", "durable"],
    inStock: true,
    stockQuantity: 100,
    isFeatured: true,
    isCustomizable: true
  },
  {
    name: "Premium Hoodie",
    namebn: "প্রিমিয়াম হুডি",
    description: "Comfortable fleece hoodie with custom embroidery or printing options. Warm and stylish for all seasons.",
    descriptionbn: "কাস্টম এমব্রয়ডারি বা প্রিন্টিং অপশন সহ আরামদায়ক ফ্লিস হুডি। সব ঋতুর জন্য উষ্ণ এবং স্টাইলিশ।",
    price: "1299.00",
    originalPrice: "1599.00",
    category: "Hoodies",
    subcategory: "Fleece",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=400&h=400&fit=crop"
    ],
    tags: ["fleece", "warm", "custom", "hoodie"],
    inStock: true,
    stockQuantity: 50,
    isFeatured: true,
    isCustomizable: true
  },
  {
    name: "Custom Tote Bag",
    namebn: "কাস্টম টোট ব্যাগ",
    description: "Eco-friendly canvas tote bag perfect for shopping, work, or daily use. Customizable with your design.",
    descriptionbn: "পরিবেশ বান্ধব ক্যানভাস টোট ব্যাগ যা কেনাকাটা, কাজ বা দৈনন্দিন ব্যবহারের জন্য উপযুক্ত। আপনার ডিজাইন দিয়ে কাস্টমাইজ করা যায়।",
    price: "399.00",
    originalPrice: "499.00",
    category: "Tote Bags",
    subcategory: "Canvas",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop"
    ],
    tags: ["eco-friendly", "canvas", "reusable", "custom"],
    inStock: true,
    stockQuantity: 75,
    isFeatured: false,
    isCustomizable: true
  },
  {
    name: "Custom Mug",
    namebn: "কাস্টম মগ",
    description: "High-quality ceramic mug with custom photo or text printing. Dishwasher and microwave safe.",
    descriptionbn: "কাস্টম ফটো বা টেক্সট প্রিন্টিং সহ উচ্চ মানের সিরামিক মগ। ডিশওয়াশার এবং মাইক্রোওয়েভ নিরাপদ।",
    price: "299.00",
    originalPrice: "399.00",
    category: "Mugs",
    subcategory: "Ceramic",
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop"
    ],
    tags: ["ceramic", "dishwasher-safe", "custom", "photo-print"],
    inStock: true,
    stockQuantity: 120,
    isFeatured: true,
    isCustomizable: true
  },
  {
    name: "Vinyl Stickers Pack",
    namebn: "ভিনাইল স্টিকার প্যাক",
    description: "Waterproof vinyl stickers pack with custom designs. Perfect for laptops, cars, or any surface.",
    descriptionbn: "কাস্টম ডিজাইন সহ ওয়াটারপ্রুফ ভিনাইল স্টিকার প্যাক। ল্যাপটপ, গাড়ি বা যেকোনো পৃষ্ঠের জন্য উপযুক্ত।",
    price: "199.00",
    originalPrice: "299.00",
    category: "Stickers",
    subcategory: "Vinyl",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop"
    ],
    tags: ["waterproof", "vinyl", "durable", "custom"],
    inStock: true,
    stockQuantity: 200,
    isFeatured: false,
    isCustomizable: true
  },
  {
    name: "Business Cards Set",
    namebn: "বিজনেস কার্ড সেট",
    description: "Professional business cards with premium paper quality. Custom design and fast printing service.",
    descriptionbn: "প্রিমিয়াম পেপার কোয়ালিটি সহ পেশাদার বিজনেস কার্ড। কাস্টম ডিজাইন এবং দ্রুত প্রিন্টিং সেবা।",
    price: "499.00",
    originalPrice: "699.00",
    category: "Print Materials",
    subcategory: "Business Cards",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    ],
    tags: ["professional", "premium", "business", "cards"],
    inStock: true,
    stockQuantity: 150,
    isFeatured: true,
    isCustomizable: true
  },
  {
    name: "Custom Phone Case",
    namebn: "কাস্টম ফোন কেস",
    description: "Protective phone case with custom photo or design printing. Available for all popular phone models.",
    descriptionbn: "কাস্টম ফটো বা ডিজাইন প্রিন্টিং সহ সুরক্ষামূলক ফোন কেস। সব জনপ্রিয় ফোন মডেলের জন্য পাওয়া যায়।",
    price: "699.00",
    originalPrice: "899.00",
    category: "Phone Accessories",
    subcategory: "Cases",
    images: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop"
    ],
    tags: ["protective", "custom", "phone-case", "durable"],
    inStock: true,
    stockQuantity: 80,
    isFeatured: false,
    isCustomizable: true
  }
];

export const seedPromos = [
  {
    code: "WELCOME20",
    title: "Welcome Discount",
    titlebn: "স্বাগতম ছাড়",
    description: "20% off on your first order",
    discountType: "percentage",
    discountValue: "20.00",
    minOrderAmount: "500.00",
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 100,
    usageCount: 0
  },
  {
    code: "BULK50",
    title: "Bulk Order Discount",
    titlebn: "বাল্ক অর্ডার ছাড়",
    description: "৳50 off on orders above ৳1000",
    discountType: "fixed",
    discountValue: "50.00",
    minOrderAmount: "1000.00",
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    usageLimit: 200,
    usageCount: 0
  }
];
