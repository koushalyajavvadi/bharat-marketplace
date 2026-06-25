/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, Network, Terminal, Server, FolderTree, Key, Layers, Send } from "lucide-react";

export default function DbExplorer() {
  const [activeView, setActiveView] = useState<"schema" | "api" | "folders">("schema");
  const [selectedApi, setSelectedApi] = useState<string>("get_ads");
  const [apiResponse, setApiResponse] = useState<string>("// Click 'Send Request' to query the live backend API...");
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Folder structure schema
  const productionFolderTree = [
    { name: "bharat-marketplace-monorepo/", type: "dir", desc: "Root multi-package monorepo workspace" },
    { name: "  apps/", type: "dir", desc: "Client & Admin frontends" },
    { name: "    web-app/           [Next.js + Tailwind]", type: "file", desc: "SEO-friendly responsive desktop/tablet web application" },
    { name: "    mobile-app/        [React Native / Expo]", type: "file", desc: "Native Android & iOS applications targeting Google Play & App Store" },
    { name: "    admin-portal/      [Vite + React]", type: "file", desc: "Internal monitoring, KYC and safety moderation dashboard" },
    { name: "  packages/", type: "dir", desc: "Shared workspace modules" },
    { name: "    common-types/      [TypeScript]", type: "file", desc: "Domain entities, DTOs, and validation schemas" },
    { name: "    ui-library/        [Tailwind + Radix]", type: "file", desc: "Material & Cupertino styled shared component primitives" },
    { name: "  services/", type: "dir", desc: "Backend infrastructure" },
    { name: "    api-gateway/       [NestJS]", type: "file", desc: "Entry point router, rate limiter, and JWT authentication token parser" },
    { name: "    chat-service/      [Node.js + Socket.IO]", type: "file", desc: "Real-time state engine, message queuing, and push notifications" },
    { name: "    moderation-worker/ [Python / FastAPI]", type: "file", desc: "Gemini AI model integration for real-time safety classification" },
    { name: "  infra/", type: "dir", desc: "Deployment & Orchestration" },
    { name: "    docker-compose.yml", type: "file", desc: "Local multi-container development configuration" },
    { name: "    firestore.rules", type: "file", desc: "Durable cloud collection security permissions definitions" }
  ];

  // API Catalog
  const API_CATALOG = [
    {
      id: "get_ads",
      method: "GET",
      path: "/api/ads",
      desc: "Retrieve all regional product listings matching search queries and filters.",
      params: "Query: category, minPrice, maxPrice, condition, city"
    },
    {
      id: "get_me",
      method: "GET",
      path: "/api/user/me",
      desc: "Fetch currently authenticated user profile session context.",
      params: "Headers: Authorization: Bearer <JWT>"
    },
    {
      id: "get_chats",
      method: "GET",
      path: "/api/chats",
      desc: "Fetch direct conversation threads for the current buyer or seller session.",
      params: "None"
    },
    {
      id: "ai_describe",
      method: "POST",
      path: "/api/ai/describe",
      desc: "Utilize Google Gemini Pro to auto-write a search-optimized product copy.",
      params: "Body: { title, condition, category, keywords }"
    }
  ];

  const handleRunApi = async () => {
    setIsLoadingApi(true);
    setApiResponse("// Fetching response from live full-stack container server...");

    let endpoint = "/api/ads";
    let options: RequestInit = { method: "GET" };

    if (selectedApi === "get_me") {
      endpoint = "/api/user/me";
    } else if (selectedApi === "get_chats") {
      endpoint = "/api/chats";
    } else if (selectedApi === "ai_describe") {
      endpoint = "/api/ai/describe";
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Sony WH-1000XM4 Noise Cancelling Headphones",
          condition: "USED_LIKE_NEW",
          category: "Electronics",
          keywords: "ANC, 30 hours battery, original bill"
        })
      };
    }

    try {
      const res = await fetch(endpoint, options);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: "Failed to connect to backend: " + err.message }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Tab bar */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-2 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Architectural blueprint explorer
          </h2>
        </div>
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveView("schema")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              activeView === "schema" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Database Schema (ERD)
          </button>
          <button
            onClick={() => setActiveView("api")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              activeView === "api" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            API Gateway Sandbox
          </button>
          <button
            onClick={() => setActiveView("folders")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              activeView === "folders" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Folder Architecture
          </button>
        </div>
      </div>

      {/* Main viewport */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Schema view */}
        {activeView === "schema" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">PostgreSQL + Redis Relational Database Models</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Optimized primary keys, indices, and foreign constraint mappings</p>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/20">
                Active Cluster: PostgreSQL 16.2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Users Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Table: users
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">5 columns</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-amber-400">
                    <span>id (PK)</span>
                    <span>VARCHAR(36)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>email (UNIQUE)</span>
                    <span>VARCHAR(100)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>name</span>
                    <span>VARCHAR(50)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>phone</span>
                    <span>VARCHAR(15)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>avatar</span>
                    <span>TEXT</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>role</span>
                    <span>ENUM('USER', 'ADMIN')</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>is_verified</span>
                    <span>BOOLEAN</span>
                  </div>
                </div>
              </div>

              {/* Ads Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Table: ads
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">11 columns</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-amber-400">
                    <span>id (PK)</span>
                    <span>VARCHAR(36)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-blue-400">
                    <span>seller_id (FK)</span>
                    <span>VARCHAR(36) → users.id</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>title</span>
                    <span>VARCHAR(100)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>description</span>
                    <span>TEXT</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>price</span>
                    <span>NUMERIC(12, 2)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>category</span>
                    <span>VARCHAR(30)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-slate-300">
                    <span>status</span>
                    <span>ENUM('PENDING', 'APPROVED')</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>is_featured</span>
                    <span>BOOLEAN</span>
                  </div>
                </div>
              </div>

              {/* Chats Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Table: chats
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">4 columns</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-amber-400">
                    <span>id (PK)</span>
                    <span>VARCHAR(36)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-blue-400">
                    <span>ad_id (FK)</span>
                    <span>VARCHAR(36) → ads.id</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-blue-400">
                    <span>buyer_id (FK)</span>
                    <span>VARCHAR(36) → users.id</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1 text-blue-400">
                    <span>seller_id (FK)</span>
                    <span>VARCHAR(36) → users.id</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>last_message</span>
                    <span>TEXT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Constraints & Indexes details */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Database Optimization Indices:</h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li><strong className="text-slate-300">IDX_ADS_CATEGORY_PRICE:</strong> Compound index on <code className="bg-slate-950 px-1 py-0.5 rounded text-[10px] text-amber-500">category, price</code> for ultra-fast catalog filter execution.</li>
                <li><strong className="text-slate-300">IDX_ADS_SPATIAL_LOCATION:</strong> GIS Index mapping geographical coordinates for regional search range queries.</li>
                <li><strong className="text-slate-300">REDIS CACHE (MESSAGES):</strong> Fast transient cache logging online/offline events and message unread counts.</li>
              </ul>
            </div>
          </div>
        )}

        {/* API Sandbox View */}
        {activeView === "api" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Console list */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">REST API Gateway Console</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Simulate actual HTTP endpoints running inside this fullstack container</p>
              </div>

              <div className="space-y-2.5">
                {API_CATALOG.map((api) => (
                  <button
                    key={api.id}
                    onClick={() => {
                      setSelectedApi(api.id);
                      setApiResponse("// Click 'Send Request' to query the live backend API...");
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                      selectedApi === api.id
                        ? "bg-slate-900 border-amber-500 shadow-md shadow-amber-500/5"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        api.method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {api.method}
                      </span>
                      <code className="text-xs text-white font-mono">{api.path}</code>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{api.desc}</p>
                    <p className="text-[9px] text-slate-500 font-mono italic">{api.params}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunApi}
                disabled={isLoadingApi}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{isLoadingApi ? "Running query..." : "Send Sandbox Request"}</span>
              </button>
            </div>

            {/* Right JSON codeblock preview */}
            <div className="flex flex-col bg-[#080E1A] border border-slate-800 rounded-2xl overflow-hidden min-h-[350px]">
              <div className="bg-slate-900/60 px-4 py-2 flex items-center justify-between border-b border-slate-800 shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  API Gateway Output
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">STATUS: 200 OK</span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-[11px] text-slate-300 whitespace-pre leading-relaxed scrollbar-thin">
                {apiResponse}
              </div>
            </div>
          </div>
        )}

        {/* Folder Structure layout */}
        {activeView === "folders" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Production Monorepo Folder Structure</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Scale-ready file layout mapping microfrontends and nestjs cloud backends</p>
            </div>

            <div className="bg-[#080E1A] border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300 space-y-1.5">
              {productionFolderTree.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-slate-900 pb-1">
                  <span className={`${item.type === "dir" ? "text-amber-500 font-bold" : "text-blue-400"}`}>
                    {item.name}
                  </span>
                  <span className="text-slate-500 text-[10px] italic">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
