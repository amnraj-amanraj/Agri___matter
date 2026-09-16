'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, Farm, FarmerCrop } from '@/types';
import { MOCK_PROFILE, MOCK_FARM, MOCK_FARMER_CROP } from '@/lib/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  farm: Farm | null;
  activeCrop: FarmerCrop | null;
  isLoggedIn: boolean;
  authReady: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; message: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; message: string; requiresEmailConfirmation?: boolean }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  login: (phoneOrEmail: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateFarm: (farm: Partial<Farm>) => void;
  setActiveCrop: (crop: FarmerCrop) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [activeCrop, setActiveCropState] = useState<FarmerCrop | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('agrimatter_user');
    const storedFarm = localStorage.getItem('agrimatter_farm');
    const storedCrop = localStorage.getItem('agrimatter_crop');

    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
    try { setFarm(storedFarm ? JSON.parse(storedFarm) : MOCK_FARM); } catch { setFarm(MOCK_FARM); }
    try { setActiveCropState(storedCrop ? JSON.parse(storedCrop) : MOCK_FARMER_CROP); } catch { setActiveCropState(MOCK_FARMER_CROP); }
    setAuthReady(true);
  }, []);

  const persistSession = (nextUser: UserProfile) => {
    setUser(nextUser);
    setFarm(MOCK_FARM);
    setActiveCropState(MOCK_FARMER_CROP);
    localStorage.setItem('agrimatter_user', JSON.stringify(nextUser));
    localStorage.setItem('agrimatter_farm', JSON.stringify(MOCK_FARM));
    localStorage.setItem('agrimatter_crop', JSON.stringify(MOCK_FARMER_CROP));
  };

  const sendOtp = async (phone: string) => ({
    success: true,
    message: `Demo OTP 123456 sent to +91 ${phone}`
  });

  const verifyOtp = async (phone: string, otp: string, name?: string) => {
    if (otp.length !== 6) return { success: false, message: 'Invalid 6-digit OTP code.' };
    persistSession({ ...MOCK_PROFILE, full_name: name || MOCK_PROFILE.full_name, phone: phone.replace(/\D/g, '') });
    return { success: true, message: 'OTP verified successfully!' };
  };

  const login = (phoneOrEmail: string) => {
    persistSession({ ...MOCK_PROFILE, phone: phoneOrEmail.replace(/\D/g, '') || MOCK_PROFILE.phone });
  };

  const signUpWithEmail = async (_email: string, _pass: string, name: string) => {
    persistSession({ ...MOCK_PROFILE, full_name: name });
    return { success: true, message: 'Account created locally!' };
  };

  const loginWithEmail = async (email: string, _pass: string) => {
    login(email);
    return { success: true, message: 'Logged in locally!' };
  };

  const logout = () => {
    setUser(null);
    setFarm(null);
    setActiveCropState(null);
    localStorage.removeItem('agrimatter_user');
    localStorage.removeItem('agrimatter_farm');
    localStorage.removeItem('agrimatter_crop');
  };

  const updateProfile = (updatedProps: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedProps };
    setUser(updated);
    localStorage.setItem('agrimatter_user', JSON.stringify(updated));
  };

  const updateFarm = (updatedProps: Partial<Farm>) => {
    if (!farm) return;
    const updated = { ...farm, ...updatedProps };
    setFarm(updated);
    localStorage.setItem('agrimatter_farm', JSON.stringify(updated));
  };

  const setActiveCrop = (crop: FarmerCrop) => {
    setActiveCropState(crop);
    localStorage.setItem('agrimatter_crop', JSON.stringify(crop));
  };

  return (
    <AuthContext.Provider value={{
      user,
      farm,
      activeCrop,
      isLoggedIn: !!user,
      authReady,
      authModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
      sendOtp,
      verifyOtp,
      signUpWithEmail,
      loginWithEmail,
      login,
      logout,
      updateProfile,
      updateFarm,
      setActiveCrop
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
