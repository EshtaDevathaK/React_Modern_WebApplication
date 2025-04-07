import { FC, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Bell, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/protected-route";

interface HeaderProps {
  onSearch: (location: string) => void;
}

const Header: FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  return (
    <header className="bg-white rounded-xl shadow-soft p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <form className="relative flex-1" onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search locations..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-primary-dark transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${username}&background=random`} />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{username}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => setLocation("/settings")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
