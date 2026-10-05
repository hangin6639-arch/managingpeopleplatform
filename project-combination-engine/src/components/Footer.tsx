/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Activity, FileText, Lock, Globe } from 'lucide-react';
import { LegalModals } from './LegalModals';

export const Footer: React.FC = () => {
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <>
      <footer className="w-full bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 py-6 px-6 mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          
          {/* Left info & company meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-toss-blue font-bold text-[10px]">
                CE
              </div>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                Project Combination Engine
              </span>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                v2.5 Enterprise
              </span>
            </div>

            <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-zinc-700"></div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              전략적 인적자원 네트워크 분석 및 다차원 인재 시너지 매핑 시스템
            </p>
          </div>

          {/* Right compliance, security & legal triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>시스템 정상 가동 중</span>
            </div>

            <button
              onClick={() => setLegalModalType('terms')}
              className="hover:text-slate-900 dark:hover:text-zinc-200 hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              서비스 이용약관
            </button>

            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-slate-900 dark:hover:text-zinc-200 hover:underline underline-offset-2 transition-colors cursor-pointer font-semibold"
            >
              개인정보처리방침
            </button>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-500">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>로컬 샌드박스 암호화</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="max-w-7xl mx-auto pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-zinc-500">
          <p>© 2026 Project Combination Engine Inc. All rights reserved. Registered Enterprise Talent Platform.</p>
          <p>개인 맞춤형 격리 워크스페이스 세션 기반 구동</p>
        </div>
      </footer>

      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
};
