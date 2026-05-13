import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import defaultQr from "@/assets/upi-qr.jpeg";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount?: string;
  title?: string;
  qrUrl?: string | null;
};

const PayQRDialog = ({ open, onOpenChange, amount, title = "Scan to Pay", qrUrl }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {amount ? (
              <>Pay <span className="font-bold text-foreground">{amount}</span> via any UPI app</>
            ) : (
              <>Scan with any UPI app to pay</>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <img
            src={qrUrl || defaultQr}
            alt="UPI QR code for Shlok Pravin Bagore"
            className="w-full max-w-xs rounded-2xl shadow-card"
          />
          <div className="text-center text-sm text-muted-foreground">
            UPI ID: <span className="font-semibold text-foreground">9356914328@ptsbi</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Works with Paytm, PhonePe, GPay, BHIM and any UPI app.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayQRDialog;
