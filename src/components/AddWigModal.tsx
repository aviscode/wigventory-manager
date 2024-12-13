import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddWigModalProps {
  open: boolean;
  onClose: () => void;
}

const AddWigModal = ({ open, onClose }: AddWigModalProps) => {
  const [wigData, setWigData] = useState({
    name: "",
    style: "",
    color: "",
    length: "",
    price: "",
    stock: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Wig added successfully!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Wig</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={wigData.color}
              onChange={(e) => setWigData({ ...wigData, color: e.target.value })}
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
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={wigData.price}
              onChange={(e) => setWigData({ ...wigData, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={wigData.stock}
              onChange={(e) => setWigData({ ...wigData, stock: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
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