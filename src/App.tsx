import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TripPage from "./pages/TripPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminTripsList from "./pages/AdminTripsList.tsx";
import AdminTripForm from "./pages/AdminTripForm.tsx";
import AdminPlaceholder from "./pages/AdminPlaceholder.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip/:slug" element={<TripPage />} />
          <Route path="/admin-7823-secure-panel" element={<AdminLogin />} />
          <Route path="/admin-7823-secure-panel/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-7823-secure-panel/trips" element={<AdminTripsList />} />
          <Route path="/admin-7823-secure-panel/trips/new" element={<AdminTripForm />} />
          <Route path="/admin-7823-secure-panel/trips/:id" element={<AdminTripForm />} />
          <Route path="/admin-7823-secure-panel/bookings" element={<AdminPlaceholder title="Bookings" description="Booking management coming soon." />} />
          <Route path="/admin-7823-secure-panel/users" element={<AdminPlaceholder title="Users" description="User management coming soon." />} />
          <Route path="/admin-7823-secure-panel/payments" element={<AdminPlaceholder title="Payments" description="Payment tracking coming soon." />} />
          <Route path="/admin-7823-secure-panel/settings" element={<AdminPlaceholder title="Settings" description="Admin settings coming soon." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
