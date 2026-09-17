import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import { Layout } from "@/components/layout";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Destinations from "@/pages/destinations";
import InteractiveMap from "@/pages/interactive-map";
import RouteCalculator from "@/pages/route-calculator";
import LiveStatus from "@/pages/live-status";
import Listings from "@/pages/listings";
import Reviews from "@/pages/reviews";
import Notifications from "@/pages/notifications";
import OfflineMode from "@/pages/offline-mode";
import Profile from "@/pages/profile";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Landing />;
  return <Layout><Component /></Layout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/destinations" component={() => <ProtectedRoute component={Destinations} />} />
      <Route path="/map" component={() => <ProtectedRoute component={InteractiveMap} />} />
      <Route path="/routes" component={() => <ProtectedRoute component={RouteCalculator} />} />
      <Route path="/live-status" component={() => <ProtectedRoute component={LiveStatus} />} />
      <Route path="/listings" component={() => <ProtectedRoute component={Listings} />} />
      <Route path="/reviews" component={() => <ProtectedRoute component={Reviews} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={Notifications} />} />
      <Route path="/offline" component={() => <ProtectedRoute component={OfflineMode} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
