import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WigFormFieldsProps {
  wigData: any;
  setWigData: (data: any) => void;
  errors: Record<string, string>;
}

export const WigFormFields = ({ wigData, setWigData, errors }: WigFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode *</Label>
        <Input
          id="barcode"
          value={wigData.barcode}
          onChange={(e) => setWigData({ ...wigData, barcode: e.target.value })}
          className={errors.barcode ? "border-red-500" : ""}
        />
        {errors.barcode && <p className="text-sm text-red-500">{errors.barcode}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={wigData.name}
          onChange={(e) => setWigData({ ...wigData, name: e.target.value })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style *</Label>
              <Input
                id="style"
                value={wigData.style}
                onChange={(e) => setWigData({ ...wigData, style: e.target.value })}
                className={errors.style ? "border-red-500" : ""}
              />
              {errors.style && <p className="text-sm text-red-500">{errors.style}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                value={wigData.length}
                onChange={(e) => setWigData({ ...wigData, length: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={wigData.color}
                onChange={(e) => setWigData({ ...wigData, color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairType">Hair Type</Label>
              <Select
                value={wigData.hair_type}
                onValueChange={(value) => setWigData({ ...wigData, hair_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Human Hair">Human Hair</SelectItem>
                  <SelectItem value="Synthetic">Synthetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairTexture">Hair Texture</Label>
              <Input
                id="hairTexture"
                value={wigData.hair_texture}
                onChange={(e) => setWigData({ ...wigData, hair_texture: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={wigData.size}
                onValueChange={(value) => setWigData({ ...wigData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                value={wigData.price}
                onChange={(e) => setWigData({ ...wigData, price: e.target.value })}
                className={errors.price ? "border-red-500" : ""}
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($)</Label>
              <Input
                id="costPrice"
                type="number"
                value={wigData.cost_price}
                onChange={(e) => setWigData({ ...wigData, cost_price: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={wigData.status}
                onValueChange={(value) => setWigData({ ...wigData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={wigData.client_name}
                onChange={(e) => setWigData({ ...wigData, client_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={wigData.location}
                onChange={(e) => setWigData({ ...wigData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiveDate">Receive Date</Label>
              <Input
                id="receiveDate"
                type="date"
                value={wigData.receive_date}
                onChange={(e) => setWigData({ ...wigData, receive_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOrder">New Order</Label>
              <Select
                value={wigData.new_order ? "yes" : "no"}
                onValueChange={(value) => setWigData({ ...wigData, new_order: value === "yes" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
    </div>
  );
};
