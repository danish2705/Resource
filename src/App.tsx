import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import UserManagement from "@/pages/UserManagement";
import MasterDataManagement from "@/pages/MasterDataManagement";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoutes";

import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Mydashboard from "@/pages/Mydashboard";
import DemandSummary from "@/pages/DemandSummary";
import CreateDemand from "@/pages/CreateDemand";
import ResourceAllocation from "@/pages/Allocation";
import ResourceInformation from "@/pages/Resource";
import DemandStatus from "@/pages/AllocationStatus";
import ReportingDashboard from "@/pages/ReportingAnalytics";
import ResourceForecast from "@/pages/ResourceForecast";
import ForecastActual from "@/pages/ForecastActual";
import ProjectsPage from "./pages/Projects";
import ResourceReview from "@/pages/ResourceReview";
import AuditLog from "@/pages/AuditLog";
import TaskReviewApproval from "@/pages/TaskReviewApproval";
import ScenarioPlanning from "@/pages/ScenarioPlanning";
import ProjectPortfolio from "@/pages/ProjectPortfolio";

import { useAuth } from "@/auth/useAuth";

const queryClient = new QueryClient();

function AuthGate() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthGate />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    {/* Dashboard */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute permission="view_dashboard">
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* My Dashboard */}
                    <Route
                      path="/my-dashboard"
                      element={
                        <ProtectedRoute permission="view_dashboard">
                          <Mydashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Demand Management */}
                    <Route
                      path="/demand/create"
                      element={
                        <ProtectedRoute permission="create_demand">
                          <CreateDemand />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/scenario-planning"
                      element={
                        <ProtectedRoute
                          permission="view_reporting"
                          excludeRoles={["resource"]}
                        >
                          <ScenarioPlanning />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/project-portfolio"
                      element={
                        <ProtectedRoute permission="view_reporting">
                          <ProjectPortfolio />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/demand-status"
                      element={
                        <ProtectedRoute permission="view_dashboard">
                          <DemandStatus />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/demand"
                      element={
                        <ProtectedRoute permission="view_dashboard">
                          <DemandSummary />
                        </ProtectedRoute>
                      }
                    />

                    {/* Resource Management */}
                    <Route
                      path="/forecast"
                      element={
                        <ProtectedRoute permission="view_resource_info">
                          <ResourceForecast />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/allocation"
                      element={
                        <ProtectedRoute permission="view_allocation">
                          <ResourceAllocation />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/resources"
                      element={
                        <ProtectedRoute permission="view_resource_info">
                          <ResourceInformation />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/resource-review"
                      element={
                        <ProtectedRoute permission="approve_demand">
                          <ResourceReview />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute permission="view_reporting">
                          <ReportingDashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/projects"
                      element={
                        <ProtectedRoute permission="view_projects">
                          <ProjectsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/task-review-approval"
                      element={
                        <ProtectedRoute permission="view_projects">
                          <TaskReviewApproval />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/forecast-actual"
                      element={
                        <ProtectedRoute permission="view_resource_info">
                          <ForecastActual />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/audit-log"
                      element={
                        <ProtectedRoute permission="view_audit_logs">
                          <AuditLog />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/user-management"
                      element={
                        <ProtectedRoute permission="manage_users">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin/master-data"
                      element={
                        <ProtectedRoute permission="manage_master_data">
                          <MasterDataManagement />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/mydashboard" element={<Mydashboard />} />
                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
