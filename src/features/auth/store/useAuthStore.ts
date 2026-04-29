import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

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
  login: (user: User) => void;
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
