/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { PeopleDirectory } from './components/PeopleDirectory';
import { NetworkGraph } from './components/NetworkGraph';
import { DataStudio } from './components/DataStudio';
import { AddNodeModal } from './components/AddNodeModal';
import { BottomSheet } from './components/BottomSheet';
import { GraphManager } from './components/GraphManager';
import { UserProfileMenu } from './components/UserProfileMenu';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { 
  Users, 
  Share2, 
  Database, 
  Sun, 
  Moon, 
  ShieldCheck
} from 'lucide-react';

function MainAppShell() {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    nodes, 
    links 
  } = useNetwork();
  
  const { currentUser } = useAuth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-200 font-sans antialiased transition-colors duration-300 flex flex-col justify-between">
      
      <div className="flex flex-col flex-grow">
        {/* 1. Toss Style Premium Top Navigation Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-6 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-300">
          
          {/* Left branding */}
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-toss-blue rounded-xl flex items-center justify-center text-white shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  Project Combination Engine
                </h1>
                <span className="bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-toss-blue tracking-wide">
                  Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Right controller buttons with User Profile & Workspace switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Active Network Selector Dropdown */}
            <GraphManager />

            {/* Active Counters Indicator Grid */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-100 dark:bg-zinc-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-toss-blue rounded-full"></span>
                <span>인물 <strong className="text-slate-900 dark:text-zinc-100 font-mono">{nodes.length}</strong>명</span>
              </div>
              <div className="h-2.5 w-px bg-slate-200 dark:bg-zinc-700"></div>
              <div>
                <span>관계망 <strong className="text-slate-900 dark:text-zinc-100 font-mono">{links.length}</strong>개</span>
              </div>
            </div>

            {/* Theme switcher (Light / Black Mode) */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-850 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer transition-colors shadow-2xs"
              title={theme === 'light' ? '블랙 모드로 전환' : '라이트 모드로 전환'}
              aria-label={theme === 'light' ? '블랙 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[11px] font-medium hidden sm:inline">블랙</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium hidden sm:inline">라이트</span>
                </>
              )}
            </button>

            {/* User Profile Menu & Auth Controller */}
            <div className="border-l border-slate-200 dark:border-zinc-800 pl-3">
              <UserProfileMenu onOpenAuthModal={handleOpenAuth} />
            </div>
          </div>
        </header>

        {/* 2. Toss Floating Segmented Tab Switcher Panel */}
        <div className="w-full max-w-4xl mx-auto px-6 pt-5 mb-1">
          <div className="flex items-center bg-slate-200/70 dark:bg-zinc-900 border-none p-1 rounded-2xl max-w-md shadow-xs transition-colors duration-300">
            
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-white dark:bg-zinc-800 text-toss-blue shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>인재 풀</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'network'
                  ? 'bg-white dark:bg-zinc-800 text-toss-blue shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>네트워크 맵</span>
            </button>

            <button
              onClick={() => setActiveTab('import-export')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'import-export'
                  ? 'bg-white dark:bg-zinc-800 text-toss-blue shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>데이터 스튜디오</span>
            </button>

          </div>
        </div>

        {/* 3. Main Workspace Segment wrapper */}
        <main className="flex-grow px-4 sm:px-6 py-4 w-full max-w-7xl mx-auto">
          {activeTab === 'directory' && (
            <PeopleDirectory onOpenAddModal={() => setIsAddModalOpen(true)} />
          )}
          {activeTab === 'network' && (
            <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <NetworkGraph />
            </div>
          )}
          {activeTab === 'import-export' && (
            <DataStudio />
          )}
        </main>
      </div>

      {/* Corporate Compliance & Legal Footer */}
      <Footer />

      {/* Modals & Overlay Layers */}
      <AddNodeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BottomSheet />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
      
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <MainAppShell />
      </NetworkProvider>
    </AuthProvider>
  );
}
