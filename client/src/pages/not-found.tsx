import { Link } from "wouter";
import { Cloud, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-light">
      <div className="text-center">
        <div className="text-8xl text-primary opacity-50 mb-4">404</div>
        <h1 className="text-4xl font-bold font-heading text-navy mb-2">Page Not Found</h1>
        <p className="text-navy-light mb-6 max-w-md mx-auto">
          The weather forecast for this page seems to be missing. Let's get you back to clearer skies!
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <Button asChild>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/forecast" className="flex items-center">
              <Cloud className="mr-2 h-4 w-4" />
              View Forecast
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex gap-4 text-7xl animate-bounce">
            <span>🌦️</span>
            <span className="animate-pulse">❓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
