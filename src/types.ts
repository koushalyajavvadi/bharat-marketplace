/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AdStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED"
}

export enum ProductCondition {
  NEW = "NEW",
  USED_LIKE_NEW = "USED_LIKE_NEW",
  USED_GOOD = "USED_GOOD",
  USED_FAIR = "USED_FAIR"
}

export enum KycStatus {
  UNVERIFIED = "UNVERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED"
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  isVerified: boolean;
  kycStatus: KycStatus;
  joinDate: string;
  role: UserRole;
  activePlan: "Free" | "Silver Boost" | "Gold Pro";
  balance: number;
  location: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrls: string[];
  condition: ProductCondition;
  datePosted: string;
  status: AdStatus;
  isFeatured: boolean;
  isPremiumBoosted: boolean;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerRating: number;
  sellerVerified: boolean;
  sellerAvatar: string;
  views: number;
  clicks: number;
  offersCount: number;
  reported: boolean;
  reportCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  adId: string;
  adTitle: string;
  adPrice: number;
  adImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  onlineStatus?: "online" | "offline" | "away";
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "message" | "ad_status" | "price_drop" | "promo" | "offer";
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}

export interface Report {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  sellerName: string;
  reporterName: string;
  reason: "Fraud" | "Spam" | "Incorrect Category" | "Prohibited Item" | "Duplicate Listing";
  details: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  date: string;
}

export interface Offer {
  id: string;
  adId: string;
  adTitle: string;
  adPrice: number;
  buyerName: string;
  buyerId: string;
  offerPrice: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  date: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // matches lucide icon names
  count: number;
  bgGradient: string;
}
