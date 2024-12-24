import { Card } from "@/components/ui/card";

export const TokenAbout = () => {
  return (
    <Card className="p-6 space-y-6 animate-fadeIn bg-card/30 border border-border/50">
      <h2 className="text-3xl font-bold tracking-tight">ETHEREUM TOKEN CREATOR</h2>
      <div className="space-y-4 text-left text-muted-foreground">
        <p>
          If you're looking for an easy and efficient way to create ERC 20 tokens on the Ethereum blockchain, our online ERC 20 token Maker is the perfect solution. We offer an intuitive and user-friendly platform that allows users to customize and launch their tokens in just a few minutes.
        </p>
        <p>
          With our Ethereum token maker, you don't have to be an expert in blockchain technology to create and manage your own tokens.
        </p>
        <p>
          Furthermore, we provide our users with high security and privacy. All transactions and token information are protected by our smart contract on chain. You can be sure that your assets are secure during the process and after it finishes.
        </p>
        <p>
          We aim to give users a smooth and efficient experience when creating ERC 20 tokens on the Ethereum blockchain. With our online creator, you can customize your tokens with logos, descriptions and issuance details so they are unique and representative of your brand or project.
        </p>
      </div>
    </Card>
  );
};