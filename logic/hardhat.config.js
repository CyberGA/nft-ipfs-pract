require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" })

/** @type import('hardhat/config').HardhatUserConfig */

const { RPC_HTTP_URL, PRIVATE_KEY, SCANNER_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    polygon_mumbai: {
      url: RPC_HTTP_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: SCANNER_API_KEY
  }
};
