import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { WigFormFields } from "./WigFormFields";
import { WigDetailsDialog } from "./WigDetailsDialog";
import { DeleteWigDialog } from "./DeleteWigDialog";
import { WigTableLoading } from "./WigTableLoading";
import { WigTableMobile } from "./WigTableMobile";
import { WigTableDesktop } from "./WigTableDesktop";
import { WigTableHeader } from "./WigTableHeader";

interface WigTableViewProps {
  wigs: any[];
  isLoading: boolean;
  error: Error | null;
  selectedWig: any;
  setSelectedWig: (wig: any) => void;
  deleteWig: any;
  setDeleteWig: (wig: any) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editWigData: any;
  setEditWigData: (data: any) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  filterValues: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
}

const WigTableView = ({
  wigs,
  isLoading,
  error,
  selectedWig,
  setSelectedWig,
  deleteWig,
  setDeleteWig,
  isEditDialogOpen,
  setIsEditDialogOpen,
  editWigData,
  setEditWigData,
  sortConfig,
  onSort,
  filterValues,
  onFilterChange,
}: WigTableViewProps) => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editWigData.barcode) newErrors.barcode = "Barcode is required";
    if (!editWigData.name) newErrors.name = "Name is required";
    if (!editWigData.style) newErrors.style = "Style is required";
    if (!editWigData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(editWigData.price)) || Number(editWigData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const { error } = await supabase
        .from('wigs')
        .update({
          ...editWigData,
          price: Number(editWigData.price),
          cost_price: editWigData.cost_price ? Number(editWigData.cost_price) : null,
        })
        .eq('id', editWigData.id);

      if (error) throw error;

      toast.success("Wig updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['wigs'] });
      setIsEditDialogOpen(false);
      setEditWigData(null);
    } catch (error) {
      console.error('Error updating wig:', error);
      toast.error("Failed to update wig");
    }
  };

  if (error) {
    console.error('Error in WigTableView:', error);
    toast.error("Failed to load inventory");
    return <div className="p-4 text-red-500">Error loading inventory</div>;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <WigTableHeader
              onSort={onSort}
              sortConfig={sortConfig}
              onFilterChange={onFilterChange}
              filterValues={filterValues}
            />
            <TableBody>
              <WigTableLoading />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <WigTableMobile
            wigs={wigs}
            onEdit={setEditWigData}
            onDelete={setDeleteWig}
            onSelect={setSelectedWig}
          />
          <WigTableDesktop
            wigs={wigs}
            onEdit={setEditWigData}
            onDelete={setDeleteWig}
            onSelect={setSelectedWig}
            onSort={onSort}
            sortConfig={sortConfig}
            onFilterChange={onFilterChange}
            filterValues={filterValues}
          />
        </div>
      </div>

      <WigDetailsDialog
        wig={selectedWig}
        open={!!selectedWig}
        onClose={() => setSelectedWig(null)}
      />

      <DeleteWigDialog
        wig={deleteWig}
        open={!!deleteWig}
        onClose={() => setDeleteWig(null)}
        onConfirm={async () => {
          if (!deleteWig) return;
          const { error } = await supabase
            .from('wigs')
            .delete()
            .eq('id', deleteWig.id);

          if (error) {
            console.error('Error deleting wig:', error);
            toast.error("Failed to delete wig");
            return;
          }

          toast.success("Wig deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ['wigs'] });
          setDeleteWig(null);
        }}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={() => {
        setIsEditDialogOpen(false);
        setEditWigData(null);
        setErrors({});
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Wig</DialogTitle>
          </DialogHeader>
          {editWigData && (
            <div className="space-y-4">
              <WigFormFields
                wigData={editWigData}
                setWigData={setEditWigData}
                errors={errors}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditWigData(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEdit}
                  className="bg-primary hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WigTableView;
