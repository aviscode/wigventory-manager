import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { mockWigs } from "@/lib/mockData";

const Scanner = () => {
  const [wigId, setWigId] = useState("");
  const [foundWig, setFoundWig] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const wig = mockWigs.find((w) => w.id === wigId);
    if (wig) {
      setFoundWig(wig);
      toast.success("Wig found!");
    } else {
      toast.error("Wig not found!");
      setFoundWig(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Wig Lookup</h1>
          <p className="mt-2 text-gray-600">Enter a wig ID or scan QR code</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Wig ID"
              value={wigId}
              onChange={(e) => setWigId(e.target.value)}
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>

        <Button
          variant="outline"
          className="w-full mb-8"
          onClick={() => toast.info("QR Scanner coming soon!")}
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scan QR Code
        </Button>

        {foundWig && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{foundWig.name}</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Style:</span> {foundWig.style}
              </p>
              <p>
                <span className="font-medium">Color:</span> {foundWig.color}
              </p>
              <p>
                <span className="font-medium">Length:</span> {foundWig.length}
              </p>
              <p>
                <span className="font-medium">Price:</span> ${foundWig.price}
              </p>
              <p>
                <span className="font-medium">Stock:</span> {foundWig.stock}
              </p>
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