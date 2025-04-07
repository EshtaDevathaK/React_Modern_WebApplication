import { useEffect, useState } from "react";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

// Simple authentication check - in a real app, this would verify with backend
export function useAuth() {
  const [user, setUser] = useState<{ username: string; isLoggedIn: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in (using localStorage for demo purposes)
    const authData = localStorage.getItem("weatherAppAuth");
    if (authData) {
      setUser(JSON.parse(authData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("weatherAppAuth");
    setUser(null);
  };

  return { user, loading, logout };
}

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user || !user.isLoggedIn) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}