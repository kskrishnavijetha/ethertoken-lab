import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TokenDetails } from "./types";

interface TokenFeaturesProps {
  tokenDetails: TokenDetails;
  onToggleChange: (feature: keyof TokenDetails) => void;
}

export const TokenFeatures = ({ tokenDetails, onToggleChange }: TokenFeaturesProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Minting Support</Label>
          <p className="text-sm text-muted-foreground">Enable minting for your token, only the owner can mint.</p>
        </div>
        <Switch
          checked={tokenDetails.mintingSupport}
          onCheckedChange={() => onToggleChange('mintingSupport')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Burning Support</Label>
          <p className="text-sm text-muted-foreground">Enable burning for your token.</p>
        </div>
        <Switch
          checked={tokenDetails.burningSupport}
          onCheckedChange={() => onToggleChange('burningSupport')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Pausing Support</Label>
          <p className="text-sm text-muted-foreground">Allows you to pause the token.</p>
        </div>
        <Switch
          checked={tokenDetails.pausingSupport}
          onCheckedChange={() => onToggleChange('pausingSupport')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Unlimited Supply</Label>
          <p className="text-sm text-muted-foreground">Enable unlimited supply for your token, requires minting support.</p>
        </div>
        <Switch
          checked={tokenDetails.unlimitedSupply}
          onCheckedChange={() => onToggleChange('unlimitedSupply')}
          disabled={!tokenDetails.mintingSupport}
        />
      </div>
    </Card>
  );
};