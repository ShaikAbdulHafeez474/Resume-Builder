import { create } from "zustand";

const useStore = create((set) => ({
  // --- Auth State ---
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),

  // --- Resume State ---
  resume: {
    name: "",
    email: "",
    phone: "",
    education: [],
    experience: [],
    projects: [],       // ✅ added Projects
    skills: [],
    achievements: [],
  },
  updateResumeList: (field, list) =>
    set((state) => ({
      resume: {
        ...state.resume,
        [field]: list,
      },
    })),
  updateResumeField: (field, value) =>
    set((state) => ({
      resume: {
        ...state.resume,
        [field]: value,
      },
    })),
}));

export default useStore;
