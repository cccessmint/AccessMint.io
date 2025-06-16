task("deploy-multiticket", "Deploy AccessMint Dynamic MultiTicket contract")
  .addParam("name", "Collection Name")
  .addParam("symbol", "Collection Symbol")
  .addParam("baseuri", "Base Metadata URI")
  .addParam("owner", "Initial Owner Address")
  .setAction(async ({ name, symbol, baseuri, owner }, hre) => {
    const factory = await hre.ethers.getContractFactory("AccessMintDynamicMulti");

    const contract = await factory.deploy(
      name,
      symbol,
      baseuri,
      owner
    );

    await contract.waitForDeployment();

    console.log("✅ Deployed AccessMintDynamicMulti at:", await contract.getAddress());
  });

