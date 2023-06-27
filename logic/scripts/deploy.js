// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");

async function main() {
  const metadataURL = "ipfs:://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5"

  const lw3PunksContracts = await ethers.deployContract("LW3Punks", [metadataURL]);

  await lw3PunksContracts.waitForDeployment();

  console.log("LW3Punks deployed to:", lw3PunksContracts.target);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  // process.exitCode = 1 means that there was an error during the script execution
  // process.exit(1) // same as above
  process.exit(1)
})
