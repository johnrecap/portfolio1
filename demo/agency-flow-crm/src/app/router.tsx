import { createBrowserRouter, Link, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import DashboardPage from "../features/dashboard/DashboardPage";
import LeadsPage from "../features/leads/LeadsPage";
import DealsPage from "../features/deals/DealsPage";
import ClientsPage from "../features/clients/ClientsPage";
import TasksPage from "../features/tasks/TasksPage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";
import SupportPage from "../features/support/SupportPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/leads",
        element: <LeadsPage />,
      },
      {
        path: "/deals",
        element: <DealsPage />,
      },
      {
        path: "/clients",
        element: <ClientsPage />,
      },
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="font-page-title text-page-title text-primary mb-4">404 - Page Not Found</h1>
        <p className="font-body-main text-on-surface-variant mb-6">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold">
          Return to Dashboard
        </Link>
      </div>
    ),
  },
], {
  basename: routerBasename,
});
