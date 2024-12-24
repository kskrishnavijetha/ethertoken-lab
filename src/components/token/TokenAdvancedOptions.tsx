import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface WalletDistribution {
  address: string;
  percentage: string;
}

interface TokenAdvancedOptionsProps {
  onDistributionChange: (wallets: WalletDistribution[]) => void;
}

export const TokenAdvancedOptions = ({ onDistributionChange }: TokenAdvancedOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMultiWallet, setIsMultiWallet] = useState(false);
  const [wallets, setWallets] = useState<WalletDistribution[]>([
    { address: "", percentage: "50" },
    { address: "", percentage: "50" },
  ]);

  const handleAddWallet = () => {
    if (wallets.length < 10) {
      setWallets([...wallets, { address: "", percentage: "0" }]);
    }
  };

  const handleRemoveWallet = (index: number) => {
    if (wallets.length > 2) {
      const newWallets = wallets.filter((_, i) => i !== index);
      setWallets(newWallets);
      onDistributionChange(newWallets);
    }
  };

  const handleWalletChange = (index: number, field: keyof WalletDistribution, value: string) => {
    const newWallets = wallets.map((wallet, i) => {
      if (i === index) {
        return { ...wallet, [field]: value };
      }
      return wallet;
    });
    setWallets(newWallets);
    onDistributionChange(newWallets);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Advanced Options</Label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:underline focus:outline-none"
        >
          {isExpanded ? "▼" : "▶"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label>Multiple wallets Distribution</Label>
                <span className="text-xs text-muted-foreground">(+0.01 ETH)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Distribute the supply of your token on different wallets within the creation. (maximum 10 wallets)
              </p>
            </div>
            <Switch
              checked={isMultiWallet}
              onCheckedChange={(checked) => setIsMultiWallet(checked)}
            />
          </div>

          {isMultiWallet && (
            <div className="space-y-4 p-4 rounded-lg border bg-card">
              <Label>Token supply split</Label>
              <div className="space-y-2">
                {wallets.map((wallet, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Type wallet address"
                      value={wallet.address}
                      onChange={(e) => handleWalletChange(index, "address", e.target.value)}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={wallet.percentage}
                      onChange={(e) => handleWalletChange(index, "percentage", e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm">%</span>
                    {wallets.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveWallet(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {wallets.length < 10 && (
                <Button
                  variant="outline"
                  onClick={handleAddWallet}
                  className="w-full"
                >
                  Add Another Wallet {wallets.length}/10
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};