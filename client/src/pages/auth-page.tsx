import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const authData = localStorage.getItem("weatherAppAuth");
    if (authData) {
      const userData = JSON.parse(authData);
      if (userData.isLoggedIn) {
        setLocation("/");
      }
    }
  }, [setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Login handler
  const onLoginSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple authentication check - in a real app, this would be an API call
      if (data.username && data.password) {
        // Store auth data in localStorage
        localStorage.setItem("weatherAppAuth", JSON.stringify({
          username: data.username,
          isLoggedIn: true,
        }));
        
        toast({
          title: "Login successful",
          description: "Welcome back to WeatherMood!",
        });
        
        // Redirect to home page
        setLocation("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  // Register handler
  const onRegisterSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Store auth data in localStorage
      localStorage.setItem("weatherAppAuth", JSON.stringify({
        username: data.username,
        isLoggedIn: true,
      }));
      
      toast({
        title: "Registration successful",
        description: "Welcome to WeatherMood!",
      });
      
      // Redirect to home page
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">WeatherMood</CardTitle>
            <CardDescription>
              Log in to your account or create a new one to get personalized weather insights.
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <CardContent className="pt-4">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Choose a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-foreground via-primary/5 to-primary/20 p-4 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto md:ml-0 space-y-8">
          <div className="flex space-x-2 mb-6">
            <div className="bg-primary/10 rounded-full p-2">
              <Sun className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="bg-primary/10 rounded-full p-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
            </div>
            <div className="bg-primary/10 rounded-full p-2">
              <Cloud className="h-5 w-5 text-gray-500" />
            </div>
            <div className="bg-primary/10 rounded-full p-2">
              <CloudSnow className="h-5 w-5 text-blue-300" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold">Weather that sets your mood</h1>
          
          <p className="text-lg text-gray-700">
            Not just another weather app. WeatherMood combines accurate forecasts with personalized mood suggestions, outfit recommendations, and music playlists that match the weather.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sun className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-medium">Real-time forecasts</h3>
                <p className="text-gray-600">Get accurate weather updates for any location</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Cloud className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">Mood suggestions</h3>
                <p className="text-gray-600">Weather-based vibes to match your day</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CloudRain className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Music playlists</h3>
                <p className="text-gray-600">Curated Spotify playlists for every forecast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}