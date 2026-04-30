import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  bio?: string;
  address?: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => {
        set({ user: userData, isAuthenticated: true });
        toast.success(`¡Bienvenido, ${userData.name}!`);
      },
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }));
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.info('Has cerrado sesión correctamente');
      },
    }),
    {
      name: 'reviste-auth-storage',
    }
  )
);
