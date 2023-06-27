const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LW3Punks Contract Testing", function () {
  const metadataURL = "ipfs:://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5"

  async function deployLW3Punks() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const lw3PunksContracts = await ethers.deployContract("LW3Punks", [metadataURL]);
    await lw3PunksContracts.waitForDeployment();

    return { lw3PunksContracts, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should get the right contract owner", async function () {
      const { owner, lw3PunksContracts } = await loadFixture(deployLW3Punks);

      expect(await lw3PunksContracts.owner()).to.equal(owner.address);
    });

    it("Should get the right contract metadata baseURI", async function () {
      const { lw3PunksContracts } = await loadFixture(deployLW3Punks);

      expect(await lw3PunksContracts.getBaseURI()).to.equal(metadataURL);
    });

    it("Show the max NFT supply", async function () {
      const { lw3PunksContracts } = await loadFixture(deployLW3Punks);

      expect(await lw3PunksContracts.maxTokenIds()).to.equal(10);
    });

    it("The contract is initially open for sales", async function () {
      const { lw3PunksContracts } = await loadFixture(deployLW3Punks);

      expect(await lw3PunksContracts._paused()).to.equal(false);
    });
  });
});
