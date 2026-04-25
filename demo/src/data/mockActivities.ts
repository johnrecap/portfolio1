import { Activity } from "../types/crm";
import { subHours, subDays } from "date-fns";

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: "deal_moved",
    title: "Deal Stage Updated",
    description: "moved BluePeak Labs to Negotiation stage.",
    createdAt: subHours(new Date(), 2).toISOString(),
    userId: "usr-1",
  },
  {
    id: "act-2",
    type: "task_completed",
    title: "Task Completed",
    description: "completed onboarding for Acme Corp.",
    createdAt: subHours(new Date(), 4).toISOString(),
    userId: "usr-2",
  },
  {
    id: "act-3",
    type: "note_added",
    title: "Note Added",
    description: "Client requested revised pricing structure for Q3 implementation.",
    createdAt: subDays(new Date(), 1).toISOString(),
    userId: "usr-3",
  },
];
