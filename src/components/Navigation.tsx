/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Globe, LogIn, PlusCircle, Laptop, Smartphone, Sun, Moon, Bell, Shield, User as UserIcon } from "lucide-react";
import { User, UserRole } from "../types";
import { INDIAN_CITIES, TRANSLATIONS } from "../data";

interface NavigationProps {
  currentUser: User;
  onLogout: () => void;
  onLoginAs: (role: UserRole) => void;
  language: "en" | "hi" | "bn";
  setLanguage: (lang: "en" | "hi" | "bn") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onPostAdClick: () => void;
  onAdminClick: () => void;
  onUserHubClick: () => void;
  onHomeClick: () => void;
  isAdminMode: boolean;
  isUserHubMode: boolean;
  unreadNotificationsCount: number;
  onNotificationClick: () => void;
}

export default function Navigation({
  currentUser,
  onLogout,
  onLoginAs,
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  onPostAdClick,
  onAdminClick,
  onUserHubClick,
  onHomeClick,
  isAdminMode,
  isUserHubMode,
  unreadNotificationsCount,
  onNotificationClick
}: NavigationProps) {
  const t = TRANSLATIONS[language];
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-20 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-6 z-30 shrink-0 select-none">
      {/* Brand logo */}
      <div className="flex items-center gap-6">
        <div onClick={onHomeClick} className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center font-black text-slate-900 text-xl shadow-lg shadow-orange-500/10">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Bharat<span className="text-amber-500">Market</span>
          </span>
        </div>

        {/* Global Search */}
        <div className="hidden lg:flex items-center bg-slate-900 rounded-full border border-slate-700/80 px-4 py-2 w-[380px] focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="bg-transparent border-none focus:outline-none text-xs w-full ml-2.5 text-slate-200 placeholder-slate-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 bg-slate-800 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-4">
        {/* City Filter */}
        <div className="relative">
          <button
            id="btn-location-select"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span className="max-w-[100px] truncate">{selectedCity === "All India" ? "All India" : selectedCity.split(",")[0]}</span>
          </button>
          
          {showLocationDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                Select Location
              </div>
              <div className="max-h-60 overflow-y-auto">
                {INDIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 transition-colors flex items-center justify-between ${
                      selectedCity === city ? "text-amber-500 bg-slate-800/40 font-semibold" : "text-slate-300"
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            id="btn-language-select"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase">{language}</span>
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
              <button
                onClick={() => { setLanguage("en"); setShowLangDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 transition-colors ${language === "en" ? "text-amber-500 font-bold" : "text-slate-300"}`}
              >
                English (EN)
              </button>
              <button
                onClick={() => { setLanguage("hi"); setShowLangDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 transition-colors ${language === "hi" ? "text-amber-500 font-bold" : "text-slate-300"}`}
              >
                हिन्दी (HI)
              </button>
              <button
                onClick={() => { setLanguage("bn"); setShowLangDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 transition-colors ${language === "bn" ? "text-amber-500 font-bold" : "text-slate-300"}`}
              >
                বাংলা (BN)
              </button>
            </div>
          )}
        </div>

        {/* Alert Notifications Icon */}
        <button
          onClick={onNotificationClick}
          className="p-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg relative cursor-pointer transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Identity switcher / profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-full cursor-pointer hover:border-slate-700 transition-all"
          >
            <img src={currentUser.avatar} alt="User" className="w-7 h-7 rounded-full object-cover border border-slate-700" />
            <span className="text-xs text-slate-300 pr-2 hidden md:inline font-medium max-w-[90px] truncate">{currentUser.name}</span>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                    currentUser.role === UserRole.ADMIN ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {currentUser.role}
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                    {currentUser.activePlan}
                  </span>
                  {currentUser.isVerified && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                      KYC Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Identity Switchers */}
              <div className="p-2 border-b border-slate-800 bg-slate-950/40">
                <p className="text-[9px] font-bold text-slate-500 uppercase px-2 mb-1.5">Switch Prototype Role</p>
                <button
                  onClick={() => {
                    onLoginAs(UserRole.USER);
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-800 transition-colors flex items-center justify-between ${
                    currentUser.role === UserRole.USER ? "text-amber-500 font-bold bg-slate-800/30" : "text-slate-400"
                  }`}
                >
                  <span>Log in as Regular Seller</span>
                  <span className="text-[9px] text-slate-500">Aarav S.</span>
                </button>
                <button
                  onClick={() => {
                    onLoginAs(UserRole.ADMIN);
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-800 transition-colors flex items-center justify-between ${
                    currentUser.role === UserRole.ADMIN ? "text-red-400 font-bold bg-slate-800/30" : "text-slate-400"
                  }`}
                >
                  <span>Log in as Platform Admin</span>
                  <span className="text-[9px] text-slate-500">Rajesh K.</span>
                </button>
              </div>

              {/* Links */}
              <div className="p-1">
                <button
                  onClick={() => {
                    onUserHubClick();
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-2 ${
                    isUserHubMode ? "text-amber-500 bg-slate-800/30" : ""
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>My Marketplace Hub</span>
                </button>
                <button
                  onClick={() => {
                    onAdminClick();
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-2 ${
                    isAdminMode ? "text-amber-500 bg-slate-800/30" : ""
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Moderation Panel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA - Post Ad */}
        <button
          id="btn-post-ad-header"
          onClick={onPostAdClick}
          className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg shadow-amber-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.postAd.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}
