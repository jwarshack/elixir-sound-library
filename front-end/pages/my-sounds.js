import { useState, useEffect } from 'react'
import Head from 'next/head'
import SoundTable from '../components/SoundTable'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'
import { ethers } from 'ethers'
import { gql } from '@apollo/client'
import client from '../apollo-client'

import axios from 'axios'



export default function MySounds() {
    const [sounds, setSounds] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { web3Provider } = useWeb3()

    useEffect(() => {
        loadSounds()
    }, [web3Provider])



    async function loadSounds() {
        if (web3Provider) {
            const signer = web3Provider.getSigner()
            const address = await signer.getAddress()

            const { data } = await client.query({
                query: gql`
                    query {
                        users(where: {id: "${address.toLowerCase()}"}) {
                          id
                          sounds {
                            id
                            tokenID
                            tokenURI
                            price
                            licenseCount
                          }
                        }
                      }     
                `
            })
        
            let theseSounds = await Promise.all(data.users[0].sounds.map(async i => {
                let price = ethers.utils.formatUnits(i.price, 'ether')
                let metadata = await axios.get(`https://ipfs.infura.io/${i.tokenURI}`)
        
                let sound = {
                    name: metadata.data.name,
                    tokenId: i.tokenID.toString(),
                    price,
                    tokenURI: `https://ipfs.infura.io/${metadata.data.audio}`,
                    creator: address,
                    licenseCount: i.licenseCount.toString()
                }
                return sound
            }))
            setSounds(theseSounds)
        }
        setIsLoading(false)

    }

    if (isLoading) return <Flex justify="center" p={20}><Spinner size="xl"/></Flex>
    if (!web3Provider) return <Text p={8} fontSize="3xl">Please connect your wallet to see your created sounds.</Text>
    if (!sounds.length || !web3Provider) return <Text p={8} fontSize="3xl">There are no sounds to display</Text>

    return (
        <>
            <Head>
                <title>My Sounds | Elixir Sound Library</title>
            </Head>
            <Box p={6}>
                <SoundTable sounds={sounds}/>
            </Box>
        </>
    )
}

