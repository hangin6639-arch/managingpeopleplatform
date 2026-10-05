/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface StoredAccount extends User {
  passwordHash: string; // Stored securely for local simulation
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: StoredAccount[];
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    organization: string;
    role: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLogin: (userId: string) => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'organization' | 'role' | 'avatarColor'>>) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default corporate demo accounts
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'user-jihoon',
    email: 'admin@toss.im',
    passwordHash: 'password123',
    name: '현지훈',
    organization: 'Core HR 전략실',
    role: 'Chief Talent Strategist',
    avatarColor: '#3182F6',
    createdAt: '2026-01-15T09:00:00.000Z',
    lastLoginAt: '2026-08-17T03:30:00.000Z'
  },
  {
    id: 'user-soyeon',
    email: 'soyeon.lee@talent.ai',
    passwordHash: 'password123',
    name: '이소연',
    organization: '글로벌 테크 얼라이언스',
    role: 'VP of Organization Strategy',
    avatarColor: '#059669',
    createdAt: '2026-03-10T11:20:00.000Z',
    lastLoginAt: '2026-08-15T16:45:00.000Z'
  },
  {
    id: 'user-minwoo',
    email: 'minwoo.park@venture.kr',
    passwordHash: 'password123',
    name: '박민우',
    organization: '알토스 파트너스',
    role: 'Managing Partner',
    avatarColor: '#D97706',
    createdAt: '2026-05-02T14:10:00.000Z',
    lastLoginAt: '2026-08-10T10:15:00.000Z'
  }
];

const AVATAR_PALETTE = [
  '#3182F6', // Toss Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Violet Slate
  '#0284C7', // Sky
  '#475569'  // Slate
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<StoredAccount[]>(() => {
    const saved = localStorage.getItem('toss_talent_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse registered users', e);
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem('toss_talent_active_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse active user session', e);
      }
    }
    // Default to the first account (Jihoon)
    return DEFAULT_ACCOUNTS[0];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync registered users to localStorage
  useEffect(() => {
    localStorage.setItem('toss_talent_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync active user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('toss_talent_active_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('toss_talent_active_user_session');
    }
  }, [currentUser]);

  const login = async (
    email: string, 
    password: string, 
    _rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Realistic micro-delay to simulate secure authentication and prevent brute force UI spam
    await new Promise(resolve => setTimeout(resolve, 380));

    const normalizedEmail = email.trim().toLowerCase();
    const targetAccount = registeredUsers.find(
      u => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (!targetAccount) {
      setIsLoading(false);
      return { success: false, error: '등록되지 않은 이메일 계정입니다. 계정 생성을 진행해주세요.' };
    }

    if (targetAccount.passwordHash !== password) {
      setIsLoading(false);
      return { success: false, error: '비밀번호가 일치하지 않습니다. 다시 확인해주세요.' };
    }

    const updatedUser: StoredAccount = {
      ...targetAccount,
      lastLoginAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // Sanitize user object for public state
    const { passwordHash: _, ...safeUser } = updatedUser;
    setCurrentUser(safeUser);
    setIsLoading(false);

    return { success: true };
  };

  const signup = async (data: {
    name: string;
    email: string;
    organization: string;
    role: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 450));

    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = registeredUsers.find(
      u => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (existing) {
      setIsLoading(false);
      return { success: false, error: '이미 해당 이메일로 가입된 계정이 존재합니다.' };
    }

    const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const randomAvatarColor = AVATAR_PALETTE[registeredUsers.length % AVATAR_PALETTE.length];

    const newAccount: StoredAccount = {
      id: newId,
      email: normalizedEmail,
      passwordHash: data.password,
      name: data.name.trim(),
      organization: data.organization.trim() || '독립 리서처 / 개인 워크스페이스',
      role: data.role.trim() || 'HR Network Specialist',
      avatarColor: randomAvatarColor,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [newAccount, ...prev]);

    const { passwordHash: _, ...safeUser } = newAccount;
    setCurrentUser(safeUser);
    setIsLoading(false);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLogin = (userId: string) => {
    const target = registeredUsers.find(u => u.id === userId);
    if (target) {
      const { passwordHash: _, ...safeUser } = target;
      setCurrentUser(safeUser);
    }
  };

  const updateProfile = (data: Partial<Pick<User, 'name' | 'organization' | 'role' | 'avatarColor'>>): boolean => {
    if (!currentUser) return false;

    const updatedUser = {
      ...currentUser,
      ...data
    };

    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          ...data
        };
      }
      return u;
    }));

    return true;
  };

  const changePassword = (oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: '로그인이 필요합니다.' };

    const account = registeredUsers.find(u => u.id === currentUser.id);
    if (!account) return { success: false, error: '계정 정보를 찾을 수 없습니다.' };

    if (account.passwordHash !== oldPassword) {
      return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: '새 비밀번호는 최소 6자 이상이어야 합니다.' };
    }

    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          passwordHash: newPassword
        };
      }
      return u;
    }));

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        registeredUsers,
        login,
        signup,
        logout,
        quickLogin,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
