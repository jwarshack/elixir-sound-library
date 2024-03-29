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


    let provider = ethers.provider;


    let initialDeployerBal = await provider.getBalance(deployer.address)

    let initialLicenseeBal = await provider.getBalance(licensee.address)

    let initialOwnerBal = await provider.getBalance(owner.address)





    await elixir.connect(licensee).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')})
    await elixir.connect(licensee2).licenseSound('0', {value: hre.ethers.utils.parseEther('0.1')})

    const sound = await elixir.sound(0)



    let newDeployerBal = await provider.getBalance(deployer.address)

    let newLicenseeBal = await provider.getBalance(licensee.address)

    let newOwnerBal = await provider.getBalance(owner.address)

    console.log("Deployer")
    console.log(hre.ethers.utils.formatEther(initialDeployerBal).toString())
    console.log(hre.ethers.utils.formatEther(newDeployerBal).toString())

    console.log("Licensee")
    console.log(hre.ethers.utils.formatEther(initialLicenseeBal).toString())
    console.log(hre.ethers.utils.formatEther(newLicenseeBal).toString())

    console.log("Owner")
    console.log(hre.ethers.utils.formatEther(initialOwnerBal).toString())
    console.log(hre.ethers.utils.formatEther(newOwnerBal).toString())




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

  it("shoudl withdraw", async function () {
    const [deployer, creator, licensee, owner, licensee2] = await hre.ethers.getSigners()


    let provider = ethers.provider;

    let contractBal = await provider.getBalance( elixir.address)
    console.log("contract amount", contractBal.toString())


    let deployerBal = await provider.getBalance(deployer.address)
    console.log("deplyer bal", deployerBal.toString())

    await elixir.connect(deployer).withdraw()

    deployerBal = await provider.getBalance(deployer.address)
    console.log("deplyer bal", deployerBal.toString())

    contractBal = await provider.getBalance( elixir.address)
    console.log("contract amount", contractBal.toString())

  })
  



});
