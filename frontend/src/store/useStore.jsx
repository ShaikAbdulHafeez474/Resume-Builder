import { create } from "zustand";

const useStore = create((set) => ({
  // --- Auth State ---
  user: null,
  token: null,
  setUser: (user, token) => {
    set({ user, token });
    // Store in localStorage
    localStorage.setItem('resume-builder-auth', JSON.stringify({ user, token }));
  },
  clearUser: () => {
    set({ user: null, token: null, resume: initialResumeState });
    localStorage.removeItem('resume-builder-auth');
  },

  // --- Resume State ---
  resume: {
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    achievements: [],
  },
  
  setResume: (resume) => set({ resume }),
  
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
    
  resetResume: () => set({ resume: initialResumeState }),

  // --- Template State ---
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  // --- UI State ---
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

const initialResumeState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
};

// Initialize auth state from localStorage
const storedAuth = localStorage.getItem('resume-builder-auth');
if (storedAuth) {
  try {
    const { user, token } = JSON.parse(storedAuth);
    useStore.setState({ user, token });
  } catch (err) {
    console.error('Failed to parse stored auth:', err);
    localStorage.removeItem('resume-builder-auth');
  }
}

export default useStore;