const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Elixir Sound Library", function () {
  it("should mint a sound", async function (){

    const Elixir = await hre.ethers.getContractFactory("ElixirSoundLibrary");
    const elixir = await Elixir.deploy();
  
    await elixir.deployed();

    const [_, creator, licensee] = await hre.ethers.getSigners()



    let tx = await elixir.connect(creator).mintSound("https://elixir-sound-library.vercel.app/api/0", hre.ethers.utils.parseEther('0.1'))
    await tx.wait()

    const sound = await elixir.sound(0)

    expect(sound.id.toString()).to.equal("0")
    expect(sound.uri).to.equal("https://elixir-sound-library.vercel.app/api/0")
    
    


  })

});
