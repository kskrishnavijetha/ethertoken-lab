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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-xl space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div className="text-left space-y-2 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-token-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-token-600">
                <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Ethereum Token Creator</h1>
              <p className="text-muted-foreground">Create and deploy your own ERC20 token on Ethereum in just 1 minute with low fee</p>
            </div>
          </div>
          <WalletConnect />
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