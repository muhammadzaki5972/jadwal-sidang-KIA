import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (credentials) => {
    // Get credentials from environment variables or use fallbacks
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (credentials.username === adminUsername && credentials.password === adminPassword) {
      set({ isAuthenticated: true, user: { username: adminUsername, role: 'admin' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
