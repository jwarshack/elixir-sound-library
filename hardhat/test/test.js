const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Elixir Sound Library", function () {

  let elixir

  before(async () => {
    const Elixir = await hre.ethers.getContractFactory("ElixirSoundLibrary");
    elixir = await Elixir.deploy();
  
    await elixir.deployed();
  })
  it("should mint a sound and increment counter", async function (){


    const [_, creator, licensee] = await hre.ethers.getSigners()



    let tx = await elixir.connect(creator).mintSound({price: hre.ethers.utils.parseEther('0.1'), tokenURI: "https://elixir-sound-library.vercel.app/api/0"})
    await tx.wait()

    const sound = await elixir.sound(0)


    expect(sound.tokenId.toString()).to.equal("0")
    expect(sound.uri).to.equal("https://elixir-sound-library.vercel.app/api/0")

    const tokenCounter = await elixir.tokenCounter()


    expect(tokenCounter).to.equal('1')

  
  })

  it("should transfer ownership and update", async function () {
    const [_, creator, licensee, owner] = await hre.ethers.getSigners()

    const sound = await elixir.sound(0)

    expect(sound.tokenOwner).to.equal(creator.address)

    await elixir.connect(creator).transferFrom(creator.address, owner.address, 0)

    const transferredSound = await elixir.sound(0)

    expect(transferredSound.tokenOwner).to.equal(owner.address)


  })

  it("should license a sound and add license", async function (){
    const [deployer, creator, licensee, owner, licensee2] = await hre.ethers.getSigners()


    let provider = ethers.getDefaultProvider();


    let initialDeployerBal = await provider.getBalance(deployer.address)

    let newDeployerBal

    let initialLicenseeBal = await provider.getBalance(licensee.address)
    let newLicenseeBal


    console.log(initialDeployerBal.toString())
    console.log(initialLicenseeBal.toString())

    await elixir.connect(licensee).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')})
    await elixir.connect(licensee2).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')})


    const sound = await elixir.sound(0)

    expect(sound.licensees.length).to.equal(2)


    // Payment




  })

  it("should update price", async function (){

    const [_, creator, licensee] = await hre.ethers.getSigners()

    let tx = await elixir.connect(creator).mintSound({price: hre.ethers.utils.parseEther('0.2'), tokenURI: "https://elixir-sound-library.vercel.app/api/1"})
    await tx.wait()

    await elixir.connect(creator).updatePrice('1', hre.ethers.utils.parseEther('0.3'))

    const sound = await elixir.sound(1)

    expect(sound.price.toString()).to.equal(hre.ethers.utils.parseEther('0.3'))
  })

  it("should handle errors correctly", async function() {

    const [_, creator, licensee] = await hre.ethers.getSigners()
    
    // LICENSING
    await expect(elixir.connect(licensee).licenseSound('1', {value: hre.ethers.utils.parseEther('0.2')} )).to.be.revertedWith("Please submit the correct amount of ether")
    await expect(elixir.connect(licensee).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')} )).to.be.revertedWith("Sound is already licensed")
    await expect(elixir.connect(creator).licenseSound('1', {value: hre.ethers.utils.parseEther('0.3')} )).to.be.revertedWith("Licensee cannot be the owner")

    // UPDATING PRICE
    await expect(elixir.connect(licensee).updatePrice('1', hre.ethers.utils.parseEther('0.05') )).to.be.revertedWith("Only the owner can update the price")


  })

  it ("should change balances", async function() {
    const [deployer, creator, licensee] = await hre.ethers.getSigners()

    await expect(await elixir.connect(licensee).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')})).to.changeEtherBalance(deployer)

  })

  



});
