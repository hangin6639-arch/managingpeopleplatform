/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronDown, 
  LogOut, 
  UserPlus, 
  KeyRound, 
  Settings2, 
  ShieldCheck, 
  Building2, 
  Check, 
  X,
  Lock,
  Mail,
  User as UserIcon,
  Briefcase
} from 'lucide-react';

interface UserProfileMenuProps {
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onOpenAuthModal }) => {
  const { 
    currentUser, 
    registeredUsers, 
    logout, 
    quickLogin, 
    updateProfile, 
    changePassword 
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Edit Profile Form state
  const [editName, setEditName] = useState('');
  const [editOrg, setEditOrg] = useState('');
  const [editRole, setEditRole] = useState('');

  // Password Change Form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenEdit = () => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditOrg(currentUser.organization);
      setEditRole(currentUser.role);
    }
    setIsOpen(false);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({
      name: editName.trim(),
      organization: editOrg.trim(),
      role: editRole.trim()
    });
    setIsEditProfileOpen(false);
  };

  const handleOpenChangePass = () => {
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');
    setPassError('');
    setPassSuccess(false);
    setIsOpen(false);
    setIsChangePasswordOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (newPass !== confirmNewPass) {
      setPassError('새 비밀번호와 확인 값이 일치하지 않습니다.');
      return;
    }

    const res = changePassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess(true);
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPassSuccess(false);
      }, 1200);
    } else {
      setPassError(res.error || '비밀번호 변경 실패');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenAuthModal('login')}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          로그인
        </button>
        <button
          onClick={() => onOpenAuthModal('signup')}
          className="px-3.5 py-1.5 bg-toss-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          계정 생성
        </button>
      </div>
    );
  }

  const initial = currentUser.name.slice(0, 1);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pl-3 hover:bg-slate-100 dark:hover:bg-zinc-800/80 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 select-none group"
      >
        <div className="hidden sm:flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-toss-blue transition-colors">
            {currentUser.name}님
          </span>
        </div>

        <div 
          className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0 border border-white dark:border-zinc-800"
          style={{ backgroundColor: currentUser.avatarColor || '#3182F6' }}
        >
          {initial}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-transform duration-150" />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Active User Info Banner */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-850 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: currentUser.avatarColor || '#3182F6' }}
              >
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                    {currentUser.name}
                  </h4>
                  <span className="bg-blue-100 dark:bg-blue-950 text-toss-blue text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0">
                    인증됨
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{currentUser.email}</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                  {currentUser.organization} · {currentUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="p-2 space-y-1">
            <button
              onClick={handleOpenEdit}
              className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span>프로필 및 소속 정보 수정</span>
            </button>

            <button
              onClick={handleOpenChangePass}
              className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span>비밀번호 보안 설정</span>
            </button>
          </div>

          {/* Account Switcher Section */}
          <div className="p-2 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              워크스페이스 계정 전환
            </div>
            <div className="space-y-1 mt-1 max-h-36 overflow-y-auto">
              {registeredUsers.map(user => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      if (!isSelected) quickLogin(user.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-toss-blue font-bold' 
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: user.avatarColor || '#3182F6' }}
                      >
                        {user.name.slice(0, 1)}
                      </div>
                      <span className="truncate">{user.name} ({user.organization})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-toss-blue shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAuthModal('signup');
              }}
              className="flex-1 py-1.5 text-center text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>계정 추가</span>
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800"></div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex-1 py-1.5 text-center text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-toss-blue" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">프로필 정보 수정</h3>
              </div>
              <button 
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  성명
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
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
                    value={editOrg}
                    onChange={(e) => setEditOrg(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  직책 / 전문 분야
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-toss-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  저장 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">계정 비밀번호 변경</h3>
              </div>
              <button 
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 space-y-4">
              {passError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-200 dark:border-rose-900/50">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>비밀번호가 안전하게 변경되었습니다.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  새 비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="최소 6자 이상"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-toss-blue"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-toss-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
