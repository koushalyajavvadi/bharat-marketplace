/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, CheckCircle, XCircle, AlertTriangle, Users, 
  TrendingUp, BarChart3, Database, Shield, Check, Trash, Eye, MapPin
} from "lucide-react";
import { Ad, AdStatus, Report, User, KycStatus } from "../types";

interface AdminPanelProps {
  ads: Ad[];
  reports: Report[];
  users: User[];
  onApproveAd: (id: string) => void;
  onRejectAd: (id: string) => void;
  onDeleteAd: (id: string) => void;
  onVerifyUser: (id: string) => void;
  onBlockUser: (id: string, block: boolean) => void;
  onResolveReport: (id: string, action: "RESOLVED" | "DISMISSED") => void;
}

export default function AdminPanel({
  ads,
  reports,
  users,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onVerifyUser,
  onBlockUser,
  onResolveReport
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "moderation" | "users" | "reports" | "analytics">("dashboard");

  // Metrics calculations
  const pendingAds = ads.filter(a => a.status === AdStatus.PENDING);
  const liveAds = ads.filter(a => a.status === AdStatus.APPROVED);
  const flaggedAds = ads.filter(a => a.reported === true);
  const totalVerifiedSellers = users.filter(u => u.isVerified).length;
  
  // Custom Analytics Chart Calculations
  const categoryCounts: Record<string, number> = {};
  ads.forEach(ad => {
    categoryCounts[ad.category] = (categoryCounts[ad.category] || 0) + 1;
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Sub Header / Tab Bar */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500 animate-pulse" />
          <h2 className="text-sm font-extrabold text-white tracking-wider uppercase">
            Platform Moderation Suite
          </h2>
        </div>
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: "dashboard", label: "Overview", icon: BarChart3 },
            { id: "moderation", label: `Verify Ads (${pendingAds.length})`, icon: ShieldAlert },
            { id: "users", label: "Users & KYC", icon: Users },
            { id: "reports", label: `Reports (${reports.filter(r => r.status === "PENDING").length})`, icon: AlertTriangle },
            { id: "analytics", label: "Revenue & Sales", icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Metrics Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Active Ads</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{liveAds.length}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Live in regional listings</p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Awaiting Verification</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">{pendingAds.length}</p>
                  <p className="text-[9px] text-slate-400 mt-1">AI Trust checked</p>
                </div>
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Platform Users</p>
                  <p className="text-2xl font-black text-blue-400 mt-1">{users.length}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{totalVerifiedSellers} KYC Verified</p>
                </div>
                <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Urgent Fraud Reports</p>
                  <p className="text-2xl font-black text-red-500 mt-1">
                    {reports.filter(r => r.status === "PENDING").length}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">Requiring direct review</p>
                </div>
                <div className="p-2.5 bg-red-500/10 rounded-lg text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* AI Moderation Note */}
            <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded-xl flex gap-3">
              <Database className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Content Guard Active</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every posting is automatically matched using Gemini embeddings against suspicious duplicates and pricing anomalies. 
                  Below, check the <strong>Verify Ads</strong> queue to inspect model trust calculations.
                </p>
              </div>
            </div>

            {/* Platform Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown (Beautiful SVG bar visual) */}
              <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                  Distribution of Live listings
                </h3>
                <div className="space-y-3.5">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const percentage = Math.min(100, Math.round((count / ads.length) * 100));
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">{cat}</span>
                          <span className="text-slate-400">{count} ads ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Server activity simulation */}
              <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                    System Moderation Speed Logs
                  </h3>
                  <p className="text-[10px] text-slate-500">Real-time status updates from safety hooks</p>
                </div>
                <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 space-y-1.5 max-h-48 overflow-y-auto">
                  <p>[INFO] 00:24:12 - Ad security check: ad1 cleared. trust_score=98/100</p>
                  <p>[INFO] 00:24:25 - New Ad submitted. Dispatching moderation queue thread...</p>
                  <p>[INFO] 00:24:26 - Gemini moderate callback payload success.</p>
                  <p className="text-amber-400">[WARN] 00:24:26 - Ad 'ad_pending_1' flagged for manual verification: trust_score=85/100</p>
                  <p>[INFO] 00:25:01 - Cleaning expired sessions... 0 found.</p>
                  <p>[INFO] 00:25:30 - Scheduled statistics sync complete.</p>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  <span>Server latency: <strong className="text-emerald-400">42ms</strong></span>
                  <span>Safety status: <strong className="text-emerald-400">100% Secure</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Verify Ads Pending moderation */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Pending Safety Queue</h3>
            {pendingAds.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No ads awaiting verification. Safe & sound!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingAds.map((ad) => {
                  // Mock trust scoring based on title length
                  const isScamSuspect = ad.price < 500 && (ad.title.toLowerCase().includes("iphone") || ad.title.toLowerCase().includes("camera"));
                  const trustScore = isScamSuspect ? 18 : 88;

                  return (
                    <div key={ad.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between gap-5">
                      <div className="flex gap-4">
                        <img src={ad.imageUrls[0]} className="w-24 h-24 rounded-lg object-cover border border-slate-800 shrink-0" alt="" />
                        <div className="space-y-1.5">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                            {ad.category}
                          </span>
                          <h4 className="text-sm font-bold text-white">{ad.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ad.description}</p>
                          <div className="flex gap-4 text-xs">
                            <span className="text-amber-500 font-extrabold">₹ {ad.price.toLocaleString("en-IN")}</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {ad.location}
                            </span>
                            <span className="text-slate-500">Seller: {ad.sellerName}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI trust analysis feedback panel */}
                      <div className="md:w-64 shrink-0 bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Guard Score</span>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                              trustScore > 70 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}>
                              {trustScore}% Trust
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${trustScore > 70 ? "bg-emerald-500" : "bg-red-500"}`}
                              style={{ width: `${trustScore}%` }}
                            ></div>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-2 leading-tight">
                            {trustScore > 70 
                              ? "✓ Content analysis suggests highly trustworthy seller proposal."
                              : "⚠️ ALERT: Pricing discrepancy detected. Verify authenticity before approving!"}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                          <button
                            onClick={() => onApproveAd(ad.id)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectAd(ad.id)}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black rounded text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Users & KYC */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Registered Users & KYC Status</h3>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">KYC Security Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-800" alt="" />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-500">Joined: {u.joinDate}</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <p>{u.email}</p>
                        <p className="text-[10px] text-slate-500">{u.phone}</p>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {u.location}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isVerified 
                            ? "bg-emerald-500/20 text-emerald-400"
                            : u.kycStatus === KycStatus.PENDING 
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-800 text-slate-400"
                        }`}>
                          {u.isVerified ? "KYC VERIFIED" : u.kycStatus === KycStatus.PENDING ? "AWAITING REVIEW" : "UNVERIFIED"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {u.kycStatus === KycStatus.PENDING && !u.isVerified && (
                          <button
                            onClick={() => onVerifyUser(u.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] transition-colors"
                          >
                            Verify KYC
                          </button>
                        )}
                        <button
                          onClick={() => onBlockUser(u.id, u.isVerified)} // Simulate toggling verify / block
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 text-red-400 font-bold rounded text-[10px] transition-colors"
                        >
                          Block Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Reports */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Platform Fraud & Abuse Reports</h3>
            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Perfect! No safety reports on catalog listings.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map((r) => (
                  <div key={r.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex gap-4">
                      <img src={r.adImage} className="w-16 h-16 rounded object-cover border border-slate-800 shrink-0" alt="" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black">
                            {r.reason}
                          </span>
                          <span className="text-xs text-slate-500">Ad ID: {r.adId}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">Listing: {r.adTitle}</h4>
                        <p className="text-[11px] text-slate-400 italic">" {r.details} "</p>
                        <p className="text-[10px] text-slate-500">
                          Reported by: <strong>{r.reporterName}</strong> | Seller: <strong>{r.sellerName}</strong> | Date: {r.date}
                        </p>
                      </div>
                    </div>

                    <div className="md:w-48 shrink-0 flex flex-col justify-between items-end gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        r.status === "PENDING" ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {r.status}
                      </span>
                      {r.status === "PENDING" && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => onResolveReport(r.id, "RESOLVED")}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black rounded text-[10px] text-center"
                          >
                            Remove Ad
                          </button>
                          <button
                            onClick={() => onResolveReport(r.id, "DISMISSED")}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded text-[10px] text-center"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Analytics & Payments */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-200">Business Revenue & Premium Plans</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Ads Revenue</p>
                <p className="text-2xl font-black text-amber-500 mt-1">₹ 2,45,400</p>
                <p className="text-[9px] text-slate-400 mt-1">From premium boosts & highlights</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Plan Subscribers</p>
                <p className="text-2xl font-black text-blue-400 mt-1">342 sellers</p>
                <p className="text-[9px] text-slate-400 mt-1">12% growth month-over-month</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Successful Handover Trades</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">1,240+</p>
                <p className="text-[9px] text-slate-400 mt-1">Self-reported by buyers and sellers</p>
              </div>
            </div>

            {/* Custom SVG Spline Wave Line Chart representing daily revenue growth */}
            <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Monthly Revenue Analytics Curve (2026)
                  </h4>
                  <p className="text-[10px] text-slate-500">Cumulative platform earnings in INR (₹)</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  📈 Target ₹3.5L Achieved
                </span>
              </div>

              {/* Styled SVG Spline Graph */}
              <div className="relative h-44 w-full">
                <svg className="w-full h-full" viewBox="0 0 600 150" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#1E293B" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="600" y2="110" stroke="#1E293B" strokeDasharray="3 3" />
                  
                  {/* Area fill under curve with gradient */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Curve Path */}
                  <path 
                    d="M 0 130 Q 100 120 150 90 T 300 75 T 450 40 T 600 15 L 600 150 L 0 150 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  <path 
                    d="M 0 130 Q 100 120 150 90 T 300 75 T 450 40 T 600 15" 
                    stroke="#F59E0B" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Highlight Dots */}
                  <circle cx="150" cy="90" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="300" cy="75" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="450" cy="40" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="600" cy="15" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                </svg>
                
                {/* Horizontal Labels */}
                <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 px-1">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun (Live)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
