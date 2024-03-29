
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import { Box, Flex, Text, Spinner, Button, useToast, Grid} from '@chakra-ui/react'
import { FaEthereum } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { getAddressOrENS } from '../../../utils/helpers'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useWeb3 } from '../../../context/useWeb3'
import axios from 'axios'
import { gql } from '@apollo/client'
import client from '../../../apollo-client'


import { contractAddress, contractAbi } from '../../../config'



export default function Index(props) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const { web3Provider } = useWeb3()

    const AudioPlayer = dynamic(
        () => import('../../../components/AudioPlayer'),
        {ssr: false}
    )

    async function licenseSound(id) {
        setIsLoading(true)
        if (!web3Provider) {
            setIsLoading(false)
            toast({
                position: "top",
                title: "No wallet connected.",
                description: "Please connect your wallet to continue.",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            return
        }
            

        try {
            const signer = web3Provider.getSigner()
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const sound = await contract.sound(id)
            let price = sound.price

            let transaction = await contract.licenseSound(id, {value: price.toString()})
            await transaction.wait()
            router.push('/my-licenses')

        } catch (error) {
            toast({
                position: "top",
                title: "An error has occured.",
                description: "Your transaction can not be completed.",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            console.log(error)

        }
        setIsLoading(false)



    }

    if (isLoading) return <Flex justify="center" p={20}><Spinner size="xl"/></Flex>
    return (
        <>
            <Head>
                <title> {props.token.name} - {props.token.creator} | Elixir Sound Library</title>
            </Head>
            <Grid
                templateColumns={{sm:"repeat(1, 1fr)", md: "repeat(2, 1fr)"}}
                gap={8}
                p={10}
                >
                <Box w="100%" rounded="xl" overflow="hidden" border="1px" borderColor="gray.200" mr={6} pb={10}>
                    <AudioPlayer src={props.token.tokenURI}/>
                </Box>

                <Flex direction="column" w="100%">
                    <Text fontWeight="semibold" fontSize="3xl">{props.token.name}</Text>
                    <Text fontSize="xl" fontWeight="semibold" py={3}>Total Samples: <Text as="span" mr={8} fontSize="xl" fontWeight="normal" textColor="gray.500">{props.token.licenseCount}</Text></Text>
                    <Text>File type: {props.token.type}</Text>
                </Flex>
                <Flex p={5} direction="column" align="start" w="100%" rounded="xl" overflow="hidden" border="1px" borderColor="gray.200" mr={6} >
                    <Text fontSize="2xl" fontWeight="semibold">Created by: <Text as="span" mr={8} fontSize="xl" fontWeight="normal" textColor="gray.500">{props.token.ens}</Text></Text>
                    <NextLink href={`/${encodeURIComponent(props.token.creator)}`}><Button mt={5}>See more by this artist</Button></NextLink>
                </Flex>
                <Flex direction="column" w="100%" align="start" p={5} rounded="xl" overflow="hidden" border="1px" borderColor="gray.300" bg="gray.200" >
                        <Text>Price:</Text>
                        <Flex>
                                <Flex mr="1" fontWeight="bold" align="center"><FaEthereum/>{props.token.price}</Flex>
                                <Text>(${props.token.priceInUSD})</Text>
                        </Flex>                        
                        <Button bg="black" color="white" _hover={{bg: "gray.600"}} mt={5} px={4} onClick={() => licenseSound(props.token.tokenId)}>Sample</Button>

                </Flex>
            </Grid>
        </>

    )
}

export async function getStaticPaths() {

    const { data } = await client.query({
        query: gql`
            query {
                sounds {
                  id
                  tokenID
                      owner {
                    id
                  }
                }
              }
        `
    })

    let paths = data.sounds.map((sound) => {

        return {
            params: {
                userId: sound.owner.id,
                tokenId: sound.tokenID
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
    const userId = context.params.userId
    const { data } = await client.query({
        query: gql`
            query {
                sounds(where: {tokenID: ${tokenId}}) {
                  id
                  tokenID
                  tokenURI
                  price
                  owner {
                    id
                  }
                  licenseCount
                }
              }     
        `
    })
    let sound = data.sounds[0]

    let price = ethers.utils.formatUnits(sound.price, 'ether')

    let metadata = await axios.get(`https://ipfs.infura.io/${sound.tokenURI}`)

    let priceData = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`)
    let ethPrice = priceData.data.result.ethusd
    let priceInUSD = Number(price) * Number(ethPrice)
    priceInUSD = priceInUSD.toFixed(2)

    const provider = ethers.getDefaultProvider("homestead", {
        alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        infura: process.env.NEXT_PUBLIC_INFURA_API_KEY
    })
    let ens = await getAddressOrENS(userId, provider)

    let thisSound = {
        
        price,
        priceInUSD,
        tokenId: sound.tokenID,
        name: metadata.data.name,
        creator: userId,
        ens,
        tokenURI: `https://ipfs.infura.io/${metadata.data.audio}`,
        licenseCount: sound.licenseCount.toString(),
        type: metadata.data.type
    }


    return {
        props: {
            token: thisSound
        }
    }
}