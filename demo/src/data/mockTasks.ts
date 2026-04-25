import { Task } from "../types/crm";
import { subDays, addDays, addHours } from "date-fns";

export const mockTasks: Task[] = [
  {
    id: "tsk-1",
    title: "Review campaign report",
    description: "Review the Q3 marketing campaign report for Apex Dynamics.",
    status: "todo",
    priority: "urgent",
    dueDate: subDays(new Date(), 1).toISOString(),
    assignedToId: "usr-3",
    relatedClientId: "cl-1",
    createdAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "tsk-2",
    title: "Send proposal follow-up",
    status: "todo",
    priority: "high",
    dueDate: addHours(new Date(), 4).toISOString(),
    assignedToId: "usr-1",
    relatedDealId: "dl-3",
    createdAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "tsk-3",
    title: "Prepare onboarding checklist",
    status: "todo",
    priority: "medium",
    dueDate: addDays(new Date(), 1).toISOString(),
    assignedToId: "usr-3",
    relatedClientId: "cl-3",
    createdAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "tsk-4",
    title: "Schedule discovery call",
    status: "todo",
    priority: "medium",
    dueDate: addDays(new Date(), 3).toISOString(),
    assignedToId: "usr-2",
    relatedLeadId: "ld-3",
    createdAt: subDays(new Date(), 5).toISOString(),
  } as any, // Adding extra property relatedLeadId for mock simplicity
];
