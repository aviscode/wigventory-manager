import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
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

  const sortedWigs = [...(wigs || [])].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const filteredWigs = sortedWigs.filter(
    (wig) =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEdit = async (wig: any) => {
    setSelectedWig(wig);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
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
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {/* Mobile view */}
          <div className="md:hidden">
            {filteredWigs.map((wig) => (
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
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort('barcode')}
                >
                  Barcode {renderSortIcon('barcode')}
                </TableHead>
                <TableHead 
                  className="min-w-[150px] cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name {renderSortIcon('name')}
                </TableHead>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort('style')}
                >
                  Style {renderSortIcon('style')}
                </TableHead>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort('color')}
                >
                  Color {renderSortIcon('color')}
                </TableHead>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  Price {renderSortIcon('price')}
                </TableHead>
                <TableHead 
                  className="min-w-[100px] cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {renderSortIcon('status')}
                </TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWigs.map((wig) => (
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
      <Dialog open={!!selectedWig} onOpenChange={() => setSelectedWig(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Wig Details</DialogTitle>
          </DialogHeader>
          {selectedWig && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Barcode:</span> {selectedWig.barcode}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {selectedWig.name}
                </div>
                <div>
                  <span className="font-semibold">Style:</span> {selectedWig.style}
                </div>
                <div>
                  <span className="font-semibold">Length:</span> {selectedWig.length}
                </div>
                <div>
                  <span className="font-semibold">Color:</span> {selectedWig.color}
                </div>
                <div>
                  <span className="font-semibold">Hair Type:</span> {selectedWig.hair_type}
                </div>
                <div>
                  <span className="font-semibold">Hair Texture:</span> {selectedWig.hair_texture}
                </div>
                <div>
                  <span className="font-semibold">Size:</span> {selectedWig.size}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Price:</span> ${selectedWig.price}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {selectedWig.status}
                </div>
                <div>
                  <span className="font-semibold">Client Name:</span> {selectedWig.client_name || "-"}
                </div>
                <div>
                  <span className="font-semibold">New Order:</span> {selectedWig.new_order ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {selectedWig.location}
                </div>
                <div>
                  <span className="font-semibold">Cost Price:</span> ${selectedWig.cost_price}
                </div>
                <div>
                  <span className="font-semibold">Receive Date:</span> {selectedWig.receive_date}
                </div>
                <div>
                  <span className="font-semibold">Sold Date:</span> {selectedWig.sold_date || "-"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteWig} onOpenChange={() => setDeleteWig(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the wig "{deleteWig?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWig(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WigTable;