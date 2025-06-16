require("dotenv").config();
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const AccessMintDynamicMulti = await hre.ethers.getContractFactory("AccessMintDynamicMulti");

  const name = "AccessMint MultiTicket";
  const symbol = "AMT";
  const baseURI = "http://localhost:3000/api/token-uri/";
  const initialOwner = process.env.OWNER_ADDRESS;

  const contract = await AccessMintDynamicMulti.deploy(
    name,
    symbol,
    baseURI,
    initialOwner
  );

  console.log("✅ AccessMintDynamicMulti deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

