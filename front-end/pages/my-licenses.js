import { useState, useEffect } from 'react'
import Head from 'next/head'
import SoundTable from '../components/SoundTable'
import { Spinner, Box, Text, Flex } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../config'
import axios from 'axios'


export default function Licenses() {
    const [sounds, setSounds] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { web3Provider } = useWeb3()

    useEffect(() => {
        loadSounds()
    }, [web3Provider])

    async function loadSounds() {
        if (web3Provider) {
            const signer = web3Provider.getSigner()
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const address = await signer.getAddress()
            const licenses = await contract.licenses()

            const data = []
    
            for(var i = 0; i < licenses.length; i++) {
                let lic = licenses[i].toNumber()
                const token = await contract.sound(lic)
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
                    licenseCount: i.licensees.length
                }
                return sound

            }))
            setSounds(theseSounds)
        }
        setIsLoading(false)

    }

    if (isLoading) return <Flex justify="center" p={20}><Spinner size="xl"/></Flex>
    if (!sounds.length || !web3Provider) return <Text p={8} fontSize="3xl">There are no sounds to display</Text>

    return (
        <>
            <Head>
                <title>My Licenses | Elixir Sound Library</title>
            </Head>

            <Box p={6}>
                <SoundTable sounds={sounds}/>
            </Box>
        </>
    )
}