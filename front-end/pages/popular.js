import React from 'react'
import Head from 'next/head'
import SoundGrid from '../components/SoundGrid'
import { ethers } from 'ethers'
import axios from 'axios'

import { contractAddress, contractAbi } from '../config'


export default function popular(props) {
    return (
        <>
            <Head>
                <title>Popular | Elixir Sound Library</title>
            </Head>
            <SoundGrid sounds={props.sounds}/>

        </>
    )
}


export async function getStaticProps() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RINKEBY_URL)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const soundCount = await soundLibrary.soundCount()
    const data = []
    for (var i = 0; i < soundCount; i++) {
        const sound = await soundLibrary.sound(i)
        data.push(sound)
    }
    console.log(data)
    let theseSounds = await Promise.all(data.map(async i => {
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let metadata = await axios.get(i.uri)

        let sound = {
            name: metadata.data.name,
            tokenId: i.id.toString(),
            price,
            creator: i.creator,
            tokenURI: metadata.data.audio,
            licenseCount: i.licensees.length
        }

        console.log(sound)

        return sound


    }))
    theseSounds = theseSounds.sort((a,b) => b.licenseCount - a.licenseCount)

    
    return {
        props: {
            sounds: theseSounds
        }
    }
  }
