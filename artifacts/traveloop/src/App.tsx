import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import { Layout } from "@/components/layout";
import { VoiceAssistant } from "@/components/voice-assistant";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Trips from "@/pages/trips";
import TripNew from "@/pages/trip-new";
import TripDetail from "@/pages/trip-detail";
import TripEdit from "@/pages/trip-edit";
import TripBudget from "@/pages/trip-budget";
import TripPacking from "@/pages/trip-packing";
import TripNotes from "@/pages/trip-notes";
import TripItinerary from "@/pages/trip-itinerary";
import Cities from "@/pages/cities";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import ShareView from "@/pages/share-view";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Landing />;
  return <Layout><Component /></Layout>;
}

function AuthenticatedVoiceAssistant() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <VoiceAssistant />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/trips" component={() => <ProtectedRoute component={Trips} />} />
      <Route path="/trips/new" component={() => <ProtectedRoute component={TripNew} />} />
      <Route path="/trips/:tripId/edit" component={() => <ProtectedRoute component={TripEdit} />} />
      <Route path="/trips/:tripId/budget" component={() => <ProtectedRoute component={TripBudget} />} />
      <Route path="/trips/:tripId/packing" component={() => <ProtectedRoute component={TripPacking} />} />
      <Route path="/trips/:tripId/notes" component={() => <ProtectedRoute component={TripNotes} />} />
      <Route path="/trips/:tripId/itinerary" component={() => <ProtectedRoute component={TripItinerary} />} />
      <Route path="/trips/:tripId" component={() => <ProtectedRoute component={TripDetail} />} />
      <Route path="/cities" component={() => <ProtectedRoute component={Cities} />} />
      <Route path="/community" component={() => <ProtectedRoute component={Community} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/share/:shareSlug" component={ShareView} />
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
          <AuthenticatedVoiceAssistant />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
