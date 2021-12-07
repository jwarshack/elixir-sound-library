import React from 'react'
import Image from 'next/image'
import Identicon from "identicon.js"
import { Box, VStack, Heading } from '@chakra-ui/react'
import SoundGrid from '../../components/SoundGrid'
import { contractAddress, contractAbi } from '../../config'
import { ethers } from 'ethers'
import { shortAddress } from '../../utils/helpers'


export default function index(props) {
    return (
        <Box>
            <VStack pt={10}>
                <Image height="100px" width="100px" layout="fixed" src={`data:image/png;base64,${new Identicon(props.userId, 100).toString()}`} className="rounded"/>
                <Heading>{shortAddress(props.userId)}</Heading>
            </VStack>
            <SoundGrid sounds={props.tokens}/>
        </Box>
    )
}

export async function getStaticPaths() {
    const provider = new ethers.providers.JsonRpcProvider(`https://speedy-nodes-nyc.moralis.io/e67ef907b3b5634adefb2f7f/eth/rinkeby`)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const tokenCount = await soundLibrary.tokenCount()
    const data = []
    for (var i = 0; i < tokenCount; i++) {
        const token = await soundLibrary.getSound(i)
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
    const provider = new ethers.providers.JsonRpcProvider(`https://speedy-nodes-nyc.moralis.io/e67ef907b3b5634adefb2f7f/eth/rinkeby`)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const creatorSounds = await soundLibrary.creatorSounds(userId)
    const data = []
    for (var i = 0; i < creatorSounds.length; i++) {
        let tokenId = creatorSounds[i]
        const token = await soundLibrary.getSound(tokenId)
        data.push(token)
    }

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
            userId: userId,
            tokens: theseSounds
        }
    }
}
