import { Card } from "@/components/ui/card";

export const TokenInstructions = () => {
  return (
    <Card className="p-6 space-y-4 mb-8 animate-fadeIn bg-card/30 border border-border/50">
      <h2 className="text-xl font-semibold">How to Create Your Token</h2>
      <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
        <li>Connect your Ethereum wallet using the button in the top right</li>
        <li>Enter your desired token name (e.g., "My Token")</li>
        <li>Choose a symbol for your token (e.g., "MTK")</li>
        <li>Set the initial supply for your token</li>
        <li>Click "Create Token" and confirm the transaction in your wallet</li>
      </ol>
      <div className="mt-4 p-4 bg-token-100/10 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Creation cost: 0.005 WETH (includes all Ethereum network fees)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The creation process takes a few seconds. Once completed, you'll receive the total supply in your connected wallet.
        </p>
      </div>
    </Card>
  );
};