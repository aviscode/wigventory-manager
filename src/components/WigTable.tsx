import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface WigTableProps {
  searchTerm: string;
}

const WigTable = ({ searchTerm }: WigTableProps) => {
  const [selectedWig, setSelectedWig] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch wigs from Supabase
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

  const filteredWigs = wigs?.filter(
    (wig) =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const handleEdit = async (wig: any) => {
    setSelectedWig(wig);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this wig?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('wigs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting wig:', error);
      toast.error("Failed to delete wig");
      return;
    }

    toast.success("Wig deleted successfully!");
    queryClient.invalidateQueries({ queryKey: ['wigs'] });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

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
                      handleDelete(wig.id);
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
                <TableHead className="min-w-[100px]">Barcode</TableHead>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[100px]">Style</TableHead>
                <TableHead className="min-w-[100px]">Color</TableHead>
                <TableHead className="min-w-[100px]">Price</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
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
                          handleDelete(wig.id);
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
    </>
  );
};

export default WigTable;