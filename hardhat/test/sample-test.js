const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Elixir Sound Library", function () {
  it("should mint a sound", async function (){
    const Elixir = await hre.ethers.getContractFactory("ElixirSoundLibrary");
    const elixir = await Elixir.deploy();
  
    await elixir.deployed();

    const [_, creator, licensee] = await hre.ethers.getSigners()



    let tx = await elixir.connect(creator).mintSound(hre.ethers.utils('0.1'))


  })

});
