import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import { useAdminMe } from "@workspace/api-client-react";
import { useEffect } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const { data: authStatus, isLoading } = useAdminMe();

  useEffect(() => {
    if (!isLoading && !authStatus?.authenticated) {
      setLocation("/admin");
    }
  }, [isLoading, authStatus, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary"><div className="animate-pulse font-mono">INITIALIZING...</div></div>;
  }

  if (!authStatus?.authenticated) {
    return null;
  }

  return <Component {...rest} />;
}

function AdminAuthRoute({ component: Component, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const { data: authStatus, isLoading } = useAdminMe();

  useEffect(() => {
    if (!isLoading && authStatus?.authenticated) {
      setLocation("/admin/dashboard");
    }
  }, [isLoading, authStatus, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary"><div className="animate-pulse font-mono">AUTHENTICATING...</div></div>;
  }

  if (authStatus?.authenticated) {
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={() => <AdminAuthRoute component={AdminLogin} />} />
      <Route path="/admin/dashboard" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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

export default App;
