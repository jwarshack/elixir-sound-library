import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Identicon from "identicon.js"
import { Box, VStack, Heading } from '@chakra-ui/react'
import SoundGrid from '../../components/SoundGrid'
import { contractAddress, contractAbi } from '../../config'
import { ethers } from 'ethers'
import { shortAddress } from '../../utils/helpers'
import axios from 'axios'
import Davatar from '@davatar/react'


export default function index(props) {
    return (
        <>
            <Head>
                <title>Profile - {props.userId} Elixir Sound Library</title>
            </Head>
            <VStack pt={10}>
                {/* <Image height="100px" width="100px" layout="fixed" alt="identicon" src={`data:image/png;base64,${new Identicon(props.userId, 100).toString()}`} className="rounded"/> */}
                <Davatar size={75} address={props.userId}/>
                <Heading>{shortAddress(props.userId)}</Heading>
            </VStack>
            <SoundGrid sounds={props.tokens}/>
        </>
    )
}

export async function getStaticPaths() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RINKEBY_URL)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const tokenCount = await soundLibrary.soundCount()
    const data = []
    for (var i = 0; i < tokenCount; i++) {
        const token = await soundLibrary.sound(i)
        data.push(token)
    }

    let paths = data.map((token) => {
        return {
            params: {
                userId: token.creator
            }
        }
    })

    return {
        paths,
        fallback: false
    }
}



export async function getStaticProps(context) {
    const userId = context.params.userId
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RINKEBY_URL)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const creatorSounds = await soundLibrary.creatorSounds(userId)
    const data = []
    for (var i = 0; i < creatorSounds.length; i++) {
        let tokenId = creatorSounds[i]
        const token = await soundLibrary.sound(tokenId)
        data.push(token)
    }

    let theseSounds = await Promise.all(data.map(async i => {
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let metadata = await axios.get(i.uri)
        let sound = {
            price,
            tokenId: i.id.toNumber(),
            name: metadata.data.name,
            creator: i.creator,
            tokenURI: metadata.data.audio,
            licenseCount: i.licensees.length
        }
        console.log(sound)

        return sound


    }))

    return {
        props: {
            userId: userId,
            tokens: theseSounds
        }
    }
}
