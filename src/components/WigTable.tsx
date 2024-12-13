import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { mockWigs } from "@/lib/mockData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface WigTableProps {
  searchTerm: string;
}

const WigTable = ({ searchTerm }: WigTableProps) => {
  const [selectedWig, setSelectedWig] = useState<typeof mockWigs[0] | null>(null);

  const filteredWigs = mockWigs.filter(
    (wig) =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    toast.info("Delete functionality coming soon!");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
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
                <TableRow key={wig.id} className="cursor-pointer hover:bg-gray-50">
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
                        onClick={() => setSelectedWig(wig)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(wig.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(wig.id)}
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
                  <span className="font-semibold">Hair Type:</span> {selectedWig.hairType}
                </div>
                <div>
                  <span className="font-semibold">Hair Texture:</span> {selectedWig.hairTexture}
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
                  <span className="font-semibold">Client Name:</span> {selectedWig.clientName || "-"}
                </div>
                <div>
                  <span className="font-semibold">New Order:</span> {selectedWig.newOrder ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {selectedWig.location}
                </div>
                <div>
                  <span className="font-semibold">Cost Price:</span> ${selectedWig.costPrice}
                </div>
                <div>
                  <span className="font-semibold">Receive Date:</span> {selectedWig.receiveDate}
                </div>
                <div>
                  <span className="font-semibold">Sold Date:</span> {selectedWig.soldDate || "-"}
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