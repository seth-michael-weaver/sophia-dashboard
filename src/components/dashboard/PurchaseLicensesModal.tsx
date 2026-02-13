import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, CheckCircle } from "lucide-react";

interface PurchaseLicensesModalProps {
  open: boolean;
  onClose: () => void;
}

const tiers = [
  { label: "1–25 licenses", pricePerLicense: 120, discount: null, min: 1, max: 25 },
  { label: "26–50 licenses", pricePerLicense: 108, discount: "10% off", min: 26, max: 50 },
  { label: "51–100 licenses", pricePerLicense: 96, discount: "20% off", min: 51, max: 100 },
];

const PurchaseLicensesModal = ({ open, onClose }: PurchaseLicensesModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const tier = tiers.find((t) => quantity >= t.min && quantity <= t.max) || (quantity > 100 ? tiers[2] : tiers[0]);
  const total = quantity * tier.pricePerLicense;

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => {
      setPurchased(false);
      setQuantity(1);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Purchase Licenses
          </DialogTitle>
          <DialogDescription>Select the number of licenses you need.</DialogDescription>
        </DialogHeader>

        {purchased ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="text-sm font-semibold text-foreground">Purchase Submitted!</p>
            <p className="text-xs text-muted-foreground">{quantity} licenses requested.</p>
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            {/* Pricing tiers */}
            <div className="space-y-2">
              {tiers.map((t) => (
                <div
                  key={t.label}
                  className={`rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    quantity >= t.min && quantity <= t.max
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setQuantity(t.min)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t.label}</span>
                    <div className="flex items-center gap-2">
                      {t.discount && (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">{t.discount}</span>
                      )}
                      <span className="text-sm font-bold text-foreground">${t.pricePerLicense}<span className="text-xs text-muted-foreground font-normal">/each</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity input */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Number of Licenses</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="text-sm"
              />
            </div>

            {/* Total */}
            <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{quantity} licenses × ${tier.pricePerLicense}</p>
                {tier.discount && <p className="text-[10px] text-success font-medium">{tier.discount} applied</p>}
              </div>
              <p className="text-2xl font-bold text-foreground">${total.toLocaleString()}</p>
            </div>

            <Button className="w-full gap-2" onClick={handlePurchase}>
              <ShoppingCart className="h-4 w-4" />
              Purchase {quantity} License{quantity > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseLicensesModal;
