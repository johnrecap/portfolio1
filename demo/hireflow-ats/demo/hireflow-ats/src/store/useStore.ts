import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  email: string;
  dateApplied: string;
  avatar?: string;
  rating?: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  candidatesCount: number;
  postedDate: string;
}

interface AppState {
  candidates: Candidate[];
  jobs: Job[];
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setSidebarOpen: (isOpen: boolean) => void;
  updateCandidateStatus: (id: string, status: Candidate['status']) => void;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  addJob: (job: Omit<Job, 'id'>) => void;
  deleteCandidate: (id: string) => void;
  deleteJob: (id: string) => void;
}

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Frontend Developer', status: 'interview', email: 'sarah.j@example.com', dateApplied: '2023-10-24', rating: 4 },
  { id: '2', name: 'Michael Chen', role: 'Product Manager', status: 'applied', email: 'm.chen@example.com', dateApplied: '2023-10-25' },
  { id: '3', name: 'Jessica Rubio', role: 'UX Designer', status: 'screening', email: 'jess.r@example.com', dateApplied: '2023-10-22', rating: 5 },
  { id: '4', name: 'David Smith', role: 'Backend Engineer', status: 'offer', email: 'david.smith@example.com', dateApplied: '2023-10-15', rating: 4 },
  { id: '5', name: 'Emily Davis', role: 'Frontend Developer', status: 'hired', email: 'emily.d@example.com', dateApplied: '2023-10-01', rating: 5 },
];

const mockJobs: Job[] = [
  { id: '1', title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'active', candidatesCount: 12, postedDate: '2023-10-20' },
  { id: '2', title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time', status: 'active', candidatesCount: 8, postedDate: '2023-10-18' },
  { id: '3', title: 'UX Designer', department: 'Design', location: 'London, UK', type: 'Contract', status: 'draft', candidatesCount: 0, postedDate: '2023-10-26' },
  { id: '4', title: 'Backend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'closed', candidatesCount: 45, postedDate: '2023-09-15' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      candidates: mockCandidates,
      jobs: mockJobs,
      theme: 'light',
      language: 'en',
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      updateCandidateStatus: (id, status) => set((state) => ({
        candidates: state.candidates.map(c => c.id === id ? { ...c, status } : c),
      })),
      addCandidate: (candidate) => set((state) => ({
        candidates: [{ ...candidate, id: crypto.randomUUID() }, ...state.candidates]
      })),
      addJob: (job) => set((state) => ({
        jobs: [{ ...job, id: crypto.randomUUID() }, ...state.jobs]
      })),
      deleteCandidate: (id) => set((state) => ({
        candidates: state.candidates.filter(c => c.id !== id)
      })),
      deleteJob: (id) => set((state) => ({
        jobs: state.jobs.filter(j => j.id !== id)
      })),
    }),
    {
      name: 'hireflow-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
