import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { WalletConnect } from "./wallet/WalletConnect";
import { TokenFeatures } from "./token/TokenFeatures";
import { TokenPreview } from "./token/TokenPreview";
import { TokenDetails } from "./token/types";

const CREATION_FEE = "0.005";

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
      ...(feature === 'unlimitedSupply' && !prev.unlimitedSupply && { mintingSupport: true }),
      ...(feature === 'mintingSupport' && prev.mintingSupport && { unlimitedSupply: false }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenDetails.name || !tokenDetails.symbol || !tokenDetails.initialSupply) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Error",
        description: "Please install MetaMask to create tokens",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }

      // Convert ETH to Wei (1 ETH = 10^18 Wei)
      const feeInWei = BigInt(parseFloat(CREATION_FEE) * 1e18);
      
      // Send transaction
      const transactionParameters = {
        to: "0x0000000000000000000000000000000000000000", // Replace with your fee collection address
        from: accounts[0],
        value: "0x" + feeInWei.toString(16), // Convert to hex
      };

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      toast({
        title: "Success",
        description: "Token creation initiated. Please confirm the transaction in your wallet.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <WalletConnect />
      </div>
      
      <img 
        src="/lovable-uploads/6e748589-2477-49e4-ac3b-a7bba950af18.png" 
        alt="Ethereum Logo" 
        className="w-24 h-24 mb-6"
      />
      
      <div className="w-full max-w-xl space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Create and deploy your own ERC20 token on Ethereum in just 1 minute</p>
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

              <TokenFeatures 
                tokenDetails={tokenDetails}
                onToggleChange={handleToggleChange}
              />
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full">
                Create Token ({CREATION_FEE} ETH + gas)
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Creation fee: {CREATION_FEE} ETH + network gas fees
              </p>
            </div>
          </form>
        </Card>

        {tokenDetails.name && <TokenPreview tokenDetails={tokenDetails} />}
      </div>
    </div>
  );
};

export default TokenCreator;
