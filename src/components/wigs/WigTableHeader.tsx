import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WigTableHeaderProps {
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onFilterChange: (column: string, value: string) => void;
  filterValues: Record<string, string>;
}

export const WigTableHeader = ({ onSort, sortConfig, onFilterChange, filterValues }: WigTableHeaderProps) => {
  const columns = [
    { key: 'barcode', label: 'Barcode' },
    { key: 'name', label: 'Name' },
    { key: 'style', label: 'Style' },
    { key: 'color', label: 'Color' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className="min-w-[100px] cursor-pointer"
            onClick={() => onSort(column.key)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                {column.label}{' '}
                <ArrowUpDown className={`ml-2 h-4 w-4 ${
                  sortConfig?.key === column.key ? 'text-primary' : ''
                }`} />
              </div>
              <Select
                value={filterValues[column.key] || ''}
                onValueChange={(value) => onFilterChange(column.key, value)}
                onClick={(e) => e.stopPropagation()}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Filter..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {/* Add filter options based on unique values */}
                </SelectContent>
              </Select>
            </div>
          </TableHead>
        ))}
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};