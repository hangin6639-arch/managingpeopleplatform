/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  ArrowRight,
  Shield,
  Users
} from 'lucide-react';
import { LegalModals } from './LegalModals';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { login, signup, quickLogin, registeredUsers, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '비어있음', color: 'bg-slate-200 dark:bg-zinc-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: '취약', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: '보통', color: 'bg-amber-500' };
    if (score >= 3) return { score: 3, label: '안전', color: 'bg-emerald-500' };
    return { score: 1, label: '취약', color: 'bg-rose-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
        return;
      }

      const res = await login(email, password, rememberMe);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || '로그인에 실패했습니다.');
      }
    } else {
      // Sign up validation
      if (!name.trim()) {
        setErrorMessage('성명을 입력해주세요.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('유효한 회사 이메일 주소를 입력해주세요.');
        return;
      }
      if (!organization.trim()) {
        setErrorMessage('소속 회사 또는 기관명을 입력해주세요.');
        return;
      }
      if (!role.trim()) {
        setErrorMessage('담당 직책 또는 전문 분야를 입력해주세요.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('비밀번호는 최소 6자 이상으로 설정해주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('이용약관 및 개인정보 처리방침에 동의해주세요.');
        return;
      }

      const res = await signup({
        name,
        email,
        organization,
        role,
        password
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || '계정 생성에 실패했습니다.');
      }
    }
  };

  const handleQuickSelect = (userId: string) => {
    quickLogin(userId);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
        <div 
          className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-toss-blue">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {mode === 'login' ? '워크스페이스 로그인' : '새 계정 생성 및 워크스페이스 개설'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {mode === 'login' 
                    ? '보안 인증을 통해 내 인재 네트워크 데이터에 접속합니다.' 
                    : '엔터프라이즈 인재 네트워크 및 조합 분석 워크스페이스를 생성합니다.'}
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

          {/* Mode Switch Tabs */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                기존 계정 로그인
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                신규 계정 등록
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-6 py-4 overflow-y-auto space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {isLoading ? (
              /* High-fidelity Skeleton UI loader for realistic authentication state */
              <div className="space-y-4 py-6 animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl"></div>
                </div>
                <div className="h-11 bg-slate-200 dark:bg-zinc-800 rounded-xl mt-4"></div>
                <div className="text-center text-xs text-slate-400 dark:text-zinc-500 font-medium pt-2">
                  안전하게 인증을 처리하고 있습니다...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        성명 (실명)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="예: 김민수"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        소속 조직 / 기업
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="예: 토스 코어팀, 카이스트"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      직책 / 전문 분야
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="예: HR 전략 디렉터, 수석 아키텍트"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    회사 이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      비밀번호
                    </label>
                    {mode === 'signup' && password && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        보안 강도: <strong className={strength.score >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{strength.label}</strong>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? '••••••••' : '최소 6자 이상'}
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'signup' && password && (
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-1.5 flex gap-0.5">
                      <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      비밀번호 재확인
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="동일한 비밀번호를 다시 입력하세요"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-toss-blue focus:border-toss-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-toss-blue focus:ring-toss-blue"
                      />
                      <span>로그인 상태 유지</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      비밀번호 초기화는 관리자 문의
                    </span>
                  </div>
                ) : (
                  <div className="pt-2">
                    <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded border-slate-300 text-toss-blue focus:ring-toss-blue mt-0.5"
                      />
                      <span>
                        <button
                          type="button"
                          onClick={() => setLegalModalType('terms')}
                          className="text-toss-blue underline underline-offset-2 hover:opacity-80"
                        >
                          서비스 이용약관
                        </button>
                        {' 및 '}
                        <button
                          type="button"
                          onClick={() => setLegalModalType('privacy')}
                          className="text-toss-blue underline underline-offset-2 hover:opacity-80"
                        >
                          개인정보 처리방침
                        </button>
                        에 동의합니다.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-toss-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <span>{mode === 'login' ? '로그인 및 데이터 동기화' : '계정 생성 및 워크스페이스 시작'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Switcher Section for effortless testing */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-2.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>빠른 데모 계정 선택 (원클릭 전환)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {registeredUsers.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u.id)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: u.avatarColor || '#3182F6' }}
                      >
                        {u.name.slice(0, 1)}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-toss-blue">
                        {u.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                      {u.organization}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-zinc-850 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>계정별 독립 네트워크 격리 보장</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLegalModalType('terms')}
                className="hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                이용약관
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        </div>
      </div>

      <LegalModals 
        type={legalModalType} 
        onClose={() => setLegalModalType(null)} 
      />
    </>
  );
};
