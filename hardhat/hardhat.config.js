require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config()


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  defaultNetwork: "hardhat",
 }
//   networks: {
//     hardhat: {
//       chainId: 1337
//     },
//     rinkeby: {
//       url: process.env.ALCHEMY_RINKEBY_URL,
//       accounts: [process.env.PRIVATE_KEY]
//     },
//     rinkebyArbitrum: {
//       url: "https://rinkeby.arbitrum.io/rpc",
//       accounts: [process.env.PRIVATE_KEY],
//       companionNetworks: {
//         l1: "rinkeby",
//       },
//     },
//     arbitrum: {
//       url: process.env.INFURA_ARBITRUM_URL,
//       accounts: [process.env.PRIVATE_KEY],
//     },
//   },
//   etherscan: {
//     apiKey: process.env.ARBISCAN_API_KEY
//   },
//   solidity: {
//     version: "0.8.4",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 1000,
//       },
//     },
//   },
// };