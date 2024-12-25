import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = () => {
  const [account, setAccount] = useState<string>("");
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
        return accounts[0];
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to connect wallet",
          variant: "destructive",
        });
        return null;
      }
    } else {
      toast({
        title: "Error",
        description: "Please install MetaMask",
        variant: "destructive",
      });
      return null;
    }
  };

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        return accounts[0];
      }
    }
    return null;
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return { account, connectWallet, checkConnection };
};