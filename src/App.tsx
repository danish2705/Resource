import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import DemandSummary from "@/pages/DemandSummary";
import CreateDemand from "@/pages/CreateDemand";
import ResourceAllocation from "@/pages/Allocation";
import ResourceInformation from "@/pages/Resource";
import DemandStatus from "@/pages/DemandStatus";
import ReportingDashboard from "@/pages/ReportingDashboard";
import ResourceForecast from "@/pages/ResourceForecast";
import ForecastActual from "@/pages/ForecastActual";
import TimesheetsActuals from "@/pages/TimesheetsActuals";
import ProjectsPage from "./pages/Projects";
import ResourceReview from "@/pages/ResourceReview"; // ← NEW

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Demand Management group */}
            <Route path="/demand/create" element={<CreateDemand />} />
            <Route path="/demand-status" element={<DemandStatus />} />
            <Route path="/demand" element={<DemandSummary />} />
            {/* Resource Management */}
            <Route path="/forecast" element={<ResourceForecast />} />
            <Route path="/allocation" element={<ResourceAllocation />} />
            <Route path="/resources" element={<ResourceInformation />} />
            {/* ── Resource Review (manager approval page) ── */}
            <Route path="/resource-review" element={<ResourceReview />} />{" "}
            {/* ← NEW */}
            <Route path="/reports" element={<ReportingDashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/forecast-actual" element={<ForecastActual />} />
            <Route path="/timesheets-actuals" element={<TimesheetsActuals />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
