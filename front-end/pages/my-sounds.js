import { useState, useEffect } from 'react'
import Head from 'next/head'
import SoundTable from '../components/SoundTable'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../config'
import axios from 'axios'



export default function MySounds() {
    const [sounds, setSounds] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { web3Provider } = useWeb3()

    useEffect(() => {
        loadSounds()
    }, [])



    async function loadSounds() {
        if (web3Provider) {
            const signer = web3Provider.getSigner()
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const address = await signer.getAddress()
            console.log(address)
            const mySounds = await contract.creatorSounds(address)
            console.log(mySounds)

            const data = []

            for(var i = 0; i < mySounds.length; i++) {
                const token = await contract.sound(i)
                data.push(token)
            }
            let theseSounds = await Promise.all(data.map(async i => {
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let metadata = await axios.get(i.uri)
                let sound = {
                    price,
                    name: metadata.data.name,
                    creator: i.creator,
                    tokenURI: metadata.data.audio,
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

