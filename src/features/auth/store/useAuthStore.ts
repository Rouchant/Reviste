import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'user' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, role = 'user') => {
        // Lógica de inicio de sesión simulada (Mock)
        const mockUser: User = {
          id: '1',
          name: email.split('@')[0],
          email: email,
          role: role,
          isAdmin: role === 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'reviste-auth-storage',
    }
  )
);
