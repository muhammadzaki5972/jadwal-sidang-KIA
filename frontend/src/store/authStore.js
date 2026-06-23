import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (credentials) => {
    // Dummy login for MVP
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      set({ isAuthenticated: true, user: { username: 'admin', role: 'admin' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
