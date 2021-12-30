const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Elixir Sound Library test", function () {

    it('should mint and increment counter', async () => {
        const [_, minter] = await hre.ethers.getSigners()

        const NFT = await hre.ethers.getContractFactory("TestNFT");
        let nft = await NFT.deploy();
      
        await nft.deployed();

        await nft.connect(minter).mint(hre.ethers.utils.parseEther('0.1'), "sdfdsfsdfsd")



    })

})