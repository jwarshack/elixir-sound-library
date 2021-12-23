
const hre = require("hardhat");

async function main() {

  const Elixir = await hre.ethers.getContractFactory("MappingElixir");
  const elixir = await Elixir.deploy();

  await elixir.deployed();

  console.log("Elixir deployed to:", elixir.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
