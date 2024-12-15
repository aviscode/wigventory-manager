import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { WigTableHeader } from "./WigTableHeader";

interface WigTableDesktopProps {
  wigs: any[];
  onEdit: (wig: any) => void;
  onDelete: (wig: any) => void;
  onSelect: (wig: any) => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onFilterChange: (column: string, value: string) => void;
  filterValues: Record<string, string>;
}

export const WigTableDesktop = ({
  wigs,
  onEdit,
  onDelete,
  onSelect,
  onSort,
  sortConfig,
  onFilterChange,
  filterValues,
}: WigTableDesktopProps) => {
  return (
    <Table className="hidden md:table">
      <WigTableHeader
        onSort={onSort}
        sortConfig={sortConfig}
        onFilterChange={onFilterChange}
        filterValues={filterValues}
      />
      <TableBody>
        {wigs.map((wig) => (
          <TableRow
            key={wig.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect(wig)}
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
                    onEdit(wig);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(wig);
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
  );
};