/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, HelpCircle, CheckCircle, ShieldAlert, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";
import { ProductCondition } from "../types";
import { MOCK_CATEGORIES } from "../data";

interface AdFormsProps {
  onAdCreated: (newAd: any) => void;
  onCancel: () => void;
}

export default function AdForms({ onAdCreated, onCancel }: AdFormsProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Cars");
  const [condition, setCondition] = useState<ProductCondition>(ProductCondition.NEW);
  const [imageLink, setImageLink] = useState("");
  const [keywords, setKeywords] = useState("");

  // AI states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiCategorizing, setIsAiCategorizing] = useState(false);
  const [isAiModerating, setIsAiModerating] = useState(false);
  
  const [moderationResult, setModerationResult] = useState<{
    isApproved: boolean;
    reason: string;
    trustScore: number;
    isDuplicate: boolean;
  } | null>(null);

  // Preset image generator mapping based on category
  const getPresetImage = (cat: string) => {
    switch (cat) {
      case "Cars": return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
      case "Bikes": return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80";
      case "Mobile Phones": return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
      case "Electronics": return "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80";
      case "Furniture": return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
      case "Fashion": return "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80";
      case "Books": return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80";
      case "Real Estate": return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
      default: return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
    }
  };

  const handleAiAutoWrite = async () => {
    if (!title) {
      alert("Please provide at least a short title (e.g. 'OnePlus 11 5G') first so Gemini has enough context!");
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, condition, category, keywords })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Connection timeout while contacting Gemini API.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSuggestCategory = async () => {
    if (!title) {
      alert("Please enter a title first!");
      return;
    }
    setIsAiCategorizing(true);
    try {
      const res = await fetch("/api/ai/suggest-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (data.category) {
        // Find matching category in our preset list
        const matchedCat = MOCK_CATEGORIES.find(c => c.name.toLowerCase() === data.category.toLowerCase() || data.category.toLowerCase().includes(c.id));
        if (matchedCat) {
          setCategory(matchedCat.name);
        } else {
          setCategory(data.category);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiCategorizing(false);
    }
  };

  const handleAiModerationCheck = async () => {
    if (!title || !price) {
      alert("Title and Price are required to run an AI safety analysis!");
      return;
    }

    setIsAiModerating(true);
    setModerationResult(null);

    try {
      const res = await fetch("/api/ai/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price: Number(price) })
      });
      const data = await res.json();
      setModerationResult(data);
    } catch (err) {
      console.error(err);
      alert("Error contacting the AI safety agent.");
    } finally {
      setIsAiModerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) {
      alert("Please fill in Title, Price, and Description.");
      return;
    }

    const finalImage = imageLink || getPresetImage(category);

    onAdCreated({
      title,
      description,
      price: Number(price),
      category,
      condition,
      imageUrls: [finalImage]
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 text-slate-100 select-none animate-fade-in max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="p-1 bg-amber-500 rounded text-slate-950 font-extrabold text-xs">NEW</span>
            Post Ad Listing
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Publish your asset safely. Use our integrated Gemini AI assistant to optimize content.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Ad Title Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-300">Listing Title *</label>
            <button
              type="button"
              id="btn-suggest-category"
              onClick={handleSuggestCategory}
              disabled={isAiCategorizing || !title}
              className="text-[10px] text-amber-500 font-bold hover:underline flex items-center gap-1 disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{isAiCategorizing ? "Suggesting..." : "Suggest Category with AI"}</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. iPhone 14 Pro Max 256GB Gold, pristine condition"
            className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Pricing, Category, Condition block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Price (INR ₹) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 54000"
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              {MOCK_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Product Condition *</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value={ProductCondition.NEW}>Brand New (Unused)</option>
              <option value={ProductCondition.USED_LIKE_NEW}>Used (Like New)</option>
              <option value={ProductCondition.USED_GOOD}>Used (Good Condition)</option>
              <option value={ProductCondition.USED_FAIR}>Used (Fair Condition)</option>
            </select>
          </div>
        </div>

        {/* AI Description Panel */}
        <div className="p-4 bg-amber-950/10 border border-amber-900/35 rounded-2xl space-y-3.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Gemini AI Copywriting Assistant
            </span>
            <button
              type="button"
              id="btn-ai-autowrite"
              onClick={handleAiAutoWrite}
              disabled={isAiGenerating || !title}
              className="px-3 py-1.5 bg-amber-500 disabled:opacity-50 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 hover:bg-amber-400 shadow shadow-amber-500/10"
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Writing...
                </>
              ) : "AI Auto-Write Description"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. 1 year warranty, minor scratch on corner, includes bill"
              className="bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-slate-400 flex items-center leading-normal">
              Enter any specific details/keywords above, then click 'AI Auto-Write' to generate a SEO-friendly description automatically!
            </p>
          </div>
        </div>

        {/* Ad Description input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Detailed Description *</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell buyers about your item's specs, condition, or negotiable details..."
            className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-sans"
          ></textarea>
        </div>

        {/* Custom Image Link input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Custom Image Link (Optional)</label>
          <input
            type="url"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="e.g. https://images.unsplash.com/... (Leaves blank for premium default template)"
            className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* AI Moderation & Submission Panel */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Fraud Prevention Shield</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Pre-evaluate your proposal before publishing to see the trust and moderation score.
            </p>
          </div>
          
          <button
            type="button"
            id="btn-ai-moderation"
            onClick={handleAiModerationCheck}
            disabled={isAiModerating}
            className="px-4 py-2 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 text-slate-300 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
          >
            {isAiModerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : "Pre-check with AI Guard"}
          </button>
        </div>

        {/* Live Moderation Output Result */}
        {moderationResult && (
          <div className={`p-4 rounded-xl border text-xs leading-normal animate-fade-in flex gap-3 ${
            moderationResult.isApproved 
              ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-300"
              : "bg-red-950/10 border-red-900/40 text-red-300"
          }`}>
            <div className="shrink-0">
              {moderationResult.isApproved ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider">
                  AI Guard Report: {moderationResult.isApproved ? "Approved" : "Flagged"}
                </span>
                <span className={`px-1.5 py-0.2 rounded font-black ${
                  moderationResult.trustScore > 70 ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}>
                  {moderationResult.trustScore}% Trust Score
                </span>
              </div>
              <p className="text-slate-300">{moderationResult.reason}</p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-900">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btn-submit-ad-form"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-105 active:scale-95 text-slate-950 text-xs font-black rounded-xl tracking-wider uppercase shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
          >
            Publish Ad Listing
          </button>
        </div>

      </form>
    </div>
  );
}
