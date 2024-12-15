import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { WigFormFields } from "./wigs/WigFormFields";
import { WigDetailsDialog } from "./wigs/WigDetailsDialog";
import { DeleteWigDialog } from "./wigs/DeleteWigDialog";
import { WigTableLoading } from "./wigs/WigTableLoading";
import { WigTableMobile } from "./wigs/WigTableMobile";
import { WigTableDesktop } from "./wigs/WigTableDesktop";
import { WigTableHeader } from "./wigs/WigTableHeader";
import { Button } from "./ui/button";

interface WigTableProps {
  searchTerm: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

const WigTable = ({ searchTerm }: WigTableProps) => {
  const [selectedWig, setSelectedWig] = useState<any | null>(null);
  const [deleteWig, setDeleteWig] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editWigData, setEditWigData] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  console.log('Rendering WigTable component');

  const { data: wigs, isLoading, error } = useQuery({
    queryKey: ['wigs'],
    queryFn: async () => {
      console.log('Fetching wigs from Supabase...');
      const { data, error } = await supabase
        .from('wigs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wigs:', error);
        toast.error("Failed to load wigs");
        throw error;
      }
      
      console.log('Fetched wigs:', data);
      return data;
    },
  });

  if (error) {
    console.error('Error in WigTable:', error);
    toast.error("Failed to load inventory");
    return <div className="p-4 text-red-500">Error loading inventory</div>;
  }

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleEdit = (wig: any) => {
    setEditWigData(wig);
    setIsEditDialogOpen(true);
  };

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

  const filteredAndSortedWigs = (wigs || [])
    .filter(wig => {
      return Object.entries(filterValues).every(([column, value]) => {
        if (!value) return true;
        return String(wig[column]).toLowerCase().includes(value.toLowerCase());
      });
    })
    .filter(wig =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

  if (isLoading) {
    console.log('WigTable is in loading state');
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <WigTableHeader
              onSort={handleSort}
              sortConfig={sortConfig}
              onFilterChange={handleFilterChange}
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

  console.log('WigTable rendering with data:', filteredAndSortedWigs);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <WigTableMobile
            wigs={filteredAndSortedWigs}
            onEdit={handleEdit}
            onDelete={setDeleteWig}
            onSelect={setSelectedWig}
          />
          <WigTableDesktop
            wigs={filteredAndSortedWigs}
            onEdit={handleEdit}
            onDelete={setDeleteWig}
            onSelect={setSelectedWig}
            onSort={handleSort}
            sortConfig={sortConfig}
            onFilterChange={handleFilterChange}
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

export default WigTable;
