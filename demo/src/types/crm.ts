export type UserRole = "owner" | "sales_manager" | "account_manager";
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "lost";
export type LeadSource = "website" | "referral" | "linkedin" | "cold_outreach" | "event";
export type DealStage = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ClientHealth = "healthy" | "needs_attention" | "at_risk";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
  email: string;
}

export interface Lead {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  estimatedValue: number;
  ownerId: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  stage: DealStage;
  value: number;
  probability: number;
  expectedCloseDate?: string;
  ownerId: string;
  clientId?: string;
  leadId?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  monthlyRetainer: number;
  health: ClientHealth;
  activeProjects: number;
  startDate: string;
  lastContactedAt?: string;
  ownerId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedToId: string;
  relatedClientId?: string;
  relatedDealId?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
}
