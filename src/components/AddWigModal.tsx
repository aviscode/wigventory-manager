import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddWigModalProps {
  open: boolean;
  onClose: () => void;
}

const AddWigModal = ({ open, onClose }: AddWigModalProps) => {
  const queryClient = useQueryClient();
  const [wigData, setWigData] = useState({
    barcode: "",
    name: "",
    style: "",
    length: "",
    color: "",
    hair_type: "",
    hair_texture: "",
    size: "",
    price: "",
    status: "In Stock",
    client_name: "",
    new_order: false,
    location: "",
    cost_price: "",
    receive_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting wig data:", wigData);

    try {
      const { error } = await supabase
        .from('wigs')
        .insert([{
          ...wigData,
          price: parseFloat(wigData.price),
          cost_price: wigData.cost_price ? parseFloat(wigData.cost_price) : null,
        }]);

      if (error) throw error;

      toast.success("Wig added successfully!");
      queryClient.invalidateQueries({ queryKey: ['wigs'] });
      onClose();
    } catch (error) {
      console.error('Error adding wig:', error);
      toast.error("Failed to add wig");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Wig</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={wigData.barcode}
                onChange={(e) => setWigData({ ...wigData, barcode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={wigData.name}
                onChange={(e) => setWigData({ ...wigData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                value={wigData.style}
                onChange={(e) => setWigData({ ...wigData, style: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                value={wigData.length}
                onChange={(e) => setWigData({ ...wigData, length: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={wigData.color}
                onChange={(e) => setWigData({ ...wigData, color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairType">Hair Type</Label>
              <Select
                value={wigData.hair_type}
                onValueChange={(value) => setWigData({ ...wigData, hair_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Human Hair">Human Hair</SelectItem>
                  <SelectItem value="Synthetic">Synthetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairTexture">Hair Texture</Label>
              <Input
                id="hairTexture"
                value={wigData.hair_texture}
                onChange={(e) => setWigData({ ...wigData, hair_texture: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={wigData.size}
                onValueChange={(value) => setWigData({ ...wigData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={wigData.price}
                onChange={(e) => setWigData({ ...wigData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($)</Label>
              <Input
                id="costPrice"
                type="number"
                value={wigData.cost_price}
                onChange={(e) => setWigData({ ...wigData, cost_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={wigData.status}
                onValueChange={(value) => setWigData({ ...wigData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={wigData.client_name}
                onChange={(e) => setWigData({ ...wigData, client_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={wigData.location}
                onChange={(e) => setWigData({ ...wigData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiveDate">Receive Date</Label>
              <Input
                id="receiveDate"
                type="date"
                value={wigData.receive_date}
                onChange={(e) => setWigData({ ...wigData, receive_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOrder">New Order</Label>
              <Select
                value={wigData.new_order ? "yes" : "no"}
                onValueChange={(value) => setWigData({ ...wigData, new_order: value === "yes" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Wig
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWigModal;
