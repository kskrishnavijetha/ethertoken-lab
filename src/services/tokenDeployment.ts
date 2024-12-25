import { ethers } from "ethers";
import { TokenDetails } from "@/components/token/types";
import { tokenBytecode, ERC20_ABI } from "@/contracts/TokenContract";

export const deployToken = async (
  tokenDetails: TokenDetails,
  creationFee: string,
  signer: ethers.Signer
) => {
  const feeInWei = ethers.utils.parseEther(creationFee);
  
  const factory = new ethers.ContractFactory(
    ERC20_ABI,
    tokenBytecode,
    signer
  );

  const contract = await factory.deploy(
    tokenDetails.name,
    tokenDetails.symbol,
    ethers.utils.parseUnits(tokenDetails.initialSupply, tokenDetails.decimals),
    tokenDetails.decimals,
    {
      value: feeInWei,
    }
  );

  await contract.deployed();

  if (tokenDetails.mintingSupport && tokenDetails.initialSupply) {
    const mintTx = await contract.mint(
      await signer.getAddress(),
      ethers.utils.parseUnits(tokenDetails.initialSupply, tokenDetails.decimals)
    );
    await mintTx.wait();
  }

  return contract;
};