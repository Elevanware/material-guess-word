import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AssessmentManager from "./pages/AssessmentManager";
import 'animate.css';
import MaterialLibrary from "./pages/MaterialLibrary";
import MaterialView from "./pages/MaterialView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
              <Route path="/" element={<AssessmentManager />} />
              <Route path="/material-library" element={<MaterialLibrary />} />
              <Route path="/material-library/:id" element={<MaterialView />} />
              <Route path="/dashboard" element={<div>Dashboard</div>} />
              <Route path="/students" element={<div>Students</div>} />
              <Route path="/seasonal" element={<div>Seasonal Resources</div>} />
              <Route path="/scope-sequence" element={<div>Scope & Sequence</div>} />
              <Route path="/reports" element={<div>Data Reports</div>} />
              <Route path="/calendar" element={<div>Calendar</div>} />
              <Route path="/help" element={<div>Help</div>} />
              <Route path="*" element={<NotFound />} />

              
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;