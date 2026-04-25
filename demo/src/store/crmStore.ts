import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User, Lead, Deal, Client, Task, Activity } from "../types/crm";
import { mockUsers } from "../data/mockUsers";
import { mockLeads } from "../data/mockLeads";
import { mockDeals } from "../data/mockDeals";
import { mockClients } from "../data/mockClients";
import { mockTasks } from "../data/mockTasks";
import { mockActivities } from "../data/mockActivities";
import { clearCurrentDemoSessionState, getDemoSessionStorageKey } from "./demoSession";

interface CRMState {
  currentUser: User | null;
  users: User[];
  leads: Lead[];
  deals: Deal[];
  clients: Client[];
  tasks: Task[];
  activities: Activity[];

  // Actions
  setCurrentUser: (user: User | null) => void;
  
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "lastContactedAt">) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  convertLeadToDeal: (leadId: string) => void;
  
  addDeal: (deal: Omit<Deal, "id" | "createdAt">) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  moveDealStage: (id: string, stage: Deal["stage"]) => void;
  
  addClient: (client: Omit<Client, "id" | "activeProjects" | "startDate">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  completeTask: (id: string) => void;
  
  logActivity: (activity: Omit<Activity, "id" | "createdAt">) => void;

  resetDemoData: () => void;
}

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
const clone = <T,>(value: T): T => structuredClone(value);

function createSeedCRMState() {
  return {
    currentUser: clone(mockUsers[0]),
    users: clone(mockUsers),
    leads: clone(mockLeads),
    deals: clone(mockDeals),
    clients: clone(mockClients),
    tasks: clone(mockTasks),
    activities: clone(mockActivities),
  };
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      ...createSeedCRMState(),

      setCurrentUser: (user) => set({ currentUser: user }),

      addLead: (leadData) => {
        const newLead: Lead = {
          ...leadData,
          id: generateId("ld"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ leads: [newLead, ...state.leads] }));
        get().logActivity({
          type: "lead_added",
          title: "New Lead Added",
          description: `added ${newLead.companyName || newLead.fullName} as a new lead.`,
          userId: get().currentUser?.id || "sys",
        });
      },

      updateLead: (id, leadData) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...leadData } : l)),
        }));
      },

      convertLeadToDeal: (leadId) => {
        const state = get();
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) return;

        const newDeal: Deal = {
          id: generateId("dl"),
          title: `Implementation - ${lead.companyName}`,
          companyName: lead.companyName,
          contactName: lead.fullName,
          stage: "qualified",
          value: lead.estimatedValue || 0,
          probability: 35,
          ownerId: lead.ownerId,
          leadId: lead.id,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          leads: s.leads.filter((l) => l.id !== leadId),
          deals: [newDeal, ...s.deals],
        }));

        get().logActivity({
          type: "lead_converted",
          title: "Lead Converted to Deal",
          description: `converted ${lead.companyName} to a new deal.`,
          userId: state.currentUser?.id || "sys",
        });
      },

      addDeal: (dealData) => {
        const newDeal: Deal = {
          ...dealData,
          id: generateId("dl"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ deals: [newDeal, ...state.deals] }));
      },

      updateDeal: (id, dealData) => {
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...dealData } : d)),
        }));
      },

      moveDealStage: (id, stage) => {
        const state = get();
        const deal = state.deals.find((d) => d.id === id);
        if (!deal || deal.stage === stage) return;

        set((s) => ({
          deals: s.deals.map((d) => (d.id === id ? { ...d, stage } : d)),
        }));

        get().logActivity({
          type: "deal_moved",
          title: "Deal Stage Updated",
          description: `moved ${deal.companyName} to ${stage} stage.`,
          userId: state.currentUser?.id || "sys",
        });
      },

      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId("cl"),
          activeProjects: 0,
          startDate: new Date().toISOString(),
        };
        set((state) => ({ clients: [newClient, ...state.clients] }));
      },

      updateClient: (id, clientData) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...clientData } : c)),
        }));
      },

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId("tsk"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
        }));
      },

      completeTask: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task || task.status === "completed") return;

        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: "completed" } : t)),
        }));

        get().logActivity({
          type: "task_completed",
          title: "Task Completed",
          description: `completed task "${task.title}".`,
          userId: state.currentUser?.id || "sys",
        });
      },

      logActivity: (accData) => {
        const newActivity: Activity = {
          ...accData,
          id: generateId("act"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ activities: [newActivity, ...state.activities].slice(0, 50) })); // keep last 50
      },

      resetDemoData: () => {
        clearCurrentDemoSessionState();
        set(createSeedCRMState());
      },
    }),
    {
      name: getDemoSessionStorageKey(),
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        leads: state.leads, 
        deals: state.deals, 
        clients: state.clients, 
        tasks: state.tasks, 
        activities: state.activities,
        currentUser: state.currentUser
      })
    }
  )
);
