import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WigTable from "@/components/WigTable";
import AddWigModal from "@/components/AddWigModal";
import { Search, LogOut, Plus, Menu } from "lucide-react";
import { toast } from "sonner";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Wig Inventory</h1>
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
          
          {/* Mobile Menu */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Section */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search wigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Wig
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <WigTable searchTerm={searchTerm} />
        </div>
        <AddWigModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </div>
  );
};

export default Inventory;