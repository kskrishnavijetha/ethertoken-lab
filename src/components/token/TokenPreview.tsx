import { Card } from "@/components/ui/card";
import { TokenDetails } from "./types";

interface TokenPreviewProps {
  tokenDetails: TokenDetails;
}

export const TokenPreview = ({ tokenDetails }: TokenPreviewProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/30 border border-border/50 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Token Preview</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{tokenDetails.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Symbol:</span>
          <span className="font-medium">{tokenDetails.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Supply:</span>
          <span className="font-medium">{tokenDetails.initialSupply}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Decimals:</span>
          <span className="font-medium">{tokenDetails.decimals}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Features:</span>
          <span className="font-medium">
            {[
              tokenDetails.mintingSupport && "Minting",
              tokenDetails.burningSupport && "Burning",
              tokenDetails.pausingSupport && "Pausing",
              tokenDetails.unlimitedSupply && "Unlimited Supply"
            ].filter(Boolean).join(", ") || "None"}
          </span>
        </div>
      </div>
    </Card>
  );
};