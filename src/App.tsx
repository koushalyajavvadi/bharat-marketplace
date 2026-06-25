/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Car, Bike, Smartphone, Tv, Sofa, Shirt, BookOpen, Home, Briefcase,
  Sliders, MessageSquare, User as UserIcon, Shield, Database, Plus, CheckCircle, 
  Sparkles, Award, Wallet, Send, Image, Search, AlertCircle, RefreshCw, MapPin
} from "lucide-react";
import DeviceFrame, { ViewMode } from "./components/DeviceFrame";
import Navigation from "./components/Navigation";
import AdminPanel from "./components/AdminPanel";
import DbExplorer from "./components/DbExplorer";
import AdForms from "./components/AdForms";
import AdDetails from "./components/AdDetails";
import { Ad, AdStatus, Chat, Notification, Report, User, UserRole, KycStatus, ProductCondition } from "./types";
import { TRANSLATIONS, MOCK_USERS } from "./data";

// Helper function to map category names to Lucide Icons
function getCategoryIcon(name: string) {
  switch (name) {
    case "Cars": return Car;
    case "Bikes": return Bike;
    case "Mobile Phones": return Smartphone;
    case "Electronics": return Tv;
    case "Furniture": return Sofa;
    case "Fashion": return Shirt;
    case "Books": return BookOpen;
    case "Real Estate": return Home;
    case "Jobs": return Briefcase;
    default: return Sliders;
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [language, setLanguage] = useState<"en" | "hi" | "bn">("en");
  const [activeScreen, setActiveScreen] = useState<"feed" | "details" | "post-ad" | "chats" | "notifications" | "user-portal" | "admin-portal" | "developer-console">("feed");

  // Server state caches
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Search, category, and catalog filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState("All India");
  const [sortBy, setSortBy] = useState<"latest" | "price_asc" | "price_desc">("latest");

  // Interaction selections
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatInputMessage, setChatInputMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // User Hub / Portal internal tabs
  const [userHubTab, setUserHubTab] = useState<"listings" | "favorites" | "subscription" | "kyc">("listings");
  const [kycLoading, setKycLoading] = useState(false);
  const [boostedAdId, setBoostedAdId] = useState<string | null>(null);
  const [showBoostCelebration, setShowBoostCelebration] = useState(false);

  // Load backend context on start up
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await fetch("/api/user/me");
      const userData = await userRes.json();
      setCurrentUser(userData);

      const adsRes = await fetch("/api/ads");
      const adsData = await adsRes.json();
      setAds(adsData);

      const chatsRes = await fetch("/api/chats");
      const chatsData = await chatsRes.json();
      setChats(chatsData);

      const notRes = await fetch("/api/notifications");
      const notData = await notRes.json();
      setNotifications(notData);

      const repRes = await fetch("/api/reports");
      const repData = await repRes.json();
      setReports(repData);
    } catch (err) {
      console.error("Failed to load initial server context:", err);
    }
  };

  // Switch authenticated login roles dynamically for live testing
  const handleLoginAs = async (role: UserRole) => {
    try {
      const targetUserId = role === UserRole.ADMIN ? "admin1" : "u1";
      const res = await fetch(`/api/users/${targetUserId}`);
      const userData = await res.json();
      setCurrentUser(userData);

      // Create system alert
      const alertNot: Notification = {
        id: "sys_" + Date.now(),
        title: `Switched Role to ${role}`,
        description: `Now viewing workspace simulation as ${userData.name}`,
        type: "ad_status",
        timestamp: "Just now",
        isRead: false
      };
      setNotifications(prev => [alertNot, ...prev]);

      // Route cleanly based on role
      if (role === UserRole.ADMIN) {
        setActiveScreen("admin-portal");
      } else {
        setActiveScreen("feed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAd = async (newAdPayload: any) => {
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdPayload)
      });
      const data = await res.json();
      
      // Update catalog listing
      setAds(prev => [data, ...prev]);
      setActiveScreen("user-portal");
      setUserHubTab("listings");

      // Notify user ad is pending
      const pendingAlert: Notification = {
        id: "sys_pending_" + Date.now(),
        title: "Ad Sent for Verification",
        description: `Listing '${data.title.substring(0, 25)}...' is pending moderator verification.`,
        type: "ad_status",
        timestamp: "Just now",
        isRead: false,
        relatedId: data.id
      };
      setNotifications(prev => [pendingAlert, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Chat message submission
  const handleSendMessage = async () => {
    if (!selectedChat || (!chatInputMessage.trim())) return;
    setIsSendingMessage(true);
    const textToSend = chatInputMessage;
    setChatInputMessage("");

    try {
      const res = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend })
      });
      const data = await res.json();

      // Update active local state for chat thread
      const updatedChats = chats.map(c => {
        if (c.id === selectedChat.id) {
          const updatedMsgs = [...c.messages, data];
          return {
            ...c,
            messages: updatedMsgs,
            lastMessage: textToSend
          };
        }
        return c;
      });

      setChats(updatedChats);
      const matchedChat = updatedChats.find(c => c.id === selectedChat.id);
      if (matchedChat) {
        setSelectedChat(matchedChat);
      }

      // Simulate a smart auto reply after 2.5 seconds
      setTimeout(async () => {
        const chatsRefetch = await fetch("/api/chats");
        const freshChats = await chatsRefetch.json();
        setChats(freshChats);
        const refetchedActiveChat = freshChats.find((c: Chat) => c.id === selectedChat.id);
        if (refetchedActiveChat) {
          setSelectedChat(refetchedActiveChat);
        }

        // Pull notifications update
        const notsRefetch = await fetch("/api/notifications");
        const freshNots = await notsRefetch.json();
        setNotifications(freshNots);
      }, 2500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleStartChatFromDetails = async (startMsg: string) => {
    if (!selectedAd) return;
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId: selectedAd.id,
          sellerId: selectedAd.sellerId,
          messageText: startMsg
        })
      });
      const newChat = await res.json();
      
      // Update local threads
      setChats(prev => {
        const exists = prev.some(c => c.id === newChat.id);
        if (exists) {
          return prev.map(c => c.id === newChat.id ? newChat : c);
        }
        return [newChat, ...prev];
      });

      setSelectedChat(newChat);
      setActiveScreen("chats");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMakeOfferFromDetails = async (offerVal: number) => {
    if (!selectedAd) return;
    try {
      await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId: selectedAd.id,
          offerPrice: offerVal
        })
      });

      // Show temporary boost confirmation
      alert(`Success! Your offer of ₹${offerVal.toLocaleString("en-IN")} has been sent to the seller.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportAdFromDetails = async (reason: string, details: string) => {
    if (!selectedAd) return;
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId: selectedAd.id,
          reason,
          details
        })
      });
      const data = await res.json();
      setReports(prev => [data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Premium ad boosting Razorpay payment simulation
  const handleBoostAd = (adId: string) => {
    setBoostedAdId(adId);
    // Simulate interactive Razorpay/Cashfree secure checkout checkout window
    const userConfirm = window.confirm(
      `🔒 SECURE PLATFORM CHECKOUT\n\nPlan: Silver Boost Listing\nFee: ₹499\n\nWould you like to authorize simulated Razorpay payment?`
    );

    if (userConfirm) {
      setShowBoostCelebration(true);
      // Call backend to update ad boost state
      fetch(`/api/ads/${adId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPremiumBoosted: true, isFeatured: true })
      }).then(() => {
        fetchInitialData();
      });

      // Clear celebration screen after 3 seconds
      setTimeout(() => {
        setShowBoostCelebration(false);
        setBoostedAdId(null);
      }, 4000);
    }
  };

  // KYC verification action
  const handleKycSubmit = () => {
    setKycLoading(true);
    // Simulate OCR text parsing and Aadhaar verification
    setTimeout(async () => {
      try {
        if (currentUser) {
          const res = await fetch(`/api/users/${currentUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVerified: true, kycStatus: KycStatus.VERIFIED })
          });
          const updatedUser = await res.json();
          setCurrentUser(updatedUser);
          setKycLoading(false);

          // Add congratulations notification
          const alertKyc: Notification = {
            id: "sys_kyc_" + Date.now(),
            title: "KYC Verified Successfully 🎉",
            description: "Your document is verified. You now have a 'Verified Seller' badge!",
            type: "ad_status",
            timestamp: "Just now",
            isRead: false
          };
          setNotifications(prev => [alertKyc, ...prev]);
        }
      } catch (err) {
        console.error(err);
        setKycLoading(false);
      }
    }, 2000);
  };

  // Admin approval handlers
  const handleApproveAd = async (id: string) => {
    try {
      await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: AdStatus.APPROVED })
      });
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectAd = async (id: string) => {
    try {
      await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: AdStatus.REJECTED })
      });
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      await fetch(`/api/ads/${id}`, {
        method: "DELETE"
      });
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle wishlist favorites
  const toggleFavorite = (adId: string) => {
    if (favorites.includes(adId)) {
      setFavorites(prev => prev.filter(id => id !== adId));
    } else {
      setFavorites(prev => [...prev, adId]);
    }
  };

  // Clear unread counts for notifications
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Catalog Listing Items
  const filteredAds = ads.filter(ad => {
    // Admin mode doesn't filter, standard listing view only displays approved active ads
    if (activeScreen !== "admin-portal" && ad.status !== AdStatus.APPROVED) {
      return false;
    }

    // Search query matching
    const matchesSearch = searchQuery === "" || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category matching
    const matchesCategory = !selectedCategory || ad.category.toLowerCase() === selectedCategory.toLowerCase();

    // Price matching
    const matchesMinPrice = minPrice === "" || ad.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || ad.price <= Number(maxPrice);

    // Condition matching
    const matchesCondition = selectedCondition === "" || ad.condition === selectedCondition;

    // Location matching
    const matchesLocation = selectedCity === "All India" || ad.location.toLowerCase().includes(selectedCity.split(",")[0].toLowerCase());

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesCondition && matchesLocation;
  });

  // Sort matching results
  const sortedAds = [...filteredAds].sort((a, b) => {
    if (sortBy === "price_asc") {
      return a.price - b.price;
    } else if (sortBy === "price_desc") {
      return b.price - a.price;
    } else {
      // Sort latest first
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    }
  });

  const activeCategoriesCount = ads.reduce<Record<string, number>>((acc, curr) => {
    if (curr.status === AdStatus.APPROVED) {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
    }
    return acc;
  }, {});

  const t = TRANSLATIONS[language];
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <DeviceFrame viewMode={viewMode} setViewMode={setViewMode}>
      {currentUser && (
        <div className="flex-1 flex flex-col h-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
          
          {/* Main header block */}
          <Navigation
            currentUser={currentUser}
            onLogout={() => {}}
            onLoginAs={handleLoginAs}
            language={language}
            setLanguage={setLanguage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onPostAdClick={() => setActiveScreen("post-ad")}
            onAdminClick={() => setActiveScreen("admin-portal")}
            onUserHubClick={() => setActiveScreen("user-portal")}
            onHomeClick={() => {
              setSelectedCategory(null);
              setActiveScreen("feed");
            }}
            isAdminMode={activeScreen === "admin-portal"}
            isUserHubMode={activeScreen === "user-portal"}
            unreadNotificationsCount={unreadNotifications}
            onNotificationClick={() => {
              setActiveScreen("notifications");
              handleMarkNotificationsRead();
            }}
          />

          {/* Sub Navigation controls helper */}
          <div className="bg-[#0F172A] border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between shrink-0 select-none z-10 text-xs">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveScreen("feed");
                }}
                className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  activeScreen === "feed" && !selectedCategory ? "text-amber-500 font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                Catalog Feed
              </button>
              <button
                onClick={() => setActiveScreen("chats")}
                className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  activeScreen === "chats" ? "text-amber-500 font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                Chats ({chats.reduce((acc, curr) => acc + curr.unreadCount, 0)})
              </button>
              <button
                onClick={() => setActiveScreen("developer-console")}
                className={`font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === "developer-console" ? "text-amber-500 font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                DB & API Blueprints
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {currentUser.role === UserRole.ADMIN ? "Admin Active" : "Seller active"}
              </span>
            </div>
          </div>

          {/* Main content body routers */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Desktop Left Sidebar: Category list (Only visible in desktop layout & feed view) */}
            {activeScreen === "feed" && viewMode === "desktop" && (
              <aside className="w-64 bg-[#0F172A] border-r border-slate-800 p-6 flex flex-col gap-8 shrink-0 select-none overflow-y-auto">
                <div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                    {t.categories}
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        !selectedCategory 
                          ? "bg-amber-500/10 text-amber-500 font-bold border border-amber-500/15" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ads.filter(a => a.status === AdStatus.APPROVED).length}
                      </span>
                    </button>
                    {[
                      "Cars", "Bikes", "Mobile Phones", "Electronics", "Furniture", "Fashion", "Books", "Real Estate", "Jobs"
                    ].map((catName) => {
                      const Icon = getCategoryIcon(catName);
                      const isSel = selectedCategory === catName;
                      const count = activeCategoriesCount[catName] || 0;
                      return (
                        <button
                          key={catName}
                          onClick={() => setSelectedCategory(catName)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSel 
                              ? "bg-amber-500/10 text-amber-500 font-bold border border-amber-500/15" 
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 shrink-0 ${isSel ? "text-amber-500" : "text-slate-500"}`} />
                            {catName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="mt-auto">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-amber-500 font-black uppercase tracking-wider block mb-1">
                      Gemini AutoModerator
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Content shield running live. All payments and contact parameters are simulated securely.
                    </p>
                  </div>
                </div>
              </aside>
            )}

            {/* View router viewport */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* SCREEN 1: Listings Catalog Feed */}
              {activeScreen === "feed" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Category Pill Sliders for Android & iOS View Mode */}
                  {viewMode !== "desktop" && (
                    <div className="flex gap-2 p-3.5 bg-slate-900 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0 select-none">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                          !selectedCategory ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        All Items
                      </button>
                      {[
                        "Cars", "Bikes", "Mobile Phones", "Electronics", "Furniture", "Fashion", "Books", "Real Estate", "Jobs"
                      ].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                            selectedCategory === cat ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Filter & Sort Bar */}
                  <div className="bg-[#0F172A]/40 border-b border-slate-800/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Price Range */}
                      <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
                        <span className="text-[9px] text-slate-500 uppercase font-black">₹ Range:</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="bg-transparent border-none text-[10px] text-slate-200 placeholder-slate-700 w-14 focus:outline-none"
                        />
                        <span className="text-slate-600 text-[10px]">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="bg-transparent border-none text-[10px] text-slate-200 placeholder-slate-700 w-14 focus:outline-none"
                        />
                      </div>

                      {/* Condition Selection */}
                      <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-400 focus:outline-none focus:text-slate-200"
                      >
                        <option value="">All Conditions</option>
                        <option value={ProductCondition.NEW}>Condition: Brand New</option>
                        <option value={ProductCondition.USED_LIKE_NEW}>Condition: Like New</option>
                        <option value={ProductCondition.USED_GOOD}>Condition: Good Condition</option>
                        <option value={ProductCondition.USED_FAIR}>Condition: Fair Condition</option>
                      </select>

                      {(minPrice || maxPrice || selectedCondition) && (
                        <button
                          onClick={() => {
                            setMinPrice("");
                            setMaxPrice("");
                            setSelectedCondition("");
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>

                    {/* Sorting Options */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Sort By:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-400 focus:outline-none focus:text-slate-200"
                      >
                        <option value="latest">Newest Postings</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Listings grid feed viewport */}
                  <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <div className="flex justify-between items-center mb-5 select-none">
                      <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                        {selectedCategory ? `${selectedCategory} listings` : t.featured}
                        <span className="text-[10px] text-slate-500 font-normal ml-2">({sortedAds.length} found near {selectedCity.split(",")[0]})</span>
                      </h2>
                    </div>

                    {sortedAds.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl select-none">
                        No approved active listings match your current filters.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {sortedAds.map((ad) => {
                          const isFeatured = ad.isFeatured;
                          const isPrem = ad.isPremiumBoosted;
                          
                          return (
                            <div
                              key={ad.id}
                              onClick={() => {
                                setSelectedAd(ad);
                                setActiveScreen("details");
                              }}
                              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:scale-[1.01] flex flex-col group relative"
                            >
                              {/* Premium tag overlay */}
                              {isPrem && (
                                <div className="absolute top-3 left-3 z-10 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded shadow shadow-amber-500/20 uppercase tracking-wider">
                                  PREMIUM BOOSTED
                                </div>
                              )}

                              {/* Image Stage */}
                              <div className="h-44 bg-slate-850 overflow-hidden relative flex items-center justify-center">
                                <img 
                                  src={ad.imageUrls[0]} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  alt="" 
                                />
                                {!isPrem && isFeatured && (
                                  <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                    FEATURED
                                  </div>
                                )}
                              </div>

                              {/* Content Details */}
                              <div className="p-4 flex flex-col flex-1 justify-between gap-4 select-none">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <p className="text-lg font-black text-white">
                                      ₹ {ad.price.toLocaleString("en-IN")}
                                    </p>
                                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400 uppercase font-semibold">
                                      {ad.condition.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                  <h4 className="text-xs text-slate-300 font-bold group-hover:text-amber-500 transition-colors line-clamp-1 leading-normal">
                                    {ad.title}
                                  </h4>
                                </div>

                                <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    {ad.location.split(",")[0]}
                                  </span>
                                  <span className="text-[9px] uppercase font-bold tracking-tight text-slate-600">
                                    Active Now
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SCREEN 2: Details screen */}
              {activeScreen === "details" && selectedAd && (
                <AdDetails
                  ad={selectedAd}
                  onBack={() => {
                    setSelectedAd(null);
                    setActiveScreen("feed");
                  }}
                  onStartChat={handleStartChatFromDetails}
                  onMakeOffer={handleMakeOfferFromDetails}
                  onReportAd={handleReportAdFromDetails}
                  isFavorited={favorites.includes(selectedAd.id)}
                  onToggleFavorite={() => toggleFavorite(selectedAd.id)}
                  relatedAds={ads.filter(a => a.category === selectedAd.category && a.id !== selectedAd.id && a.status === AdStatus.APPROVED)}
                  onSelectAd={(ad) => setSelectedAd(ad)}
                />
              )}

              {/* SCREEN 3: Create Ad Form */}
              {activeScreen === "post-ad" && (
                <AdForms
                  onAdCreated={handlePostAd}
                  onCancel={() => setActiveScreen("feed")}
                />
              )}

              {/* SCREEN 4: Live Chat Screen */}
              {activeScreen === "chats" && (
                <div className="flex-1 flex overflow-hidden bg-[#020617] select-none">
                  
                  {/* Left panel threads (Only visible on wide screen or when no chat is selected on mobile) */}
                  <div className={`w-full md:w-80 bg-[#0F172A]/40 border-r border-slate-800/80 flex flex-col ${
                    selectedChat && "hidden md:flex"
                  }`}>
                    <div className="p-4 border-b border-slate-800">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Conversations</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
                      {chats.map(chat => {
                        const isSelected = selectedChat?.id === chat.id;
                        return (
                          <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                              isSelected ? "bg-slate-900" : "hover:bg-slate-900/30"
                            }`}
                          >
                            <img src={chat.sellerId === currentUser.id ? chat.buyerAvatar : chat.sellerAvatar} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {chat.sellerId === currentUser.id ? chat.buyerName : chat.sellerName}
                                </h4>
                                <span className="text-[8px] text-slate-500">Just now</span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{chat.lastMessage}</p>
                              <p className="text-[9px] text-amber-500 mt-1 font-semibold truncate">Item: {chat.adTitle}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Panel chat content */}
                  <div className="flex-1 flex flex-col min-w-0 bg-[#020617]">
                    {selectedChat ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        
                        {/* Chat Context Title block */}
                        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedChat(null)}
                              className="md:hidden text-slate-400 hover:text-white mr-1"
                            >
                              ←
                            </button>
                            <img src={selectedChat.sellerId === currentUser.id ? selectedChat.buyerAvatar : selectedChat.sellerAvatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div>
                              <h4 className="text-xs font-bold text-white">
                                {selectedChat.sellerId === currentUser.id ? selectedChat.buyerName : selectedChat.sellerName}
                              </h4>
                              <p className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Live connection
                              </p>
                            </div>
                          </div>

                          <div className="text-right max-w-[150px] md:max-w-xs">
                            <p className="text-[10px] text-slate-300 font-bold truncate">{selectedChat.adTitle}</p>
                            <p className="text-[9px] text-amber-500 mt-0.5 font-bold">₹ {selectedChat.adPrice.toLocaleString("en-IN")}</p>
                          </div>
                        </div>

                        {/* Message log */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
                          {selectedChat.messages.map((msg, idx) => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                              <div
                                key={idx}
                                className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                                  isMe
                                    ? "bg-amber-500 text-slate-950 self-end rounded-tr-none font-medium"
                                    : "bg-slate-900 text-slate-100 self-start rounded-tl-none border border-slate-850"
                                }`}
                              >
                                {msg.text}
                                <span className={`block text-[8px] mt-1 text-right ${
                                  isMe ? "text-slate-700" : "text-slate-500"
                                }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input bar */}
                        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0 flex gap-2">
                          <input
                            type="text"
                            value={chatInputMessage}
                            onChange={(e) => setChatInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type a secure message..."
                            className="flex-1 bg-[#0F172A] border border-slate-800 rounded-full px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={isSendingMessage}
                            className="p-2.5 bg-amber-500 hover:bg-amber-400 rounded-full text-slate-950 transition-colors cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                        <p className="text-xs font-bold">Select a direct message thread to chat with regional buyers or sellers</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* SCREEN 5: Notifications alert log */}
              {activeScreen === "notifications" && (
                <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full select-none">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-sm font-black uppercase text-slate-200 tracking-wider">Security Alert Log</h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">Push notifications and status approvals from moderation hooks</p>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications([]);
                      }}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      Clear All Logs
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      No notifications active in your stream right now.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex gap-3.5 items-start"
                        >
                          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              {n.title}
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.description}</p>
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest block mt-2">{n.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 6: User Portal / Hub */}
              {activeScreen === "user-portal" && (
                <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full select-none">
                  
                  {/* Premium plan banner */}
                  <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shadow-xl shadow-amber-500/5">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        Active Tier: {currentUser.activePlan}
                      </span>
                      <h2 className="text-base font-black">Verify KYC & Boost Listing Credibility!</h2>
                      <p className="text-xs font-medium text-slate-900">
                        Unlocked benefits: Unlimited posts, prioritised regional searches, and instant trust badges.
                      </p>
                    </div>

                    <div className="flex gap-4 items-center shrink-0">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-900 opacity-70">Wallet balance</p>
                        <p className="text-lg font-black text-slate-950">₹ {currentUser.balance.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl">
                        <Wallet className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  </div>

                  {/* Sub Nav Tab Bar */}
                  <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6">
                    {[
                      { id: "listings", label: "My Listings" },
                      { id: "favorites", label: "My Wishlist" },
                      { id: "subscription", label: "Plan Upgrades" },
                      { id: "kyc", label: "KYC Verification Center" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setUserHubTab(tab.id as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          userHubTab === tab.id
                            ? "bg-slate-950 text-amber-500 shadow-sm border border-slate-850"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  {userHubTab === "listings" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">My Active Postings</h3>
                      
                      {ads.filter(a => a.sellerId === currentUser.id).length === 0 ? (
                        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                          You haven't listed any items for sale yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {ads.filter(a => a.sellerId === currentUser.id).map((ad) => (
                            <div key={ad.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center gap-4">
                              <div className="flex gap-3">
                                <img src={ad.imageUrls[0]} className="w-16 h-16 rounded object-cover border border-slate-800 shrink-0" alt="" />
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-white">{ad.title}</h4>
                                  <p className="text-xs text-amber-500 font-extrabold">₹ {ad.price.toLocaleString("en-IN")}</p>
                                  <div className="flex gap-4 text-[10px] text-slate-500">
                                    <span>Views: {ad.views}</span>
                                    <span>Clicks: {ad.clicks}</span>
                                    <span>Offers: {ad.offersCount}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                                  ad.status === AdStatus.APPROVED 
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : ad.status === AdStatus.PENDING
                                      ? "bg-amber-500/20 text-amber-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}>
                                  {ad.status}
                                </span>
                                
                                {ad.status === AdStatus.APPROVED && !ad.isPremiumBoosted && (
                                  <button
                                    onClick={() => handleBoostAd(ad.id)}
                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-[9px] tracking-wider uppercase transition-colors"
                                  >
                                    🚀 Boost Ad (₹499)
                                  </button>
                                )}
                                {ad.isPremiumBoosted && (
                                  <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" />
                                    Active Silver Boost
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {userHubTab === "favorites" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Wishlisted Items</h3>
                      {favorites.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                          No wishlisted items. Browse our catalog and click the heart icon to save!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ads.filter(a => favorites.includes(a.id)).map((ad) => (
                            <div
                              key={ad.id}
                              onClick={() => {
                                setSelectedAd(ad);
                                setActiveScreen("details");
                              }}
                              className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                            >
                              <img src={ad.imageUrls[0]} className="w-16 h-16 rounded object-cover border border-slate-800 shrink-0" alt="" />
                              <div>
                                <h4 className="text-xs font-bold text-white line-clamp-1">{ad.title}</h4>
                                <p className="text-xs text-amber-500 font-extrabold mt-0.5">₹ {ad.price.toLocaleString("en-IN")}</p>
                                <p className="text-[10px] text-slate-500 mt-2">{ad.location.split(",")[0]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {userHubTab === "subscription" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Upgrade Subscription Plans</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase">Silver Boost tier</span>
                          <h4 className="text-sm font-bold text-white">Regional Ad Booster</h4>
                          <p className="text-xs text-slate-400">Boost up to 5 listings, feature on high-traffic local index feeds, and receive advanced CTR insights.</p>
                          <p className="text-sm font-black text-amber-500">₹ 1,299 / month</p>
                          <button
                            onClick={() => {
                              alert("Congratulations! Simulating active Razorpay upgrade...");
                              setCurrentUser(prev => prev ? ({ ...prev, activePlan: "Silver Boost" }) : null);
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-lg"
                          >
                            Purchase Plan
                          </button>
                        </div>

                        <div className="p-5 bg-slate-900 border-2 border-amber-500/30 rounded-xl space-y-3 relative">
                          <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded">POPULAR</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black uppercase">Gold Pro tier</span>
                          <h4 className="text-sm font-bold text-white">Platform Power Seller</h4>
                          <p className="text-xs text-slate-400">Unlimited listings boosts, full verified KYC check, exclusive gold profile badges, and direct API sandbox endpoints access.</p>
                          <p className="text-sm font-black text-amber-500">₹ 2,499 / month</p>
                          <button
                            onClick={() => {
                              alert("Congratulations! Simulating active Razorpay upgrade...");
                              setCurrentUser(prev => prev ? ({ ...prev, activePlan: "Gold Pro" }) : null);
                            }}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg"
                          >
                            Upgrade Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {userHubTab === "kyc" && (
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Aadhaar/PAN KYC Center</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Validate your identity securely to display the 'Verified Seller' badge.</p>
                      </div>

                      {currentUser.isVerified ? (
                        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Identity successfully validated. Your listings now feature a premium Verified Badge!</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Aadhaar / National ID Number</label>
                              <input
                                type="text"
                                placeholder="12-digit UID Number"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5 flex flex-col justify-end">
                              <button
                                type="button"
                                onClick={handleKycSubmit}
                                disabled={kycLoading}
                                className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                {kycLoading ? "Validating with UIDAI Server..." : "Submit for instant OCR verification"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* SCREEN 7: Admin Panel (Moderation screen) */}
              {activeScreen === "admin-portal" && (
                <AdminPanel
                  ads={ads}
                  reports={reports}
                  users={MOCK_USERS} // Use all registered mockup users
                  onApproveAd={handleApproveAd}
                  onRejectAd={handleRejectAd}
                  onDeleteAd={handleDeleteAd}
                  onVerifyUser={async (id) => {
                    alert("Aadhaar KYC approved manually.");
                    fetchInitialData();
                  }}
                  onBlockUser={async (id) => {
                    alert("User account has been restricted.");
                  }}
                  onResolveReport={async (id, action) => {
                    alert(`Report resolved. Action taken: ${action}`);
                    // Remove report locally
                    setReports(prev => prev.filter(r => r.id !== id));
                  }}
                />
              )}

              {/* SCREEN 8: DB & API Console Screen */}
              {activeScreen === "developer-console" && (
                <DbExplorer />
              )}

            </div>
          </div>

          {/* Premium checkout celebration animation overlay */}
          {showBoostCelebration && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 animate-fade-in select-none">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/20 animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-white text-center">Simulating Payment Clearance!</h2>
              <p className="text-xs text-slate-400 text-center max-w-sm px-4 leading-normal">
                Securely synchronized with Cashfree/Razorpay routing channels. Your ad is successfully boosted.
              </p>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded font-bold">
                ✓ TRANSACTION SUCCESSFUL: #TXN_716492
              </span>
            </div>
          )}

          {/* Footer Bar showing overall live counters */}
          <footer className="h-10 bg-[#0F172A] border-t border-slate-800/80 text-slate-400 flex items-center justify-between px-6 text-[10px] font-bold shrink-0 select-none z-10">
            <div className="flex gap-6 uppercase tracking-wider text-slate-500">
              <span>Bharat Marketplace</span>
              <span>•</span>
              <span className="text-emerald-400">{ads.filter(a => a.status === AdStatus.APPROVED).length} live ads</span>
              <span>•</span>
              <span>{chats.length} active chats</span>
            </div>
            <div className="flex gap-4 items-center">
              <span>Help Desk: +91 1800 2450</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </footer>

        </div>
      )}
    </DeviceFrame>
  );
}
