import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings as SettingsIcon, Bell, BarChart, FileText, Globe, Languages, ThermometerSun, Cloud, User } from "lucide-react";

export default function Settings() {
  const [units, setUnits] = useState("metric");
  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [dataRefresh, setDataRefresh] = useState(30);
  const [userName, setUserName] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [apiProvider, setApiProvider] = useState("openweathermap");

  const handleSearch = (location: string) => {
    // Not used in settings page but needed for Header component
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          Settings
        </h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 font-heading">General Settings</h2>
              
              <div className="space-y-6">
                {/* Units */}
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base font-medium">Temperature Units</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred temperature display unit</p>
                    </div>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Celsius (°C)</SelectItem>
                        <SelectItem value="imperial">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Language */}
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base font-medium">Language</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Theme */}
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Default Location */}
                <div className="grid gap-2">
                  <Label className="text-base font-medium">Default Location</Label>
                  <p className="text-sm text-muted-foreground mb-2">Set your default weather location</p>
                  <div className="flex gap-2">
                    <Input placeholder="Los Angeles" />
                    <Button>Save</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 font-heading">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Profile */}
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl">
                      {userName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{userName}</h3>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                  />
                </div>
                
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                {/* Account Actions */}
                <div className="grid gap-2">
                  <Button variant="default" className="w-full">Save Changes</Button>
                  <Button variant="outline" className="w-full">Change Password</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 font-heading">Notification Settings</h2>
              
              <div className="space-y-6">
                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive weather alerts and notifications</p>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
                
                {/* Weather Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Severe Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about severe weather conditions</p>
                  </div>
                  <Switch />
                </div>
                
                {/* Daily Forecast Notification */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Daily Forecast</Label>
                    <p className="text-sm text-muted-foreground">Receive daily weather forecast summary</p>
                  </div>
                  <Switch />
                </div>
                
                {/* Precipitation Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rain & Snow Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified before rain or snow begins</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 font-heading">Advanced Settings</h2>
              
              <div className="space-y-6">
                {/* Data Refresh Rate */}
                <div className="grid gap-4">
                  <div>
                    <Label className="text-base">Data Refresh Rate</Label>
                    <p className="text-sm text-muted-foreground">How often to update weather data (minutes)</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Slider 
                      className="col-span-3"
                      value={[dataRefresh]} 
                      min={5} 
                      max={60} 
                      step={5}
                      onValueChange={(value) => setDataRefresh(value[0])} 
                    />
                    <span className="font-medium">{dataRefresh} min</span>
                  </div>
                </div>
                
                {/* Weather API Provider */}
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base font-medium">Weather API Provider</Label>
                      <p className="text-sm text-muted-foreground">Select data source for weather information</p>
                    </div>
                    <Select value={apiProvider} onValueChange={setApiProvider}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openweathermap">OpenWeatherMap</SelectItem>
                        <SelectItem value="weatherapi">WeatherAPI.com</SelectItem>
                        <SelectItem value="openmeteo">Open-Meteo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Data Management */}
                <div className="grid gap-4">
                  <Label className="text-base">Data Management</Label>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">Clear Cache</Button>
                    <Button variant="outline" className="flex-1">Reset Settings</Button>
                  </div>
                </div>
                
                {/* Export Data */}
                <div className="grid gap-2">
                  <Label className="text-base">Export Data</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Export Options</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart className="mr-2 h-4 w-4" />
                        Export as JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* About Section */}
        <Card className="p-6 mt-6 bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">WeatherMood</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}