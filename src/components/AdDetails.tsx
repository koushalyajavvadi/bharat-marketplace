/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, Share2, AlertTriangle, MessageCircle, Phone, 
  MapPin, Calendar, Eye, Compass, ThumbsUp, Send, ShieldCheck
} from "lucide-react";
import { Ad } from "../types";

interface AdDetailsProps {
  ad: Ad;
  onBack: () => void;
  onStartChat: (messageText: string) => void;
  onMakeOffer: (offerPrice: number) => void;
  onReportAd: (reason: string, details: string) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  relatedAds: Ad[];
  onSelectAd: (ad: Ad) => void;
}

export default function AdDetails({
  ad,
  onBack,
  onStartChat,
  onMakeOffer,
  onReportAd,
  isFavorited,
  onToggleFavorite,
  relatedAds,
  onSelectAd
}: AdDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [offerValue, setOfferValue] = useState("");
  const [startingMsg, setStartingMsg] = useState(`Hi ${ad.sellerName}, is this still available? I can offer ₹${(ad.price * 0.9).toLocaleString("en-IN")}.`);
  const [reportReason, setReportReason] = useState<any>("Fraud");
  const [reportDetails, setReportDetails] = useState("");
  
  // Modals / toggle screens
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [hasOffered, setHasOffered] = useState(false);
  const [showCallDetail, setShowCallDetail] = useState(false);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedOffer = Number(offerValue);
    if (!parsedOffer || parsedOffer <= 0) {
      alert("Please provide a valid price offer!");
      return;
    }
    onMakeOffer(parsedOffer);
    setHasOffered(true);
    setShowOfferModal(false);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails) {
      alert("Please describe the issue.");
      return;
    }
    onReportAd(reportReason, reportDetails);
    setHasReported(true);
    setShowReportModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 text-slate-100 select-none animate-fade-in max-w-6xl mx-auto w-full">
      {/* Top action header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          ← Browse Listings
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg border border-slate-800 transition-all cursor-pointer ${
              isFavorited ? "bg-red-500/10 text-red-500 border-red-500/30" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Shareable ad link copied to clipboard!");
            }}
            className="p-2 rounded-lg border border-slate-800 hover:text-white hover:bg-slate-900 text-slate-400 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-lg border border-slate-800 text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Gallery & Description (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Stage */}
          <div className="relative h-[280px] md:h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <img 
              src={ad.imageUrls[activeImageIndex]} 
              className="w-full h-full object-cover transition-all" 
              alt={ad.title} 
            />
            {ad.isFeatured && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider shadow shadow-amber-500/20">
                FEATURED
              </span>
            )}
            {ad.condition && (
              <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur text-slate-300 border border-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Condition: {ad.condition.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {ad.imageUrls.length > 1 && (
            <div className="flex gap-3">
              {ad.imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border transition-all ${
                    idx === activeImageIndex ? "border-amber-500 ring-2 ring-amber-500/15" : "border-slate-800"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Title Block */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-white">
                ₹ {ad.price.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ad.datePosted}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {ad.views + 12} views
                </span>
              </div>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
              {ad.title}
            </h1>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{ad.location}</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Product Description & Details
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {ad.description}
            </p>
          </div>

          {/* Interactive simulated maps placeholder */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Pickup Location Coordinates
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Approximate location of the seller</p>
              </div>
              <Compass className="w-4 h-4 text-amber-500" />
            </div>

            {/* Custom stylized vector SVG map mock */}
            <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
              <svg className="w-full h-full opacity-35" viewBox="0 0 400 150">
                <line x1="50" y1="0" x2="50" y2="150" stroke="#475569" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="150" stroke="#475569" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="150" stroke="#475569" strokeWidth="1" />
                <line x1="350" y1="0" x2="350" y2="150" stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="30" x2="400" y2="30" stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#475569" strokeWidth="1" />
                <circle cx="150" cy="90" r="30" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              {/* Glowing Map pin */}
              <div className="absolute flex flex-col items-center">
                <div className="p-1.5 bg-amber-500 rounded-full text-slate-950 shadow-lg shadow-amber-500/20 animate-bounce">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-extrabold text-slate-300 mt-1 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {ad.location.split(",")[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Seller & Actions (Span 1) */}
        <div className="space-y-6">
          {/* Seller Profile Card */}
          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider border-b border-slate-800/60 pb-2">
              Seller Profile
            </h3>
            
            <div className="flex items-center gap-3.5">
              <img src={ad.sellerAvatar} className="w-12 h-12 rounded-full object-cover border border-slate-800 shrink-0" alt="" />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {ad.sellerName}
                  {ad.sellerVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Member since 2025</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-amber-500 font-bold">★ {ad.sellerRating}</span>
                  <span className="text-[10px] text-slate-500">({ad.views > 200 ? "42" : "18"} ratings)</span>
                </div>
              </div>
            </div>

            {/* Seller Contact Quick Panel */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800/60">
              <button
                onClick={() => setShowCallDetail(!showCallDetail)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>{showCallDetail ? ad.sellerPhone : "Show Phone Number"}</span>
              </button>

              <button
                onClick={() => setShowOfferModal(true)}
                disabled={hasOffered}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{hasOffered ? "Offer Pending" : "Make Price Offer"}</span>
              </button>
            </div>
          </div>

          {/* Chat with Seller Instant Console */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Send Direct Message
            </h3>
            <textarea
              rows={3}
              value={startingMsg}
              onChange={(e) => setStartingMsg(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-amber-500"
            ></textarea>
            <button
              onClick={() => onStartChat(startingMsg)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-amber-500/5 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Initiate Chat Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar products listings feed */}
      {relatedAds.length > 0 && (
        <div className="mt-12 space-y-5 border-t border-slate-900 pt-8">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">
            Similar items you might appreciate
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedAds.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectAd(rel)}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all group flex flex-col"
              >
                <div className="h-32 bg-slate-850 overflow-hidden relative">
                  <img src={rel.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-black text-white">₹ {rel.price.toLocaleString("en-IN")}</p>
                    <h4 className="text-[11px] text-slate-300 line-clamp-1 mt-1 font-medium">{rel.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    {rel.location.split(",")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 animate-fade-in shadow-2xl select-none">
            <h4 className="text-sm font-bold text-white">Submit Price Offer</h4>
            <p className="text-xs text-slate-400">
              Suggest an alternative price to <strong>{ad.sellerName}</strong>. Original Listing Price is: <strong>₹ {ad.price.toLocaleString("en-IN")}</strong>.
            </p>
            <form onSubmit={handleSendOffer} className="space-y-3.5">
              <input
                type="number"
                required
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                placeholder="Suggest your offer price (e.g. 82000)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 text-xs font-semibold rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Ad Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 animate-fade-in shadow-2xl select-none">
            <h4 className="text-sm font-bold text-white">Report Listing for Moderation</h4>
            <p className="text-xs text-slate-400">
              Is this item a scam, duplicate, or miscategorized? Let our admin moderators know immediately.
            </p>
            <form onSubmit={handleSendReport} className="space-y-3.5">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Fraud">Fraud / Fake Listing</option>
                <option value="Spam">Spam / Excessive promotion</option>
                <option value="Incorrect Category">Incorrect Category</option>
                <option value="Prohibited Item">Prohibited / Restricted Item</option>
                <option value="Duplicate Listing">Duplicate Listing</option>
              </select>
              <textarea
                required
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide details about why you are reporting this ad..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
              ></textarea>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 text-xs font-semibold rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
                >
                  File Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success feedbacks */}
      {hasReported && (
        <div className="mt-4 p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>This listing has been reported to administrators and will undergo review. Thank you for keeping Bharat Marketplace safe.</span>
        </div>
      )}
    </div>
  );
}
