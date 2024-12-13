import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { mockWigs } from "@/lib/mockData";
import { toast } from "sonner";

interface WigTableProps {
  searchTerm: string;
}

const WigTable = ({ searchTerm }: WigTableProps) => {
  const filteredWigs = mockWigs.filter(
    (wig) =>
      wig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wig.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    toast.info("Delete functionality coming soon!");
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[100px]">Style</TableHead>
              <TableHead className="min-w-[100px]">Color</TableHead>
              <TableHead className="min-w-[100px]">Length</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
              <TableHead className="min-w-[80px]">Stock</TableHead>
              <TableHead className="min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWigs.map((wig) => (
              <TableRow key={wig.id}>
                <TableCell className="font-medium">{wig.name}</TableCell>
                <TableCell>{wig.style}</TableCell>
                <TableCell>{wig.color}</TableCell>
                <TableCell>{wig.length}</TableCell>
                <TableCell>${wig.price}</TableCell>
                <TableCell>{wig.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
  );
};

export default WigTable;