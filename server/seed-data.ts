
export const seedData = {
  categories: [
    {
      name: "Custom Gifts",
      namebn: "কাস্টম উপহার",
      slug: "custom-gifts",
      description: "Personalized gifts for special occasions",
      icon: "🎁",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "T-Shirts",
      namebn: "টি-শার্ট",
      slug: "t-shirts",
      description: "Custom printed t-shirts",
      icon: "👕",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Mugs",
      namebn: "মগ",
      slug: "mugs",
      description: "Personalized mugs and cups",
      icon: "☕",
      isActive: true,
      sortOrder: 3
    },
    {
      name: "Home Decor",
      namebn: "ঘর সাজানোর জিনিস",
      slug: "home-decor",
      description: "Beautiful items for your home",
      icon: "🏠",
      isActive: true,
      sortOrder: 4
    },
    {
      name: "Fashion",
      namebn: "ফ্যাশন",
      slug: "fashion",
      description: "Trendy clothing and accessories",
      icon: "👗",
      isActive: true,
      sortOrder: 5
    }
  ],

  products: [
    {
      name: "Custom Photo Mug",
      namebn: "কাস্টম ফটো মগ",
      description: "Personalized ceramic mug with your photo",
      descriptionbn: "আপনার ছবি দিয়ে ব্যক্তিগতকৃত সিরামিক মগ",
      price: "350.00",
      originalPrice: "450.00",
      category: "mugs",
      subcategory: "ceramic",
      images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"],
      tags: ["customizable", "photo", "gift"],
      inStock: true,
      stockQuantity: 50,
      isFeatured: true,
      isCustomizable: true
    },
    {
      name: "Custom T-Shirt",
      namebn: "কাস্টম টি-শার্ট",
      description: "High quality cotton t-shirt with custom design",
      descriptionbn: "কাস্টম ডিজাইনসহ উচ্চমানের সুতির টি-শার্ট",
      price: "550.00",
      originalPrice: "650.00",
      category: "t-shirts",
      subcategory: "cotton",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
      tags: ["customizable", "clothing", "cotton"],
      inStock: true,
      stockQuantity: 100,
      isFeatured: true,
      isCustomizable: true
    },
    {
      name: "Custom Photo Frame",
      namebn: "কাস্টম ফটো ফ্রেম",
      description: "Beautiful wooden frame for your memories",
      descriptionbn: "আপনার স্মৃতির জন্য সুন্দর কাঠের ফ্রেম",
      price: "750.00",
      originalPrice: "850.00",
      category: "home-decor",
      subcategory: "frames",
      images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"],
      tags: ["customizable", "frame", "wood"],
      inStock: true,
      stockQuantity: 30,
      isFeatured: true,
      isCustomizable: true
    },
    {
      name: "Custom Tumbler",
      namebn: "কাস্টম টাম্বলার",
      description: "Insulated steel tumbler with custom design",
      descriptionbn: "কাস্টম ডিজাইনসহ ইনসুলেটেড স্টিল টাম্বলার",
      price: "450.00",
      originalPrice: "550.00",
      category: "custom-gifts",
      subcategory: "drinkware",
      images: ["https://images.unsplash.com/photo-1555499005-4b5ac01ad3d3?w=500"],
      tags: ["customizable", "steel", "insulated"],
      inStock: true,
      stockQuantity: 75,
      isFeatured: true,
      isCustomizable: true
    },
    {
      name: "Custom Canvas Print",
      namebn: "কাস্টম ক্যানভাস প্রিন্ট",
      description: "Premium canvas print of your artwork",
      descriptionbn: "আপনার শিল্পকর্মের প্রিমিয়াম ক্যানভাস প্রিন্ট",
      price: "950.00",
      originalPrice: "1150.00",
      category: "home-decor",
      subcategory: "art",
      images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500"],
      tags: ["customizable", "canvas", "art"],
      inStock: true,
      stockQuantity: 25,
      isFeatured: false,
      isCustomizable: true
    },
    {
      name: "Designer Hoodie",
      namebn: "ডিজাইনার হুডি",
      description: "Premium quality hoodie with custom print",
      descriptionbn: "কাস্টম প্রিন্ট সহ প্রিমিয়াম মানের হুডি",
      price: "850.00",
      originalPrice: "950.00",
      category: "fashion",
      subcategory: "hoodies",
      images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"],
      tags: ["customizable", "hoodie", "premium"],
      inStock: true,
      stockQuantity: 40,
      isFeatured: true,
      isCustomizable: true
    },
    {
      name: "Custom Phone Case",
      namebn: "কাস্টম ফোন কেস",
      description: "Protective phone case with your design",
      descriptionbn: "আপনার ডিজাইন সহ সুরক্ষামূলক ফোন কেস",
      price: "250.00",
      originalPrice: "300.00",
      category: "custom-gifts",
      subcategory: "accessories",
      images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500"],
      tags: ["customizable", "phone", "protection"],
      inStock: true,
      stockQuantity: 80,
      isFeatured: false,
      isCustomizable: true
    }
  ],

  orders: [
    {
      customerName: "আহমেদ আলী",
      customerEmail: "ahmed@example.com",
      customerPhone: "+8801712345678",
      shippingAddress: "ঢাকা, বাংলাদেশ",
      totalAmount: "1200.00",
      orderStatus: "pending",
      paymentStatus: "pending",
      items: [
        {
          productId: 1,
          productName: "Custom Photo Mug",
          quantity: 2,
          price: "350.00"
        }
      ]
    },
    {
      customerName: "ফাতিমা খান",
      customerEmail: "fatima@example.com",
      customerPhone: "+8801987654321",
      shippingAddress: "চট্টগ্রাম, বাংলাদেশ",
      totalAmount: "550.00",
      orderStatus: "processing",
      paymentStatus: "paid",
      items: [
        {
          productId: 2,
          productName: "Custom T-Shirt",
          quantity: 1,
          price: "550.00"
        }
      ]
    }
  ],

  contactMessages: [
    {
      name: "রহিম উদ্দিন",
      email: "rahim@example.com",
      phone: "+8801555123456",
      subject: "অর্ডার সম্পর্কে জিজ্ঞাসা",
      message: "আমার অর্ডারের স্ট্যাটাস জানতে চাই",
      status: "new"
    },
    {
      name: "সালমা বেগম",
      email: "salma@example.com",
      phone: "+8801666789012",
      subject: "কাস্টম ডিজাইন",
      message: "কাস্টম ডিজাইনের জন্য সাহায্য চাই",
      status: "replied"
    }
  ]
};
