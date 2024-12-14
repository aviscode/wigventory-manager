import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WigTableHeader } from "./wigs/WigTableHeader";
import { WigDetailsDialog } from "./wigs/WigDetailsDialog";
import { DeleteWigDialog } from "./wigs/DeleteWigDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WigFormFields } from "./wigs/WigFormFields";

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

  const { data: wigs, isLoading } = useQuery({
    queryKey: ['wigs'],
    queryFn: async () => {
      console.log('Fetching wigs from Supabase...');
      const { data, error } = await supabase
        .from('wigs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wigs:', error);
        throw error;
      }
      
      console.log('Fetched wigs:', data);
      return data;
    },
  });

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
      // Apply column filters
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
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {/* Mobile view */}
          <div className="md:hidden">
            {filteredAndSortedWigs.map((wig) => (
              <div
                key={wig.id}
                className="p-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedWig(wig)}
              >
                <div className="font-medium">{wig.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  <div>Style: {wig.style}</div>
                  <div>Color: {wig.color}</div>
                  <div>Price: ${wig.price}</div>
                  <div>Status: {wig.status}</div>
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(wig);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteWig(wig);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <Table className="hidden md:table">
            <WigTableHeader
              onSort={handleSort}
              sortConfig={sortConfig}
              onFilterChange={handleFilterChange}
              filterValues={filterValues}
            />
            <TableBody>
              {filteredAndSortedWigs.map((wig) => (
                <TableRow
                  key={wig.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedWig(wig)}
                >
                  <TableCell>{wig.barcode}</TableCell>
                  <TableCell className="font-medium">{wig.name}</TableCell>
                  <TableCell>{wig.style}</TableCell>
                  <TableCell>{wig.color}</TableCell>
                  <TableCell>${wig.price}</TableCell>
                  <TableCell>{wig.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(wig);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteWig(wig);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Wig Details Dialog */}
      <WigDetailsDialog
        wig={selectedWig}
        open={!!selectedWig}
        onClose={() => setSelectedWig(null)}
      />

      {/* Delete Confirmation Dialog */}
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

      {/* Edit Dialog */}
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