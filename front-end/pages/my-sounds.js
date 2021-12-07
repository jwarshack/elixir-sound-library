import { useState, useEffect } from 'react'
import SoundTable from '../components/SoundTable'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../config'


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
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const address = await signer.getAddress()
            const licenses = await contract.licenses()

            const data = []
    
            for(var i = 0; i < licenses.length; i++) {
                let lic = licenses[i].toNumber()
                const token = await contract.getSound(i)
                data.push(token)
            }
            let theseSounds = await Promise.all(data.map(async i => {
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let sound = {
                    price,
                    name: i.name,
                    creator: i.creator,
                    tokenURI: i.tokenURI,
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
        <Box p={6}>
            <SoundTable sounds={sounds}/>
        </Box>
    )
}
