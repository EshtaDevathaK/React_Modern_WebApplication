import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ProtectedRoute } from "./lib/protected-route";
import Home from "@/pages/Home";
import Forecast from "@/pages/Forecast";
import Locations from "@/pages/Locations";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Check authentication on initial load
  useEffect(() => {
    const authData = localStorage.getItem("weatherAppAuth");
    const isAuthenticated = authData ? JSON.parse(authData).isLoggedIn : false;
    
    // If user is already logged in and trying to access the auth page, redirect to home
    if (isAuthenticated && location === "/auth") {
      setLocation("/");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/forecast" component={Forecast} />
      <ProtectedRoute path="/locations" component={Locations} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/calendar" component={Calendar} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
