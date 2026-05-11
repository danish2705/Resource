import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import DemandManagement from "@/pages/DemandManagement";
import ResourceAllocation from "@/pages/ResourceAllocation";
import ResourceInformation from "@/pages/ResourceInformation";
import ReportingDashboard from "@/pages/ReportingDashboard";
import DataManagement from "@/pages/DataManagement";
import ResourceForecast from "@/pages/ResourceForecast";
import NotFound from "@/pages/NotFound";
import ForecastActual from "@/pages/ForecastActual";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/demand" element={<DemandManagement />} />
            <Route path="/forecast" element={<ResourceForecast />} />
            <Route path="/allocation" element={<ResourceAllocation />} />
            <Route path="/resources" element={<ResourceInformation />} />
            <Route path="/reports" element={<ReportingDashboard />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/forecast-actual" element={<ForecastActual />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
