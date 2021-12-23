const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("mappingElixir", function () {

    it('should mint and increment counter', async () => {
        const [_, minter, licensee] = await hre.ethers.getSigners()

        const NFT = await hre.ethers.getContractFactory("MappingElixir");
        let nft = await NFT.deploy();
      
        await nft.deployed();

        await nft.connect(minter).mintSoundMapping(hre.ethers.utils.parseEther('0.1'), "sdfdsfsdfsd")


        // await nft.connect(minter).mintSoundMapping({price: hre.ethers.utils.parseEther('0.1'), uri: "sdfdsfsdfsd"})


        // await nft.connect(licensee).licenseSoundMapping(0, { value: hre.ethers.utils.parseEther('0.1')})

        // await nft.connect(minter).updatePriceMapping(0, hre.ethers.utils.parseEther('0.2'))

        let sound = await nft.soundMapping(0)


    })

})