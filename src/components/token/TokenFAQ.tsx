import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const TokenFAQ = () => {
  return (
    <Card className="p-6 space-y-4 animate-fadeIn bg-card/30 border border-border/50">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is an ERC20 token?</AccordionTrigger>
          <AccordionContent>
            An ERC20 token is a standard interface for fungible tokens on the Ethereum blockchain. It allows for the creation of tokens that can be transferred between addresses and used in various decentralized applications.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How much does it cost to create a token?</AccordionTrigger>
          <AccordionContent>
            The creation fee is 0.005 ETH plus network gas fees. The exact cost will vary depending on network congestion and gas prices at the time of creation.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How long does token creation take?</AccordionTrigger>
          <AccordionContent>
            The token creation process typically takes a few seconds to a few minutes, depending on network congestion. Once the transaction is confirmed, you'll receive the total supply in your connected wallet.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Can I modify my token after creation?</AccordionTrigger>
          <AccordionContent>
            Some aspects of your token can be modified if you enable certain features during creation, such as minting new tokens or burning existing ones. However, basic properties like the name and symbol cannot be changed after deployment.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>What wallet do I need to create a token?</AccordionTrigger>
          <AccordionContent>
            You need an Ethereum-compatible wallet like MetaMask with sufficient ETH to cover the creation fee and gas costs. Make sure your wallet is connected to the Ethereum network before creating your token.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};