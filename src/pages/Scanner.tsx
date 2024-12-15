import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import QRScanner from "@/components/scanner/QRScanner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

const Scanner = () => {
  const [wigId, setWigId] = useState("");
  const [foundWig, setFoundWig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchWig = async (searchTerm: string) => {
    setLoading(true);
    try {
      console.log('Searching for wig:', searchTerm);
      const { data, error } = await supabase
        .from('wigs')
        .select('*')
        .or(`barcode.eq.${searchTerm},id.eq.${searchTerm}`)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Found wig:', data);
        setFoundWig(data);
        toast.success("Wig found!");
      } else {
        toast.error("Wig not found!");
        setFoundWig(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error("Error searching for wig");
      setFoundWig(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchWig(wigId);
  };

  const handleScan = async (code: string) => {
    setWigId(code);
    await searchWig(code);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wig Scanner" />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Wig ID or Barcode"
              value={wigId}
              onChange={(e) => setWigId(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>

        <QRScanner onScan={handleScan} />

        {foundWig && (
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">{foundWig.name}</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Barcode:</span> {foundWig.barcode}</p>
              <p><span className="font-medium">Style:</span> {foundWig.style}</p>
              <p><span className="font-medium">Color:</span> {foundWig.color}</p>
              <p><span className="font-medium">Length:</span> {foundWig.length}</p>
              <p><span className="font-medium">Price:</span> ${foundWig.price}</p>
              <p><span className="font-medium">Status:</span> {foundWig.status}</p>
            </div>
          </Card>
        )}

        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate("/inventory")}
        >
          Back to Inventory
        </Button>
      </div>
    </div>
  );
};

export default Scanner;