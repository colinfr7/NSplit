
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  discordName?: string;
  walletAddress?: string;
  paymentPreference?: 'cash' | 'crypto';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('nsplit_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nsplit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nsplit_user');
    }
  }, [user]);

  const signInWithGoogle = async () => {
    // In a real app, this would integrate with Firebase Auth or similar
    // For this demo, we'll simulate a Google sign-in
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user data
      const mockUser: User = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email: 'user@example.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/150',
      };
      
      setUser(mockUser);
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    toast.success("Successfully signed out!");
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
      toast.success("Profile updated successfully!");
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      isLoading,
      signInWithGoogle,
      signOut,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
