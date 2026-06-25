/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Smartphone, Laptop, Tablet, Wifi, Battery, Signal, ArrowLeft, MoreVertical, ShieldAlert } from "lucide-react";

export type ViewMode = "desktop" | "android" | "ios";

interface DeviceFrameProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  children: React.ReactNode;
}

export default function DeviceFrame({ viewMode, setViewMode, children }: DeviceFrameProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Banner Control Panel */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-bold tracking-wider text-sm flex items-center gap-1 shadow-md shadow-emerald-600/10">
            <span>BHARAT</span>
            <span className="text-[10px] bg-white text-emerald-700 px-1 py-0.2 rounded font-extrabold">MP</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Bharat Marketplace
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                Prototype Studio v1.2
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Interactive multi-platform layout engine (Responsive Web + iOS + Android)
            </p>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            id="btn-view-desktop"
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "desktop"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop Web</span>
          </button>
          <button
            id="btn-view-android"
            onClick={() => setViewMode("android")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "android"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
            <span className="hidden sm:inline">Android App</span>
          </button>
          <button
            id="btn-view-ios"
            onClick={() => setViewMode("ios")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "ios"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">iOS App</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex justify-center items-center p-3 md:p-6 overflow-x-hidden">
        {viewMode === "desktop" ? (
          <div className="w-full max-w-7xl mx-auto min-h-[85vh] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all">
            {children}
          </div>
        ) : viewMode === "android" ? (
          /* Android Device Frame */
          <div className="relative w-[380px] h-[780px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 dark:border-slate-700 flex flex-col overflow-hidden transition-all animate-fade-in ring-12 ring-slate-900/10">
            {/* Camera Cutout */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full z-50 border-2 border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
            </div>

            {/* Android Status Bar */}
            <div className="h-7 px-6 pt-1 flex justify-between items-center bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[11px] font-medium z-40 select-none">
              <span>12:30</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                <Signal className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 rotate-90 origin-center text-slate-700 dark:text-slate-300" />
              </div>
            </div>

            {/* Simulated Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-950 overflow-y-auto overflow-x-hidden relative flex flex-col rounded-b-2xl rounded-t-lg">
              {children}
            </div>

            {/* Android Navigation Bar */}
            <div className="h-10 bg-slate-100 dark:bg-slate-900 flex justify-around items-center text-slate-500 dark:text-slate-400 px-10 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 z-40">
              <button className="p-1 hover:text-slate-800 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="w-3.5 h-3.5 rounded-full border-2 border-current hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"></button>
              <button className="w-3.5 h-3.5 border-2 border-current rounded-sm rotate-45 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"></button>
            </div>
          </div>
        ) : (
          /* iOS Device Frame */
          <div className="relative w-[375px] h-[780px] bg-slate-950 rounded-[48px] p-2.5 shadow-2xl border-4 border-slate-800 dark:border-slate-700 flex flex-col overflow-hidden transition-all">
            {/* Dynamic Island Notch */}
            <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-50 flex items-center justify-between px-3.5 select-none shadow-lg">
              <div className="w-2.5 h-2.5 bg-blue-950 rounded-full border border-slate-900"></div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest scale-90">LIVE</span>
              </div>
            </div>

            {/* iOS Status Bar */}
            <div className="h-9 px-6 pt-2 flex justify-between items-center bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[11px] font-semibold z-40 select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <span className="text-[9px] font-bold tracking-tighter">5G</span>
                <Battery className="w-4 h-4 text-slate-800 dark:text-slate-100" />
              </div>
            </div>

            {/* Simulated Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-950 overflow-y-auto overflow-x-hidden relative flex flex-col rounded-b-3xl rounded-t-xl">
              {children}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="h-6 bg-slate-100 dark:bg-slate-900 flex justify-center items-center z-40 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="w-32 h-1 bg-slate-800 dark:bg-slate-400 rounded-full"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
