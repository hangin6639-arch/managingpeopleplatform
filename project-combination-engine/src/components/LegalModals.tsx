/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-200">
              {type === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {type === 'terms' ? '서비스 이용약관 (Terms of Service)' : '개인정보 처리방침 (Privacy Policy)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                최종 개정일: 2026년 3월 1일 · Project Combination Engine Enterprise
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
          {type === 'terms' ? (
            <>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">제 1 조 (목적)</h3>
                <p>
                  본 약관은 Project Combination Engine(이하 "회사" 또는 "서비스")이 제공하는 전략적 인적자원 네트워크 분석 및 인재 조합 시뮬레이션 플랫폼의 이용조건 및 절차, 이용자와 회사의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">제 2 조 (데이터 소유권 및 격리 원칙)</h3>
                <p>
                  1. 이용자가 서비스 내에 등록하는 모든 인재 프로필, 네트워크 연결망 데이터 및 분석 메모는 전적으로 해당 계정 소유자의 자산입니다.
                </p>
                <p>
                  2. 회사는 이용자의 사전 동의 없이 회원의 개인 인재 네트워크 데이터를 제3자에게 판매하거나 타 사용자와 공유하지 않습니다.
                </p>
                <p>
                  3. 각 워크스페이스는 계정별로 암호화 격리 저장되어 상호 열람이 원천 차단됩니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">제 3 조 (이용자의 의무 및 보안 준수)</h3>
                <p>
                  1. 이용자는 타인의 명의나 이메일을 도용하여 가입할 수 없습니다.
                </p>
                <p>
                  2. 이용자는 네트워크 맵에 등록하는 인재 정보가 관련 법령(개인정보보호법 등)을 준수하도록 관리해야 하며, 비밀 유지 서약이 필요한 기밀 프로젝트 인력 정보는 적절한 접근 제어를 유지해야 합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">제 4 조 (서비스 연속성 및 백업)</h3>
                <p>
                  회사는 안정적인 데이터 유지 관리를 위해 데이터 내보내기/가져오기(JSON/Markdown) 기능을 제공하며, 이용자는 정기적인 로컬 백업을 수행할 수 있습니다.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">1. 수집하는 개인정보 항목</h3>
                <p>
                  • 회원가입 및 계정 관리: 성명, 회사 이메일, 소속 조직(기업/기관), 직책/전문분야, 비밀번호(단방향 암호화 저장)
                </p>
                <p>
                  • 서비스 이용 과정: 인재 프로필 노드, 관계선(Link), 태그 메타데이터, 접속 일시
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">2. 개인정보의 수집 및 이용 목적</h3>
                <p>
                  • 회원 식별 및 맞춤형 인재 네트워크 워크스페이스 제공
                </p>
                <p>
                  • AI 기반 인적 시너지 분석 엔진 및 조합 추천 기능 구동
                </p>
                <p>
                  • 부정 가입 방지 및 데이터 무단 접근 차단
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">3. 개인정보의 보유 및 파기 절차</h3>
                <p>
                  회원 탈퇴 시 또는 이용자가 계정 삭제를 요청하는 경우, 회사는 복구할 수 없는 방식으로 모든 인적자원 네트워크 데이터 및 개인정보를 지체 없이 영구 파기합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">4. 정보주체의 권리 행사</h3>
                <p>
                  이용자는 언제든지 프로필 관리 메뉴를 통해 본인의 정보를 열람, 수정하거나 계정을 전환 및 삭제할 권리가 있습니다.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-850/50 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>기업 표준 보안 프로토콜 및 데이터 거버넌스 준수</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
