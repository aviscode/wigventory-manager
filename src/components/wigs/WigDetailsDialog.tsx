import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WigDetailsDialogProps {
  wig: any;
  open: boolean;
  onClose: () => void;
}

export const WigDetailsDialog = ({ wig, open, onClose }: WigDetailsDialogProps) => {
  if (!wig) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Wig Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Barcode:</span> {wig.barcode}
            </div>
            <div>
              <span className="font-semibold">Name:</span> {wig.name}
            </div>
            <div>
              <span className="font-semibold">Style:</span> {wig.style}
            </div>
            <div>
              <span className="font-semibold">Length:</span> {wig.length}
            </div>
            <div>
              <span className="font-semibold">Color:</span> {wig.color}
            </div>
            <div>
              <span className="font-semibold">Hair Type:</span> {wig.hair_type}
            </div>
            <div>
              <span className="font-semibold">Hair Texture:</span> {wig.hair_texture}
            </div>
            <div>
              <span className="font-semibold">Size:</span> {wig.size}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Price:</span> ${wig.price}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {wig.status}
            </div>
            <div>
              <span className="font-semibold">Client Name:</span> {wig.client_name || "-"}
            </div>
            <div>
              <span className="font-semibold">New Order:</span> {wig.new_order ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Location:</span> {wig.location}
            </div>
            <div>
              <span className="font-semibold">Cost Price:</span> ${wig.cost_price}
            </div>
            <div>
              <span className="font-semibold">Receive Date:</span> {wig.receive_date}
            </div>
            <div>
              <span className="font-semibold">Sold Date:</span> {wig.sold_date || "-"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
