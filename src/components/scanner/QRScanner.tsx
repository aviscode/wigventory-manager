import { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onScan: (code: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      setScanning(true);

      const qrCodeSuccessCallback = (decodedText: string) => {
        console.log('QR Code scanned:', decodedText);
        onScan(decodedText);
        html5QrCode.stop();
        setScanning(false);
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        undefined
      );
    } catch (err) {
      console.error('Scanner error:', err);
      toast.error("Failed to start camera. Please check permissions.");
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div id="reader" className={scanning ? "w-full max-w-sm" : "hidden"} />
      {!scanning && (
        <Button 
          variant="outline" 
          onClick={startScanner}
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          Scan QR Code
        </Button>
      )}
    </div>
  );
};

export default QRScanner;