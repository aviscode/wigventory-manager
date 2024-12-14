import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/4e851ff1-ef19-4719-8df7-40bcecf97763.png" 
              alt="Rivky Wigs Logo" 
              className="h-10"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;