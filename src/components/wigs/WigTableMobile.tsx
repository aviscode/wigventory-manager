import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface WigTableMobileProps {
  wigs: any[];
  onEdit: (wig: any) => void;
  onDelete: (wig: any) => void;
  onSelect: (wig: any) => void;
}

export const WigTableMobile = ({ wigs, onEdit, onDelete, onSelect }: WigTableMobileProps) => {
  return (
    <div className="md:hidden">
      {wigs.map((wig) => (
        <div
          key={wig.id}
          className="p-4 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect(wig)}
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
                onEdit(wig);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(wig);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};