import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenDetails } from "./types";

interface TokenFormProps {
  tokenDetails: TokenDetails;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TokenForm = ({ tokenDetails, onInputChange }: TokenFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Token Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., My Token"
          value={tokenDetails.name}
          onChange={onInputChange}
          className="bg-background/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol">Token Symbol</Label>
        <Input
          id="symbol"
          name="symbol"
          placeholder="e.g., MTK"
          value={tokenDetails.symbol}
          onChange={onInputChange}
          className="bg-background/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialSupply">Initial Supply</Label>
        <Input
          id="initialSupply"
          name="initialSupply"
          type="number"
          placeholder="e.g., 1000000"
          value={tokenDetails.initialSupply}
          onChange={onInputChange}
          className="bg-background/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="decimals">Decimals</Label>
        <Input
          id="decimals"
          name="decimals"
          type="number"
          placeholder="18"
          value={tokenDetails.decimals}
          onChange={onInputChange}
          className="bg-background/50 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};