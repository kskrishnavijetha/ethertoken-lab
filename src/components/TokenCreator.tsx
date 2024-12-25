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
import { tokenBytecode, ERC20_ABI } from "../contracts/TokenContract";

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

      // Convert creation fee to Wei
      const feeInWei = ethers.utils.parseEther(CREATION_FEE);
      
      // Request contract deployment
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Deploy the token contract
      const factory = new ethers.ContractFactory(
        ERC20_ABI,
        tokenBytecode,
        signer
      );

      toast({
        title: "Deploying Token",
        description: "Please confirm the transaction in your wallet...",
      });

      const contract = await factory.deploy(
        tokenDetails.name,
        tokenDetails.symbol,
        ethers.utils.parseUnits(tokenDetails.initialSupply, tokenDetails.decimals),
        tokenDetails.decimals,
        {
          value: feeInWei,
        }
      );

      // Wait for deployment to complete
      await contract.deployed();

      // If minting is supported and initial supply is set, mint tokens
      if (tokenDetails.mintingSupport && tokenDetails.initialSupply) {
        toast({
          title: "Minting Tokens",
          description: "Please confirm the minting transaction...",
        });

        const mintTx = await contract.mint(
          accounts[0],
          ethers.utils.parseUnits(tokenDetails.initialSupply, tokenDetails.decimals)
        );
        await mintTx.wait();
      }

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
                Create Token ({CREATION_FEE} ETH + gas)
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Creation fee: {CREATION_FEE} ETH + network gas fees
              </p>
            </div>
          </form>
        </Card>

        {tokenDetails.name && <TokenPreview tokenDetails={tokenDetails} />}
        
        <TokenFAQ />
        
        <TokenAbout />
      </div>
    </div>
  );
};

export default TokenCreator;
