/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ad, AdStatus, Category, Chat, Notification, Offer, ProductCondition, Report, User, UserRole, KycStatus } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.8,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    joinDate: "Jan 2025",
    role: UserRole.USER,
    activePlan: "Gold Pro",
    balance: 4500,
    location: "Mumbai, Maharashtra"
  },
  {
    id: "u2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 91234 56789",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.5,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    joinDate: "Mar 2025",
    role: UserRole.USER,
    activePlan: "Silver Boost",
    balance: 1200,
    location: "Ahmedabad, Gujarat"
  },
  {
    id: "admin1",
    name: "Rajesh Kumar (Admin)",
    email: "admin@bharatmarketplace.in",
    phone: "+91 99999 99999",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5.0,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    joinDate: "Dec 2024",
    role: UserRole.ADMIN,
    activePlan: "Gold Pro",
    balance: 99999,
    location: "New Delhi, Delhi"
  },
  {
    id: "u3",
    name: "Amit Banerjee",
    email: "amit.banerjee@example.com",
    phone: "+91 88888 77777",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.2,
    isVerified: false,
    kycStatus: KycStatus.UNVERIFIED,
    joinDate: "May 2025",
    role: UserRole.USER,
    activePlan: "Free",
    balance: 0,
    location: "Kolkata, West Bengal"
  },
  {
    id: "u4",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 77777 66666",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.6,
    isVerified: true,
    kycStatus: KycStatus.PENDING,
    joinDate: "Feb 2025",
    role: UserRole.USER,
    activePlan: "Free",
    balance: 500,
    location: "Chennai, Tamil Nadu"
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "cars", name: "Cars", iconName: "Car", count: 1240, bgGradient: "from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-200/30 dark:border-blue-800/30" },
  { id: "bikes", name: "Bikes", iconName: "Bike", count: 850, bgGradient: "from-amber-500/10 to-amber-600/10 text-amber-600 dark:text-amber-400 border-amber-200/30 dark:border-amber-800/30" },
  { id: "mobiles", name: "Mobile Phones", iconName: "Smartphone", count: 2310, bgGradient: "from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-200/30 dark:border-purple-800/30" },
  { id: "electronics", name: "Electronics", iconName: "Tv", count: 1840, bgGradient: "from-teal-500/10 to-teal-600/10 text-teal-600 dark:text-teal-400 border-teal-200/30 dark:border-teal-800/30" },
  { id: "furniture", name: "Furniture", iconName: "Sofa", count: 920, bgGradient: "from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-200/30 dark:border-orange-800/30" },
  { id: "fashion", name: "Fashion", iconName: "Shirt", count: 1540, bgGradient: "from-pink-500/10 to-pink-600/10 text-pink-600 dark:text-pink-400 border-pink-200/30 dark:border-pink-800/30" },
  { id: "books", name: "Books", iconName: "BookOpen", count: 610, bgGradient: "from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-800/30" },
  { id: "real_estate", name: "Real Estate", iconName: "Home", count: 420, bgGradient: "from-indigo-500/10 to-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/30 dark:border-indigo-800/30" },
  { id: "jobs", name: "Jobs", iconName: "Briefcase", count: 710, bgGradient: "from-cyan-500/10 to-cyan-600/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/30 dark:border-cyan-800/30" }
];

export const MOCK_ADS: Ad[] = [
  {
    id: "ad1",
    title: "Honda City i-VTEC V (2020) - Single Owner, Pristine Condition",
    description: "Selling my Honda City in immaculate condition. Single-handed driven, primarily on city highways. Complete service record available from authorized service centers. Zero-depreciation insurance valid until Oct 2026. Equipped with dual airbags, premium leather seat covers, automatic climate control, and touchscreen infotainment with Apple CarPlay.",
    price: 845000,
    category: "Cars",
    location: "Mumbai, Maharashtra",
    imageUrls: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.USED_LIKE_NEW,
    datePosted: "2026-06-22",
    status: AdStatus.APPROVED,
    isFeatured: true,
    isPremiumBoosted: true,
    sellerId: "u1",
    sellerName: "Aarav Sharma",
    sellerPhone: "+91 98765 43210",
    sellerRating: 4.8,
    sellerVerified: true,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    views: 412,
    clicks: 89,
    offersCount: 5,
    reported: false,
    reportCount: 0
  },
  {
    id: "ad2",
    title: "Royal Enfield Classic 350 - Stealth Black (2022)",
    description: "Looking to sell my Royal Enfield Classic 350 Matte Black edition. Only 12,000 km driven. Dual-channel ABS, flawless engine condition, no scratches. Regularly serviced at Royal Enfield official showroom. Fitted with official RE crash guard and touring mirrors.",
    price: 185000,
    category: "Bikes",
    location: "Bangalore, Karnataka",
    imageUrls: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.USED_GOOD,
    datePosted: "2026-06-20",
    status: AdStatus.APPROVED,
    isFeatured: true,
    isPremiumBoosted: false,
    sellerId: "u2",
    sellerName: "Priya Patel",
    sellerPhone: "+91 91234 56789",
    sellerRating: 4.5,
    sellerVerified: true,
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    views: 295,
    clicks: 64,
    offersCount: 3,
    reported: false,
    reportCount: 0
  },
  {
    id: "ad3",
    title: "iPhone 15 Pro Max - 256GB - Blue Titanium",
    description: "Selling 8-month-old iPhone 15 Pro Max. Battery Health is at 98%. Under Apple Warranty until October 2026. Absolutely brand new look, not a single scratch. Screen protector and Spigen armor case applied since day one. Comes with original box, bill, and unused charging cable.",
    price: 98000,
    category: "Mobile Phones",
    location: "New Delhi, Delhi",
    imageUrls: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.USED_LIKE_NEW,
    datePosted: "2026-06-23",
    status: AdStatus.APPROVED,
    isFeatured: false,
    isPremiumBoosted: true,
    sellerId: "u4",
    sellerName: "Ananya Iyer",
    sellerPhone: "+91 77777 66666",
    sellerRating: 4.6,
    sellerVerified: true,
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    views: 654,
    clicks: 142,
    offersCount: 11,
    reported: false,
    reportCount: 0
  },
  {
    id: "ad4",
    title: "L-Shaped Premium Velvet Sofa - Emerald Green",
    description: "Extremely comfortable 5-seater L-shaped sofa made of high-quality premium velvet with strong solid sal wood frame. Only 1.5 years old. Super plush cushions with zero sagging. Moving out of the country, hence selling urgently.",
    price: 24500,
    category: "Furniture",
    location: "Pune, Maharashtra",
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.USED_GOOD,
    datePosted: "2026-06-19",
    status: AdStatus.APPROVED,
    isFeatured: false,
    isPremiumBoosted: false,
    sellerId: "u3",
    sellerName: "Amit Banerjee",
    sellerPhone: "+91 88888 77777",
    sellerRating: 4.2,
    sellerVerified: false,
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    views: 112,
    clicks: 18,
    offersCount: 1,
    reported: false,
    reportCount: 0
  },
  {
    id: "ad5",
    title: "Luxury 3 BHK Apartment for Sale in Gated Community",
    description: "Fully furnished 3 BHK flat with 3 bathrooms, modular kitchen, and 2 balconies overlooking a lush green park. Total carpet area of 1650 sq ft. Located on the 8th floor of a high-rise premium society with 24/7 power backup, swimming pool, state-of-the-art gymnasium, and security. Includes 2 covered car parking slots.",
    price: 18500000,
    category: "Real Estate",
    location: "Hyderabad, Telangana",
    imageUrls: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.NEW,
    datePosted: "2026-06-15",
    status: AdStatus.APPROVED,
    isFeatured: true,
    isPremiumBoosted: true,
    sellerId: "u1",
    sellerName: "Aarav Sharma",
    sellerPhone: "+91 98765 43210",
    sellerRating: 4.8,
    sellerVerified: true,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    views: 843,
    clicks: 192,
    offersCount: 7,
    reported: false,
    reportCount: 0
  },
  {
    id: "ad6",
    title: "Sony PlayStation 5 (PS5) Console with 2 DualSense Controllers",
    description: "Excellent working condition PS5 Disc Edition. Includes 2 original DualSense controllers, HDMI, and power cord. Comes with 3 pre-owned game CDs (Spider-Man 2, God of War Ragnarok, GTA V). No heating issues, super silent.",
    price: 36000,
    category: "Electronics",
    location: "Kolkata, West Bengal",
    imageUrls: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.USED_GOOD,
    datePosted: "2026-06-24",
    status: AdStatus.APPROVED,
    isFeatured: false,
    isPremiumBoosted: false,
    sellerId: "u3",
    sellerName: "Amit Banerjee",
    sellerPhone: "+91 88888 77777",
    sellerRating: 4.2,
    sellerVerified: false,
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    views: 74,
    clicks: 22,
    offersCount: 2,
    reported: false,
    reportCount: 0
  },
  // Pending Ad for Admin approval demonstration
  {
    id: "ad_pending_1",
    title: "Brand New Canon EOS R6 Mirrorless Camera (Body Only)",
    description: "Unused, brand new Canon EOS R6 body. Won in a local photography contest, but already have a pro gear. Sealed in original package. Full 2-year Canon India official warranty valid. Selling at a solid discount.",
    price: 145000,
    category: "Electronics",
    location: "Ahmedabad, Gujarat",
    imageUrls: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
    ],
    condition: ProductCondition.NEW,
    datePosted: "2026-06-24",
    status: AdStatus.PENDING,
    isFeatured: false,
    isPremiumBoosted: false,
    sellerId: "u2",
    sellerName: "Priya Patel",
    sellerPhone: "+91 91234 56789",
    sellerRating: 4.5,
    sellerVerified: true,
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    views: 0,
    clicks: 0,
    offersCount: 0,
    reported: false,
    reportCount: 0
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: "chat1",
    adId: "ad3",
    adTitle: "iPhone 15 Pro Max - 256GB - Blue Titanium",
    adPrice: 98000,
    adImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&h=200&q=80",
    buyerId: "u1", // Aarav Sharma
    buyerName: "Aarav Sharma",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    sellerId: "u4", // Ananya Iyer
    sellerName: "Ananya Iyer",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    lastMessage: "Is it possible to meet tomorrow at Connaught Place?",
    unreadCount: 1,
    onlineStatus: "online",
    messages: [
      {
        id: "m1",
        senderId: "u1",
        text: "Hi Ananya, I saw your iPhone 15 Pro Max. Is it still available?",
        timestamp: "2026-06-23T14:30:00Z",
        isRead: true
      },
      {
        id: "m2",
        senderId: "u4",
        text: "Yes, it is available! I have listed it today.",
        timestamp: "2026-06-23T14:35:00Z",
        isRead: true
      },
      {
        id: "m3",
        senderId: "u1",
        text: "Great. Can you do 92,000 INR for it? I can purchase it immediately.",
        timestamp: "2026-06-23T14:38:00Z",
        isRead: true
      },
      {
        id: "m4",
        senderId: "u4",
        text: "That is a bit low. I can do 95,000 INR minimum. It's practically brand new.",
        timestamp: "2026-06-23T14:40:00Z",
        isRead: true
      },
      {
        id: "m5",
        senderId: "u1",
        text: "Is it possible to meet tomorrow at Connaught Place?",
        timestamp: "2026-06-23T14:45:00Z",
        isRead: false
      }
    ]
  },
  {
    id: "chat2",
    adId: "ad2",
    adTitle: "Royal Enfield Classic 350 - Stealth Black (2022)",
    adPrice: 185000,
    adImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&h=200&q=80",
    buyerId: "u3", // Amit Banerjee
    buyerName: "Amit Banerjee",
    buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    sellerId: "u2", // Priya Patel
    sellerName: "Priya Patel",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    lastMessage: "Sure, let me check and let you know by evening.",
    unreadCount: 0,
    onlineStatus: "away",
    messages: [
      {
        id: "m6",
        senderId: "u3",
        text: "Hello, interested in your Royal Enfield. Has it ever been in any minor accident?",
        timestamp: "2026-06-22T09:10:00Z",
        isRead: true
      },
      {
        id: "m7",
        senderId: "u2",
        text: "Absolutely not! It is fully clean. You are welcome to bring a mechanic along to inspect.",
        timestamp: "2026-06-22T09:20:00Z",
        isRead: true
      },
      {
        id: "m8",
        senderId: "u3",
        text: "Excellent. Can we schedule an inspection this coming Saturday?",
        timestamp: "2026-06-22T09:25:00Z",
        isRead: true
      },
      {
        id: "m9",
        senderId: "u2",
        text: "Sure, let me check and let you know by evening.",
        timestamp: "2026-06-22T09:30:00Z",
        isRead: true
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New Offer Received!",
    description: "Aarav Sharma has offered ₹92,000 for your iPhone 15 Pro Max.",
    type: "offer",
    timestamp: "2 hrs ago",
    isRead: false,
    relatedId: "ad3"
  },
  {
    id: "n2",
    title: "Ad Approved Successfully",
    description: "Your listing for 'Honda City i-VTEC V' has been verified and approved by the moderation team.",
    type: "ad_status",
    timestamp: "1 day ago",
    isRead: true,
    relatedId: "ad1"
  },
  {
    id: "n3",
    title: "Price Drop Alert! 📉",
    description: "An item in your wishlist 'L-Shaped Premium Velvet Sofa' dropped by ₹1,500!",
    type: "price_drop",
    timestamp: "2 days ago",
    isRead: false,
    relatedId: "ad4"
  },
  {
    id: "n4",
    title: "Earn ₹250 Free Ads Credit",
    description: "Verify your KYC today to unlock a Free Boost for your next listed product!",
    type: "promo",
    timestamp: "3 days ago",
    isRead: true
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "rep1",
    adId: "ad4",
    adTitle: "L-Shaped Premium Velvet Sofa - Emerald Green",
    adImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&h=200&q=80",
    sellerName: "Amit Banerjee",
    reporterName: "Sumit Singh",
    reason: "Duplicate Listing",
    details: "This exact same sofa with identical pictures was listed on another portal in Bangalore, but this seller listed it in Pune. Might be a scam copy-paste.",
    status: "PENDING",
    date: "2026-06-23"
  },
  {
    id: "rep2",
    adId: "ad2",
    adTitle: "Royal Enfield Classic 350 - Stealth Black (2022)",
    adImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&h=200&q=80",
    sellerName: "Priya Patel",
    reporterName: "Vikram Sen",
    reason: "Incorrect Category",
    details: "Was mistakenly reported, the bike is in correct category. Dismissed.",
    status: "DISMISSED",
    date: "2026-06-21"
  }
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: "off1",
    adId: "ad3",
    adTitle: "iPhone 15 Pro Max - 256GB - Blue Titanium",
    adPrice: 98000,
    buyerName: "Aarav Sharma",
    buyerId: "u1",
    offerPrice: 92000,
    status: "PENDING",
    date: "2026-06-23"
  },
  {
    id: "off2",
    adId: "ad1",
    adTitle: "Honda City i-VTEC V (2020)",
    adPrice: 845000,
    buyerName: "Priya Patel",
    buyerId: "u2",
    offerPrice: 820000,
    status: "ACCEPTED",
    date: "2026-06-22"
  }
];

export const INDIAN_CITIES = [
  "All India",
  "Mumbai, Maharashtra",
  "New Delhi, Delhi",
  "Bangalore, Karnataka",
  "Kolkata, West Bengal",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh"
];

// Multi-language strings for translation demonstration
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    welcome: "Find the Best Deals in Your Neighborhood",
    searchPlaceholder: "Search cars, mobile phones, electronics...",
    postAd: "Post Ad",
    categories: "Browse Categories",
    featured: "Featured Listings",
    latest: "Latest Listings",
    condition: "Condition",
    price: "Price",
    location: "Location",
    allCategories: "All Categories",
    verifiedSeller: "Verified Seller",
    chatNow: "Chat Now",
    call: "Call",
    makeOffer: "Make Offer",
    adminPanel: "Admin Panel",
    userDashboard: "My Hub",
    premiumBoost: "Boost Ad",
    home: "Home"
  },
  hi: {
    welcome: "अपने आस-पास के बेहतरीन सौदे खोजें",
    searchPlaceholder: "कार, मोबाइल फोन, इलेक्ट्रॉनिक्स खोजें...",
    postAd: "विज्ञापन पोस्ट करें",
    categories: "श्रेणियाँ खोजें",
    featured: "चुनिंदा विज्ञापन",
    latest: "नवीनतम विज्ञापन",
    condition: "स्थिति",
    price: "कीमत",
    location: "स्थान",
    allCategories: "सभी श्रेणियां",
    verifiedSeller: "सत्यापित विक्रेता",
    chatNow: "अभी चैट करें",
    call: "कॉल करें",
    makeOffer: "ऑफर करें",
    adminPanel: "व्यवस्थापक पैनल",
    userDashboard: "मेरा हब",
    premiumBoost: "बूस्ट करें",
    home: "मुख्य पृष्ठ"
  },
  bn: {
    welcome: "আপনার কাছাকাছি সেরা ডিল খুঁজুন",
    searchPlaceholder: "গাড়ি, মোবাইল ফোন, ইলেকট্রনিক্স খুঁজুন...",
    postAd: "বিজ্ঞাপন দিন",
    categories: "বিভাগ ব্রাউজ করুন",
    featured: "ফিচার্ড বিজ্ঞাপন",
    latest: "সাম্প্রতিক বিজ্ঞাপন",
    condition: "অবস্থা",
    price: "দাম",
    location: "স্থান",
    allCategories: "সব বিভাগ",
    verifiedSeller: "যাচাইকৃত বিক্রেতা",
    chatNow: "চ্যাট করুন",
    call: "কল করুন",
    makeOffer: "অফার করুন",
    adminPanel: "অ্যাডমিন প্যানেল",
    userDashboard: "আমার হাব",
    premiumBoost: "বুস্ট করুন",
    home: "হোম"
  }
};
