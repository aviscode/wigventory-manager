import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WigTable from "@/components/WigTable";
import AddWigModal from "@/components/AddWigModal";
import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wig Inventory" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="overflow-x-auto">
          <WigTable searchTerm={searchTerm} />
        </div>
        <AddWigModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </div>
  );
};

export default Inventory;