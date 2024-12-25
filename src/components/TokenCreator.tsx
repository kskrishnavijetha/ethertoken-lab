import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WalletConnect } from "./wallet/WalletConnect";
import { TokenFeatures } from "./token/TokenFeatures";
import { TokenPreview } from "./token/TokenPreview";
import { TokenAdvancedOptions } from "./token/TokenAdvancedOptions";
import { TokenInstructions } from "./token/TokenInstructions";
import { TokenForm } from "./token/TokenForm";
import { TokenFAQ } from "./token/TokenFAQ";
import { TokenAbout } from "./token/TokenAbout";
import { TokenDetails } from "./token/types";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { deployToken } from "@/services/tokenDeployment";

const CREATION_FEE = "0.005";

const TokenCreator = () => {
  const { toast } = useToast();
  const { account, connectWallet } = useWalletConnection();
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
  const [deployedContract, setDeployedContract] = useState<{
    address: string;
    txHash: string;
  } | null>(null);

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

  const handleDistributionChange = (wallets: any[]) => {
    console.log('Wallet distribution updated:', wallets);
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

    if (!account) {
      const connectedAccount = await connectWallet();
      if (!connectedAccount) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      toast({
        title: "Deploying Token",
        description: "Please confirm the transaction in your wallet...",
      });

      const contract = await deployToken(tokenDetails, CREATION_FEE, signer);
      const receipt = await contract.deployTransaction.wait();

      setDeployedContract({
        address: contract.address,
        txHash: receipt.transactionHash,
      });

      toast({
        title: "Success",
        description: `Token ${tokenDetails.symbol} has been created and minted!`,
      });
    } catch (error: any) {
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
          <h1 className="text-4xl font-bold tracking-tight">Ethereum Token Creator</h1>
          <p className="text-muted-foreground">Create and deploy your own ERC20 token on Ethereum in just 1 minute</p>
        </div>

        <TokenInstructions />

        <Card className="p-6 backdrop-blur-sm bg-card/30 border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TokenForm 
              tokenDetails={tokenDetails}
              onInputChange={handleInputChange}
            />

            <TokenFeatures 
              tokenDetails={tokenDetails}
              onToggleChange={handleToggleChange}
            />

            <TokenAdvancedOptions 
              onDistributionChange={handleDistributionChange}
            />

            <div className="space-y-2">
              <Button type="submit" className="w-full">
                {!account ? "Connect Wallet to Create Token" : `Create Token (${CREATION_FEE} ETH + gas)`}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Creation fee: {CREATION_FEE} ETH + network gas fees
              </p>
            </div>
          </form>
        </Card>

        {deployedContract && (
          <Card className="p-6 backdrop-blur-sm bg-card/30 border border-border/50 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Deployment Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contract Address:</span>
                <a
                  href={`https://etherscan.io/address/${deployedContract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {`${deployedContract.address.slice(0, 6)}...${deployedContract.address.slice(-4)}`}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction Hash:</span>
                <a
                  href={`https://etherscan.io/tx/${deployedContract.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {`${deployedContract.txHash.slice(0, 6)}...${deployedContract.txHash.slice(-4)}`}
                </a>
              </div>
            </div>
          </Card>
        )}

        {tokenDetails.name && <TokenPreview tokenDetails={tokenDetails} />}
        
        <TokenFAQ />
        
        <TokenAbout />
      </div>
    </div>
  );
};

export default TokenCreator;