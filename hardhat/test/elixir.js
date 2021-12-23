// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Elixir Sound Library", function () {

//   let elixir

//   before(async () => {
//     const Elixir = await hre.ethers.getContractFactory("ElixirSoundLibrary");
//     elixir = await Elixir.deploy();
  
//     await elixir.deployed();



//   })
//   it("should mint a sound and increment count", async function (){
//     const [_, creator, licensee] = await hre.ethers.getSigners()


//     let tx = await elixir.connect(creator).mintSound("https://elixir-sound-library.vercel.app/api/0", hre.ethers.utils.parseEther('0.1'))
//     await tx.wait()

//     const sound = await elixir.sound(0)

//     expect(sound.id.toString()).to.equal("0")
//     expect(sound.uri).to.equal("https://elixir-sound-library.vercel.app/api/0")

//     const count = await elixir.soundCount()
//     expect(Number(count)).to.equal(1)

//   })

//   /* *** LICENSING *** */


//   it("should license sound, add licensee to array, and payment is sent", async function () {
//     const [deployer, creator, licensee] = await hre.ethers.getSigners()

//     const provider = ethers.provider;


//     let initialCreatorBal = await provider.getBalance(creator.address)
//     let initialDeployerBal = await provider.getBalance(deployer.address)

//     await elixir.connect(licensee).licenseSound('0', { value: hre.ethers.utils.parseEther('0.1') });

//     let sound = await elixir.sound(0)

//     expect(sound.licensees).to.include(licensee.address)

//     // Payment
//     let newCreatorBal = await provider.getBalance(creator.address)
//     let newDeployerBal = await provider.getBalance(deployer.address)

//     let fee = Number(hre.ethers.utils.parseEther('0.1'))/50

//     let payment = Number(hre.ethers.utils.parseEther('0.1'))-fee


//     // had to format because rounding was off by wei
//     let difference = hre.ethers.utils.parseEther((Number(hre.ethers.utils.formatEther(Number(newDeployerBal)-Number(initialDeployerBal)))).toFixed(4))
//     expect(hre.ethers.utils.formatEther(difference)).to.equal(hre.ethers.utils.formatEther(fee))

//     difference = hre.ethers.utils.parseEther((Number(hre.ethers.utils.formatEther(Number(newCreatorBal)-Number(initialCreatorBal)))).toFixed(4))
//     expect(hre.ethers.utils.formatEther(difference)).to.equal(hre.ethers.utils.formatEther(payment))


//   })

//   it("should revert if already licensed, creator, or wrong ether", async function () {
//     const [_, creator, licensee, otherLicensee] = await hre.ethers.getSigners()

//     await expect(elixir.connect(licensee).licenseSound('0', { value: hre.ethers.utils.parseEther('0.1') })).to.be.revertedWith('Sound is already licensed')
//     await expect(elixir.connect(creator).licenseSound('0', { value: hre.ethers.utils.parseEther('0.1') })).to.be.revertedWith('Licensee cannot be the creator.')
//     await expect(elixir.connect(otherLicensee).licenseSound('0', { value: hre.ethers.utils.parseEther('0.05') })).to.be.revertedWith('Please submit the correct amount of ether')

//   })


//   /* *** UPDATE PRICE *** */
//   it("should allow owners to update price", async function () {
//     const [_, creator, licensee, otherLicensee] = await hre.ethers.getSigners()


//     await elixir.connect(creator).updatePrice(0, hre.ethers.utils.parseEther('0.2'))

//     let sound = await elixir.sound(0)

//     expect(sound.price.toString()).to.equal(hre.ethers.utils.parseEther('0.2'))

    

//   })

//   it("should revert if not creator", async function () {
//     const [_, creator, licensee, otherLicensee] = await hre.ethers.getSigners()
//     await expect(elixir.connect(licensee).updatePrice(0, hre.ethers.utils.parseEther('0.2'))).to.be.revertedWith('Only the creator can update the price.')
    
//   })



// });
