import { FC } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Cloud, 
  MapPin, 
  BarChart2, 
  CalendarDays, 
  Settings 
} from "lucide-react";

const Sidebar: FC = () => {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Cloud, label: "Forecast", path: "/forecast" },
    { icon: MapPin, label: "Locations", path: "/locations" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="bg-navy w-full md:w-48 lg:w-60 md:min-h-screen py-5 md:py-8 px-4 md:px-6 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-start space-y-0 md:space-y-8">
      <div className="flex items-center space-x-3 mb-0 md:mb-10">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
          <Cloud className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-white font-heading font-semibold hidden md:block">WeatherMood</h1>
      </div>
      
      <nav className="flex flex-row md:flex-col justify-around md:justify-start w-full space-y-0 md:space-y-4">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center space-x-3 ${
              location === item.path 
                ? "text-white bg-primary-dark bg-opacity-30" 
                : "text-gray-400 hover:text-white"
            } transition-colors duration-200 rounded-lg px-3 py-2 w-auto md:w-full`}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
