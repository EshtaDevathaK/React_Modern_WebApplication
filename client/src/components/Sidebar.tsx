import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Cloud, 
  MapPin, 
  BarChart2, 
  CalendarDays, 
  Settings,
  Menu,
  X
} from "lucide-react";

const Sidebar: FC = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Cloud, label: "Forecast", path: "/forecast" },
    { icon: MapPin, label: "Locations", path: "/locations" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobileView && (
        <button 
          className="fixed top-4 left-4 z-50 bg-primary p-2 rounded-full shadow-md text-white" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}
      
      {/* Sidebar - Desktop version */}
      <aside 
        className={`
          bg-navy fixed md:static top-0 left-0 h-full z-40
          ${isMobileView ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 md:w-48 lg:w-60 md:min-h-screen py-5 md:py-8 px-4 md:px-6 flex flex-col
        `}
      >
        <div className="flex items-center space-x-3 mb-10 mt-12 md:mt-0">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-white font-heading font-semibold text-xl">WeatherMood</h1>
        </div>
        
        <nav className="flex flex-col w-full space-y-2 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center space-x-3 ${
                location === item.path 
                  ? "text-white bg-primary-dark bg-opacity-30" 
                  : "text-gray-400 hover:text-white"
              } transition-colors duration-200 rounded-lg px-4 py-3 w-full`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 px-2">
          <div className="text-xs text-gray-400 mb-2">Current location</div>
          <div className="bg-navy-800 bg-opacity-50 px-3 py-2 rounded-lg">
            <p className="text-white text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary-light" />
              <span className="truncate">Los Angeles</span>
            </p>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileView && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Spacer for mobile view when menu is closed */}
      {isMobileView && !isOpen && (
        <div className="h-16 md:hidden" /> 
      )}
    </>
  );
};

export default Sidebar;
