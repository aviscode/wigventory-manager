import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { WigFormFields } from "./wigs/WigFormFields";

interface AddWigModalProps {
  open: boolean;
  onClose: () => void;
}

const AddWigModal = ({ open, onClose }: AddWigModalProps) => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!wigData.barcode) newErrors.barcode = "Barcode is required";
    if (!wigData.name) newErrors.name = "Name is required";
    if (!wigData.style) newErrors.style = "Style is required";
    if (!wigData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(wigData.price)) || Number(wigData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting wig data:", wigData);

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const { error } = await supabase
        .from('wigs')
        .insert([{
          ...wigData,
          price: Number(wigData.price),
          cost_price: wigData.cost_price ? Number(wigData.cost_price) : null,
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
          <WigFormFields
            wigData={wigData}
            setWigData={setWigData}
            errors={errors}
          />
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