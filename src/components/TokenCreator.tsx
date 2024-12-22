import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface TokenDetails {
  name: string;
  symbol: string;
  initialSupply: string;
  decimals: string;
  mintingSupport: boolean;
  burningSupport: boolean;
  pausingSupport: boolean;
  unlimitedSupply: boolean;
}

const TokenCreator = () => {
  const { toast } = useToast();
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    name: "",
    symbol: "",
    initialSupply: "",
    decimals: "18",
    mintingSupport: false,
    burningSupport: false,
    pausingSupport: false,
    unlimitedSupply: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (feature: keyof TokenDetails) => {
    setTokenDetails((prev) => ({
      ...prev,
      [feature]: !prev[feature],
      // If unlimited supply is enabled, ensure minting support is also enabled
      ...(feature === 'unlimitedSupply' && !prev.unlimitedSupply && { mintingSupport: true }),
      // If minting support is disabled, ensure unlimited supply is also disabled
      ...(feature === 'mintingSupport' && prev.mintingSupport && { unlimitedSupply: false }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!tokenDetails.name || !tokenDetails.symbol || !tokenDetails.initialSupply) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically interact with a smart contract
    toast({
      title: "Success",
      description: "Token creation initiated. Please confirm the transaction in your wallet.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-xl space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Create ERC20 Token</h1>
          <p className="text-muted-foreground">Deploy your own ERC20 token in minutes</p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-card/30 border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., My Token"
                  value={tokenDetails.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>

              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Minting Support</Label>
                    <p className="text-sm text-muted-foreground">Enable minting for your token, only the owner can mint.</p>
                  </div>
                  <Switch
                    checked={tokenDetails.mintingSupport}
                    onCheckedChange={() => handleToggleChange('mintingSupport')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Burning Support</Label>
                    <p className="text-sm text-muted-foreground">Enable burning for your token.</p>
                  </div>
                  <Switch
                    checked={tokenDetails.burningSupport}
                    onCheckedChange={() => handleToggleChange('burningSupport')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pausing Support</Label>
                    <p className="text-sm text-muted-foreground">Allows you to pause the token.</p>
                  </div>
                  <Switch
                    checked={tokenDetails.pausingSupport}
                    onCheckedChange={() => handleToggleChange('pausingSupport')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Unlimited Supply</Label>
                    <p className="text-sm text-muted-foreground">Enable unlimited supply for your token, requires minting support.</p>
                  </div>
                  <Switch
                    checked={tokenDetails.unlimitedSupply}
                    onCheckedChange={() => handleToggleChange('unlimitedSupply')}
                    disabled={!tokenDetails.mintingSupport}
                  />
                </div>
              </Card>
            </div>

            <Button type="submit" className="w-full">
              Create Token
            </Button>
          </form>
        </Card>

        {tokenDetails.name && (
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
        )}
      </div>
    </div>
  );
};

export default TokenCreator;