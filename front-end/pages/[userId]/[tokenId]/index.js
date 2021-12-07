
import React from 'react'
import { ethers } from 'ethers'
import { Box, Flex, Text, Spacer, Button} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { shortAddress } from '../../../utils/helpers'

import { contractAddress, contractAbi } from '../../../config'


export default function Index(props) {

    const AudioPlayer = dynamic(
        () => import('../../../components/AudioPlayer'),
        {ssr: false}
    )

    return (
        <Flex direction="column" p={10}>
            <Flex justify="center" w="100%" maxWidth="1000px" mx="auto">
                <Box w="50%" rounded="xl" overflow="hidden" border="1px" borderColor="gray.200" mr={6} pb={10}>
                    <AudioPlayer src={props.token.tokenURI}/>
                </Box>

                <Flex direction="column" w="50%">
                    <Text fontWeight="semibold" fontSize="3xl">{props.token.name}</Text>
                    <Text>Samples: {props.token.licenseCount}</Text>
                    <Spacer/>
                    <Flex direction="column" align="start" p={5} rounded="xl" overflow="hidden" border="1px" borderColor="gray.300" bg="gray.200" >
                        <Text>Price:</Text>
                        <Text>{props.token.price} ETH</Text>
                        <Button bg="black" color="white" _hover={{bg: "gray.600"}} mt={5} px={4}>Sample</Button>

                    </Flex>
                </Flex>
                
            </Flex>
            <Flex w="100%" maxWidth="1000px" pt={10} mx="auto">
                <Flex p={5} direction="column" align="start" w="50%" rounded="xl" overflow="hidden" border="1px" borderColor="gray.200" mr={6} >
                    <Text fontSize="2xl" fontWeight="semibold">Created by: <Text as="span" mr={8} fontSize="xl" fontWeight="normal" textColor="gray.500">{shortAddress(props.token.creator)}</Text></Text>
                    <Button mt={5}>See more by this artist</Button>
                </Flex>
                
            </Flex>
        </Flex>
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
                userId: token.creator,
                tokenId: token.tokenId.toString()
            }
        }
    })

    return {
        paths,
        fallback: false
    }
}


export async function getStaticProps(context) {
    const tokenId = context.params.tokenId
    const provider = new ethers.providers.JsonRpcProvider(`https://speedy-nodes-nyc.moralis.io/e67ef907b3b5634adefb2f7f/eth/rinkeby`)
    const soundLibrary = new ethers.Contract(contractAddress, contractAbi, provider)
    const sound = await soundLibrary.getSound(tokenId)
    let price = ethers.utils.formatUnits(sound.price.toString(), 'ether')

    let thisSound = {
        price,
        tokenId: sound.tokenId.toNumber(),
        name: sound.name,
        creator: sound.creator,
        tokenURI: sound.tokenURI,
        licenseCount: sound.licensees.length
    }


    return {
        props: {
            token: thisSound
        }
    }
}