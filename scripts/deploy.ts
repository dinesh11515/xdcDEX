import { ethers } from "hardhat";

async function main() {
  const PolyDEX = await ethers.getContractFactory("polyDEX");
  const polydex = await PolyDEX.deploy();
  await polydex.deployed();
  console.log("polyDEX deployed to:", polydex.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
