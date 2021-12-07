import React from 'react'
import Head from 'next/head'
import SoundGrid from '../components/SoundGrid'
import { ethers } from 'ethers'


import { contractAddress, contractAbi } from '../config'

export default function Browse(props) {
    return (
        <>
            <Head>
                <title>Browse | Elixir Sound Library</title>
            </Head>
            <SoundGrid sounds={props.sounds}/>
        </>
    )
}

export async function getStaticProps() {

    const provider = new ethers.providers.JsonRpcProvider(`https://speedy-nodes-nyc.moralis.io/e67ef907b3b5634adefb2f7f/eth/rinkeby`)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const tokenCount = await soundLibrary.tokenCount()
    const data = []
    for (var i = 0; i < tokenCount; i++) {
        const token = await soundLibrary.getSound(i)
        data.push(token)
    }
    console.log(data)
    let theseSounds = await Promise.all(data.map(async i => {
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let sound = {
            price,
            tokenId: i.tokenId.toNumber(),
            name: i.name,
            creator: i.creator,
            tokenURI: i.tokenURI,
            licenseCount: i.licensees.length
        }
        console.log(sound)

        return sound


    }))
    
    return {
        props: {
            sounds: theseSounds
        }
    }
  }