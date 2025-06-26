export type Locale = 'en' | 'ar'

export const locales: Locale[] = ['en', 'ar']
export const defaultLocale: Locale = 'en'

export interface Translations {
  // Navigation
  nav: {
    home: string
    products: string
    categories: string
    about: string
    contact: string
    cart: string
    wishlist: string
    login: string
    logout: string
    profile: string
    trackOrder: string
    faq: string
  }
  
  // Common
  common: {
    search: string
    searchPlaceholder: string
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    edit: string
    delete: string
    view: string
    back: string
    next: string
    previous: string
    close: string
    submit: string
    required: string
    optional: string
    currency: string
    outOfStock: string
    inStock: string
    sale: string
    new: string
    featured: string
    bestseller: string
    addToCart: string
    buyNow: string
    viewDetails: string
    shareProduct: string
    addToWishlist: string
    removeFromWishlist: string
    quantity: string
    size: string
    color: string
    price: string
    total: string
    subtotal: string
    deliveryFee: string
    free: string
    continueShopping: string
    proceedToCheckout: string
    clearCart: string
    emptyCart: string
    itemsInCart: string
    fullName: string
    email: string
    phoneNumber: string
    subject: string
    message: string
  }
  
  // Product
  product: {
    description: string
    specifications: string
    features: string
    reviews: string
    rating: string
    reference: string
    brand: string
    category: string
    availability: string
    warranty: string
    freeDelivery: string
    easyReturns: string
    securePayment: string
    support247: string
    selectSize: string
    selectColor: string
    maxQuantity: string
    productNotFound: string
    relatedProducts: string
    recentlyViewed: string
  }
  
  // Checkout
  checkout: {
    title: string
    customerInfo: string
    deliveryOptions: string
    reviewOrder: string
    orderSummary: string
    fullName: string
    phoneNumber: string
    email: string
    deliveryType: string
    homeDelivery: string
    pickupFromDesk: string
    city: string
    address: string
    pickupLocation: string
    orderNotes: string
    paymentMethod: string
    cashOnDelivery: string
    placeOrder: string
    placingOrder: string
    orderPlaced: string
    estimatedDelivery: string
    orderConfirmation: string
    whatNext: string
    needHelp: string
  }
  
  // Footer
  footer: {
    quickLinks: string
    customerService: string
    contactInfo: string
    newsletter: string
    subscribeNewsletter: string
    enterEmail: string
    subscribe: string
    followUs: string
    allRightsReserved: string
    privacyPolicy: string
    termsOfService: string
    cookiePolicy: string
    freeShipping: string
    securePayment: string
    support247: string
    easyReturns: string
  }
  
  // Pages
  pages: {
    home: {
      heroTitle: string
      heroSubtitle: string
      shopNow: string
      shopByCategory: string
      featuredProducts: string
      stayUpdated: string
      newsletterText: string
    }
    
    about: {
      title: string
      subtitle: string
      ourStory: string
      ourValues: string
      meetOurTeam: string
      ourMission: string
      customerFirst: string
      qualityAssurance: string
      fastDelivery: string
      excellence: string
    }
    
    contact: {
      title: string
      subtitle: string
      sendMessage: string
      faq: string
      phone: string
      email: string
      address: string
      businessHours: string
      stillHaveQuestions: string
      callUs: string
      sendUsMessage: string
    }
    
    faq: {
      title: string
      subtitle: string
      searchAnswers: string
      allCategories: string
      ordersDelivery: string
      paymentPricing: string
      returnsExchanges: string
      accountSecurity: string
      productsQuality: string
      noResults: string
      clearSearch: string
    }
    
    trackOrder: {
      title: string
      subtitle: string
      orderNumber: string
      trackOrder: string
      searching: string
      orderFound: string
      orderNotFound: string
      orderDetails: string
      trackingTimeline: string
      orderItems: string
    }
    
    wishlist: {
      title: string
      subtitle: string
      emptyWishlist: string
      emptyWishlistText: string
      startShopping: string
      shareWishlist: string
      addAllToCart: string
      youMightLike: string
      exploreMore: string
      addedOn: string
    }
  }
  
  // Admin
  admin: {
    dashboard: string
    products: string
    inventory: string
    orders: string
    shipping: string
    categories: string
    users: string
    analytics: string
    settings: string
    customerCalls: string
    orderProcessing: string
    deliveryAreas: string
    logout: string
    roleNames: {
      ADMIN: string
      SUPERADMIN: string
      CALL_CENTER: string
      ORDER_CONFIRMATION: string
      DELIVERY_COORDINATOR: string
      USER: string
    }
    sidebarTitle: string
    stats: {
      happyCustomers: string
      productsSold: string
      citiesCovered: string
      yearsExperience: string
    }
    values: {
      customerFirst: string
      qualityAssurance: string
      fastDelivery: string
      excellence: string
    }
    team: {
      meetOurTeam: string
      founder: string
      headOfOperations: string
      technologyDirector: string
      description1: string
      description2: string
      description3: string
    }
    contactInfo: {
      phone: string
      email: string
      address: string
      businessHours: string
      callUs: string
      sendUsMessage: string
      details: {
        phone: string[]
        email: string[]
        address: string[]
        businessHours: string[]
      }
    }
    faq: {
      q1: string
      a1: string
      q2: string
      a2: string
      q3: string
      a3: string
      q4: string
      a4: string
    }
    form: {
      productName: string
      productNameAr: string
      description: string
      descriptionAr: string
      categoryName: string
      categoryNameAr: string
      price: string
      stock: string
      image: string
      status: string
      actions: string
      view: string
      edit: string
      delete: string
      save: string
      cancel: string
      create: string
      update: string
      search: string
      filter: string
      sort: string
      export: string
      import: string
      bulkActions: string
      selectAll: string
      clearSelection: string
    }
    messages: {
      loading: string
      error: string
      success: string
      confirmDelete: string
      noData: string
      noResults: string
      retry: string
      back: string
      next: string
      previous: string
      close: string
      submit: string
      reset: string
    }
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
      cart: 'Cart',
      wishlist: 'Wishlist',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      trackOrder: 'Track Order',
      faq: 'FAQ'
    },
    
    common: {
      search: 'Search',
      searchPlaceholder: 'Search products...',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      submit: 'Submit',
      required: 'Required',
      optional: 'Optional',
      currency: 'DA',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      sale: 'Sale',
      new: 'New',
      featured: 'Featured',
      bestseller: 'Bestseller',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      viewDetails: 'View Details',
      shareProduct: 'Share Product',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      quantity: 'Quantity',
      size: 'Size',
      color: 'Color',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      free: 'Free',
      continueShopping: 'Continue Shopping',
      proceedToCheckout: 'Proceed to Checkout',
      clearCart: 'Clear Cart',
      emptyCart: 'Your cart is empty',
      itemsInCart: 'items in cart',
      fullName: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      subject: 'Subject',
      message: 'Message'
    },
    
    product: {
      description: 'Description',
      specifications: 'Specifications',
      features: 'Features',
      reviews: 'Reviews',
      rating: 'Rating',
      reference: 'Reference',
      brand: 'Brand',
      category: 'Category',
      availability: 'Availability',
      warranty: 'Warranty',
      freeDelivery: 'Free Delivery',
      easyReturns: 'Easy Returns',
      securePayment: 'Secure Payment',
      support247: '24/7 Support',
      selectSize: 'Please select a size',
      selectColor: 'Please select a color',
      maxQuantity: 'Max',
      productNotFound: 'Product not found',
      relatedProducts: 'Related Products',
      recentlyViewed: 'Recently Viewed'
    },
    
    checkout: {
      title: 'Checkout',
      customerInfo: 'Customer Information',
      deliveryOptions: 'Delivery Options',
      reviewOrder: 'Review Order',
      orderSummary: 'Order Summary',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      deliveryType: 'Delivery Type',
      homeDelivery: 'Home Delivery',
      pickupFromDesk: 'Pickup from Desk',
      city: 'City',
      address: 'Address',
      pickupLocation: 'Pickup Location',
      orderNotes: 'Order Notes',
      paymentMethod: 'Payment Method',
      cashOnDelivery: 'Cash on Delivery',
      placeOrder: 'Place Order',
      placingOrder: 'Placing Order...',
      orderPlaced: 'Order Placed Successfully!',
      estimatedDelivery: 'Estimated Delivery',
      orderConfirmation: 'Order Confirmation',
      whatNext: "What's Next?",
      needHelp: 'Need Help?'
    },
    
    footer: {
      quickLinks: 'Quick Links',
      customerService: 'Customer Service',
      contactInfo: 'Contact Info',
      newsletter: 'Newsletter',
      subscribeNewsletter: 'Subscribe to our newsletter',
      enterEmail: 'Enter your email',
      subscribe: 'Subscribe',
      followUs: 'Follow Us',
      allRightsReserved: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      freeShipping: 'Free Shipping',
      securePayment: 'Secure Payment',
      support247: '24/7 Support',
      easyReturns: 'Easy Returns'
    },
    
    pages: {
      home: {
        heroTitle: 'Shop the Best',
        heroSubtitle: 'Discover amazing products with fast delivery across Algeria',
        shopNow: 'Shop Now',
        shopByCategory: 'Shop by Category',
        featuredProducts: 'Featured Products',
        stayUpdated: 'Stay Updated',
        newsletterText: 'Subscribe to our newsletter and be the first to know about new products and exclusive offers'
      },
      
      about: {
        title: 'About E-Shop Algeria',
        subtitle: "We're on a mission to revolutionize online shopping in Algeria",
        ourStory: 'Our Story',
        ourValues: 'Our Values',
        meetOurTeam: 'Meet Our Team',
        ourMission: 'Our Mission',
        customerFirst: 'Customer First',
        qualityAssurance: 'Quality Assurance',
        fastDelivery: 'Fast Delivery',
        excellence: 'Excellence'
      },
      
      contact: {
        title: 'Contact Us',
        subtitle: "We're here to help! Get in touch with us for any questions, concerns, or feedback.",
        sendMessage: 'Send us a Message',
        faq: 'Frequently Asked Questions',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        businessHours: 'Business Hours',
        stillHaveQuestions: 'Still have questions?',
        callUs: 'Call Us',
        sendUsMessage: 'Send us a Message'
      },
      
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about shopping, delivery, returns, and more.',
        searchAnswers: 'Search for answers...',
        allCategories: 'All Categories',
        ordersDelivery: 'Orders & Delivery',
        paymentPricing: 'Payment & Pricing',
        returnsExchanges: 'Returns & Exchanges',
        accountSecurity: 'Account & Security',
        productsQuality: 'Products & Quality',
        noResults: 'No results found',
        clearSearch: 'Clear Search'
      },
      
      trackOrder: {
        title: 'Track Your Order',
        subtitle: 'Enter your order number to track your package and see real-time updates',
        orderNumber: 'Order Number',
        trackOrder: 'Track Order',
        searching: 'Searching...',
        orderFound: 'Order found!',
        orderNotFound: 'Order not found. Please check your order number.',
        orderDetails: 'Order Details',
        trackingTimeline: 'Tracking Timeline',
        orderItems: 'Order Items'
      },
      
      wishlist: {
        title: 'My Wishlist',
        subtitle: 'Keep track of items you love and want to purchase later',
        emptyWishlist: 'Your wishlist is empty',
        emptyWishlistText: 'Start adding items to your wishlist by clicking the heart icon on products you love',
        startShopping: 'Start Shopping',
        shareWishlist: 'Share Wishlist',
        addAllToCart: 'Add All to Cart',
        youMightLike: 'You Might Also Like',
        exploreMore: 'Explore More Products',
        addedOn: 'Added on'
      }
    },
    admin: {
      dashboard: 'Dashboard',
      products: 'Products',
      inventory: 'Inventory',
      orders: 'Orders',
      shipping: 'Shipping',
      categories: 'Categories',
      users: 'Users',
      analytics: 'Analytics',
      settings: 'Settings',
      customerCalls: 'Customer Calls',
      orderProcessing: 'Order Processing',
      deliveryAreas: 'Delivery Areas',
      logout: 'Logout',
      roleNames: {
        ADMIN: 'Administrator',
        SUPERADMIN: 'Super Administrator',
        CALL_CENTER: 'Call Center Agent',
        ORDER_CONFIRMATION: 'Order Processor',
        DELIVERY_COORDINATOR: 'Delivery Agent',
        USER: 'User'
      },
      sidebarTitle: 'Loudim Dashboard',
      stats: {
        happyCustomers: 'Happy Customers',
        productsSold: 'Products Sold',
        citiesCovered: 'Cities Covered',
        yearsExperience: 'Years Experience'
      },
      values: {
        customerFirst: 'Customer First',
        qualityAssurance: 'Quality Assurance',
        fastDelivery: 'Fast Delivery',
        excellence: 'Excellence'
      },
      team: {
        meetOurTeam: 'Meet Our Team',
        founder: 'Founder & CEO',
        headOfOperations: 'Head of Operations',
        technologyDirector: 'Technology Director',
        description1: 'Passionate about bringing quality products to Algerian customers.',
        description2: 'Ensures smooth operations and exceptional customer experience.',
        description3: 'Leads our technology initiatives and platform development.'
      },
      contactInfo: {
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        businessHours: 'Business Hours',
        callUs: 'Call Us',
        sendUsMessage: 'Send us a Message',
        details: {
          phone: ['+213 XXX XXX XXX', '+213 YYY YYY YYY'],
          email: ['contact@eshop-algeria.com', 'support@eshop-algeria.com'],
          address: ['123 Main Street', 'Algiers, Algeria'],
          businessHours: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM']
        }
      },
      faq: {
        q1: 'How long does delivery take?',
        a1: 'Delivery typically takes 2-5 business days depending on your location within Algeria.',
        q2: 'What payment methods do you accept?',
        a2: 'We accept cash on delivery, bank transfers, and major credit cards.',
        q3: 'Can I return or exchange items?',
        a3: 'Yes, we offer a 30-day return policy for most items in original condition.',
        q4: 'Do you deliver to all wilayas?',
        a4: 'Yes, we deliver to all 48 wilayas across Algeria.'
      },
      form: {
        productName: 'Product Name',
        productNameAr: 'Product Name (Arabic)',
        description: 'Description',
        descriptionAr: 'Description (Arabic)',
        categoryName: 'Category Name',
        categoryNameAr: 'Category Name (Arabic)',
        price: 'Price',
        stock: 'Stock',
        image: 'Image',
        status: 'Status',
        actions: 'Actions',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        create: 'Create',
        update: 'Update',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        export: 'Export',
        import: 'Import',
        bulkActions: 'Bulk Actions',
        selectAll: 'Select All',
        clearSelection: 'Clear Selection'
      },
      messages: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Operation completed successfully',
        confirmDelete: 'Are you sure you want to delete this item?',
        noData: 'No data available',
        noResults: 'No results found',
        retry: 'Retry',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        submit: 'Submit',
        reset: 'Reset'
      }
    }
  },
  
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      categories: 'الفئات',
      about: 'من نحن',
      contact: 'اتصل بنا',
      cart: 'السلة',
      wishlist: 'المفضلة',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      trackOrder: 'تتبع الطلب',
      faq: 'الأسئلة الشائعة'
    },
    
    common: {
      search: 'بحث',
      searchPlaceholder: 'البحث عن المنتجات...',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      submit: 'إرسال',
      required: 'مطلوب',
      optional: 'اختياري',
      currency: 'د.ج',
      outOfStock: 'غير متوفر',
      inStock: 'متوفر',
      sale: 'تخفيض',
      new: 'جديد',
      featured: 'مميز',
      bestseller: 'الأكثر مبيعاً',
      addToCart: 'أضف للسلة',
      buyNow: 'اشتري الآن',
      viewDetails: 'عرض التفاصيل',
      shareProduct: 'مشاركة المنتج',
      addToWishlist: 'أضف للمفضلة',
      removeFromWishlist: 'إزالة من المفضلة',
      quantity: 'الكمية',
      size: 'المقاس',
      color: 'اللون',
      price: 'السعر',
      total: 'المجموع',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل',
      free: 'مجاني',
      continueShopping: 'متابعة التسوق',
      proceedToCheckout: 'إتمام الطلب',
      clearCart: 'إفراغ السلة',
      emptyCart: 'سلتك فارغة',
      itemsInCart: 'عنصر في السلة',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phoneNumber: 'رقم الهاتف',
      subject: 'الموضوع',
      message: 'الرسالة'
    },
    
    product: {
      description: 'الوصف',
      specifications: 'المواصفات',
      features: 'المميزات',
      reviews: 'التقييمات',
      rating: 'التقييم',
      reference: 'المرجع',
      brand: 'العلامة التجارية',
      category: 'الفئة',
      availability: 'التوفر',
      warranty: 'الضمان',
      freeDelivery: 'توصيل مجاني',
      easyReturns: 'إرجاع سهل',
      securePayment: 'دفع آمن',
      support247: 'دعم على مدار الساعة',
      selectSize: 'يرجى اختيار المقاس',
      selectColor: 'يرجى اختيار اللون',
      maxQuantity: 'الحد الأقصى',
      productNotFound: 'المنتج غير موجود',
      relatedProducts: 'منتجات ذات صلة',
      recentlyViewed: 'شوهدت مؤخراً'
    },
    
    checkout: {
      title: 'إتمام الطلب',
      customerInfo: 'معلومات العميل',
      deliveryOptions: 'خيارات التوصيل',
      reviewOrder: 'مراجعة الطلب',
      orderSummary: 'ملخص الطلب',
      fullName: 'الاسم الكامل',
      phoneNumber: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      deliveryType: 'نوع التوصيل',
      homeDelivery: 'توصيل منزلي',
      pickupFromDesk: 'استلام من المكتب',
      city: 'المدينة',
      address: 'العنوان',
      pickupLocation: 'موقع الاستلام',
      orderNotes: 'ملاحظات الطلب',
      paymentMethod: 'طريقة الدفع',
      cashOnDelivery: 'الدفع عند الاستلام',
      placeOrder: 'تأكيد الطلب',
      placingOrder: 'جاري تأكيد الطلب...',
      orderPlaced: 'تم تأكيد الطلب بنجاح!',
      estimatedDelivery: 'التوصيل المتوقع',
      orderConfirmation: 'تأكيد الطلب',
      whatNext: 'ما التالي؟',
      needHelp: 'تحتاج مساعدة؟'
    },
    
    footer: {
      quickLinks: 'روابط سريعة',
      customerService: 'خدمة العملاء',
      contactInfo: 'معلومات الاتصال',
      newsletter: 'النشرة الإخبارية',
      subscribeNewsletter: 'اشترك في نشرتنا الإخبارية',
      enterEmail: 'أدخل بريدك الإلكتروني',
      subscribe: 'اشتراك',
      followUs: 'تابعنا',
      allRightsReserved: 'جميع الحقوق محفوظة',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      cookiePolicy: 'سياسة ملفات تعريف الارتباط',
      freeShipping: 'شحن مجاني',
      securePayment: 'دفع آمن',
      support247: 'دعم على مدار الساعة',
      easyReturns: 'إرجاع سهل'
    },
    
    pages: {
      home: {
        heroTitle: 'تسوق الأفضل',
        heroSubtitle: 'اكتشف منتجات مذهلة مع توصيل سريع في جميع أنحاء الجزائر',
        shopNow: 'تسوق الآن',
        shopByCategory: 'تسوق حسب الفئة',
        featuredProducts: 'المنتجات المميزة',
        stayUpdated: 'ابق على اطلاع',
        newsletterText: 'اشترك في نشرتنا الإخبارية وكن أول من يعرف عن المنتجات الجديدة والعروض الحصرية'
      },
      
      about: {
        title: 'حول متجر الجزائر الإلكتروني',
        subtitle: 'نحن في مهمة لثورة التسوق عبر الإنترنت في الجزائر',
        ourStory: 'قصتنا',
        ourValues: 'قيمنا',
        meetOurTeam: 'تعرف على فريقنا',
        ourMission: 'مهمتنا',
        customerFirst: 'العميل أولاً',
        qualityAssurance: 'ضمان الجودة',
        fastDelivery: 'توصيل سريع',
        excellence: 'التميز'
      },
      
      contact: {
        title: 'اتصل بنا',
        subtitle: 'نحن هنا للمساعدة! تواصل معنا لأي أسئلة أو استفسارات أو ملاحظات.',
        sendMessage: 'أرسل لنا رسالة',
        faq: 'الأسئلة الشائعة',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'العنوان',
        businessHours: 'ساعات العمل',
        stillHaveQuestions: 'لا تزال لديك أسئلة؟',
        callUs: 'اتصل بنا',
        sendUsMessage: 'أرسل لنا رسالة'
      },
      
      faq: {
        title: 'الأسئلة الشائعة',
        subtitle: 'اعثر على إجابات للأسئلة الشائعة حول التسوق والتوصيل والإرجاع والمزيد.',
        searchAnswers: 'البحث عن إجابات...',
        allCategories: 'جميع الفئات',
        ordersDelivery: 'الطلبات والتوصيل',
        paymentPricing: 'الدفع والتسعير',
        returnsExchanges: 'الإرجاع والاستبدال',
        accountSecurity: 'الحساب والأمان',
        productsQuality: 'المنتجات والجودة',
        noResults: 'لم يتم العثور على نتائج',
        clearSearch: 'مسح البحث'
      },
      
      trackOrder: {
        title: 'تتبع طلبك',
        subtitle: 'أدخل رقم طلبك لتتبع الطرد ومشاهدة التحديثات في الوقت الفعلي',
        orderNumber: 'رقم الطلب',
        trackOrder: 'تتبع الطلب',
        searching: 'جاري البحث...',
        orderFound: 'تم العثور على الطلب!',
        orderNotFound: 'لم يتم العثور على الطلب. يرجى التحقق من رقم الطلب.',
        orderDetails: 'تفاصيل الطلب',
        trackingTimeline: 'الجدول الزمني للتتبع',
        orderItems: 'عناصر الطلب'
      },
      
      wishlist: {
        title: 'قائمة المفضلة',
        subtitle: 'تتبع العناصر التي تحبها وتريد شراؤها لاحقاً',
        emptyWishlist: 'قائمة المفضلة فارغة',
        emptyWishlistText: 'ابدأ بإضافة عناصر إلى قائمة المفضلة بالنقر على أيقونة القلب على المنتجات التي تحبها',
        startShopping: 'ابدأ التسوق',
        shareWishlist: 'مشاركة قائمة المفضلة',
        addAllToCart: 'أضف الكل للسلة',
        youMightLike: 'قد يعجبك أيضاً',
        exploreMore: 'استكشف المزيد من المنتجات',
        addedOn: 'أضيف في'
      }
    },
    admin: {
      dashboard: 'لوحة التحكم',
      products: 'المنتجات',
      inventory: 'المخزون',
      orders: 'الطلبات',
      shipping: 'الشحن',
      categories: 'الفئات',
      users: 'المستخدمون',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
      customerCalls: 'مكالمات العملاء',
      orderProcessing: 'معالجة الطلبات',
      deliveryAreas: 'مناطق التوصيل',
      logout: 'تسجيل الخروج',
      roleNames: {
        ADMIN: 'مدير',
        SUPERADMIN: 'مدير عام',
        CALL_CENTER: 'موظف مركز الاتصال',
        ORDER_CONFIRMATION: 'معالج الطلبات',
        DELIVERY_COORDINATOR: 'مندوب التوصيل',
        USER: 'مستخدم'
      },
      sidebarTitle: 'لوحة تحكم لوديم',
      stats: {
        happyCustomers: 'عملاء سعداء',
        productsSold: 'منتجات مباعة',
        citiesCovered: 'مدن مشمولة',
        yearsExperience: 'سنوات الخبرة'
      },
      values: {
        customerFirst: 'العميل أولاً',
        qualityAssurance: 'ضمان الجودة',
        fastDelivery: 'توصيل سريع',
        excellence: 'التميز'
      },
      team: {
        meetOurTeam: 'تعرف على فريقنا',
        founder: 'المؤسس والرئيس التنفيذي',
        headOfOperations: 'رئيس العمليات',
        technologyDirector: 'مدير التكنولوجيا',
        description1: 'شغوف بتقديم منتجات عالية الجودة للعملاء في الجزائر.',
        description2: 'يضمن سير العمليات بسلاسة وتجربة عملاء استثنائية.',
        description3: 'يقود مبادراتنا التقنية وتطوير المنصة.'
      },
      contactInfo: {
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'العنوان',
        businessHours: 'ساعات العمل',
        callUs: 'اتصل بنا',
        sendUsMessage: 'أرسل لنا رسالة',
        details: {
          phone: ['+213 XXX XXX XXX', '+213 YYY YYY YYY'],
          email: ['contact@eshop-algeria.com', 'support@eshop-algeria.com'],
          address: ['123 شارع رئيسي', 'الجزائر العاصمة، الجزائر'],
          businessHours: ['الإثنين-الجمعة: 9:00 ص - 6:00 م', 'السبت: 10:00 ص - 4:00 م']
        }
      },
      faq: {
        q1: 'كم يستغرق التوصيل؟',
        a1: 'عادةً ما يستغرق التوصيل من 2 إلى 5 أيام عمل حسب موقعك في الجزائر.',
        q2: 'ما هي طرق الدفع المتوفرة؟',
        a2: 'نقبل الدفع عند الاستلام، التحويلات البنكية، وجميع البطاقات الائتمانية الرئيسية.',
        q3: 'هل يمكنني إرجاع أو استبدال المنتجات؟',
        a3: 'نعم، نقدم سياسة إرجاع لمدة 30 يومًا لمعظم المنتجات بحالتها الأصلية.',
        q4: 'هل توصلون إلى جميع الولايات؟',
        a4: 'نعم، نقوم بالتوصيل إلى جميع الولايات الـ 48 في الجزائر.'
      },
      form: {
        productName: 'اسم المنتج',
        productNameAr: 'اسم المنتج (بالعربية)',
        description: 'الوصف',
        descriptionAr: 'الوصف (بالعربية)',
        categoryName: 'اسم الفئة',
        categoryNameAr: 'اسم الفئة (بالعربية)',
        price: 'السعر',
        stock: 'المخزون',
        image: 'الصورة',
        status: 'الحالة',
        actions: 'الإجراءات',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ',
        cancel: 'إلغاء',
        create: 'إنشاء',
        update: 'تحديث',
        search: 'بحث',
        filter: 'تصفية',
        sort: 'ترتيب',
        export: 'تصدير',
        import: 'استيراد',
        bulkActions: 'إجراءات جماعية',
        selectAll: 'تحديد الكل',
        clearSelection: 'مسح التحديد'
      },
      messages: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تمت العملية بنجاح',
        confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟',
        noData: 'لا توجد بيانات متاحة',
        noResults: 'لم يتم العثور على نتائج',
        retry: 'إعادة المحاولة',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        close: 'إغلاق',
        submit: 'إرسال',
        reset: 'إعادة تعيين'
      }
    }
  }
}

// Utility functions
export function getTranslation(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale]
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export function formatCurrency(amount: number, locale: Locale): string {
  const t = getTranslation(locale)
  return `${amount.toLocaleString()} ${t.common.currency}`
}